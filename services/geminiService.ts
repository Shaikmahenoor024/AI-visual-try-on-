import { GoogleGenAI, Modality } from "@google/genai";

// Utility to fetch a URL and convert it to a base64 string.
const urlToBase64 = async (url: string): Promise<{ mimeType: string, data: string }> => {
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    const blob = await response.blob();
    const mimeType = blob.type;
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
            if (typeof reader.result !== 'string') {
                return reject(new Error("Failed to read file as base64 string."));
            }
            const base64Data = reader.result.split(',')[1];
            resolve({ mimeType, data: base64Data });
        };
        reader.onerror = reject;
        reader.readAsDataURL(blob);
    });
};

const fileDataToPart = (base64String: string, type: string) => {
    const [header, data] = base64String.split(',');
    if (!header || !data) throw new Error(`Invalid base64 string format for ${type} image.`);
    const mimeTypeMatch = header.match(/:(.*?);/);
    if (!mimeTypeMatch || !mimeTypeMatch[1]) throw new Error(`Could not determine mimeType for ${type} image.`);
    const mimeType = mimeTypeMatch[1];
    return {
        inlineData: {
            mimeType,
            data,
        },
    };
};

export const generateVirtualTryOnImage = async (
    personImageBase64: string, 
    outfitImage: string,
    accessoryImageBase64: string | null,
    sceneryImageBase64: string | null,
    userPrompt: string | null,
    isVariation: boolean = false
): Promise<string | null> => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API_KEY environment variable not set.");
  }
  const ai = new GoogleGenAI({ apiKey });

  try {
    const personPart = fileDataToPart(personImageBase64, 'person');
    
    let outfitPart;
    if (outfitImage.startsWith('data:image')) {
      outfitPart = fileDataToPart(outfitImage, 'outfit');
    } else {
      const { mimeType, data } = await urlToBase64(outfitImage);
      outfitPart = { inlineData: { mimeType, data } };
    }

    const parts: any[] = [personPart, outfitPart];

    let prompt = `You are an expert virtual stylist. Your task is to generate a new, photorealistic image based on the images provided.
- The first image is the person. It is critical that you maintain the person's original pose, face, and identity.
- The second image is an item of clothing. Realistically drape this clothing on the person, conforming to their shape and pose, and matching the lighting and shadows of the original photo.
`;

    if (accessoryImageBase64) {
      parts.push(fileDataToPart(accessoryImageBase64, 'accessory'));
      prompt += `- An image of an accessory is also provided. Place this accessory on the person in a natural and appropriate way. The accessory should also match the lighting and style of the scene.\n`;
    }

    if (sceneryImageBase64) {
        parts.push(fileDataToPart(sceneryImageBase64, 'scenery'));
        prompt += `- An image of scenery/background is also provided. Replace the original background of the person's photo with this new scenery. Ensure the person is seamlessly integrated into the new environment, paying attention to lighting, shadows, and perspective.\n`;
    }

    if (userPrompt && userPrompt.trim() !== '') {
        prompt += `- Additionally, apply the following specific user request: "${userPrompt}".\n`;
    }
    
    prompt += `Combine these elements to create a single, cohesive, high-quality image. The final output must only be the generated image, with no text.`;
    
    if (isVariation) {
        prompt += ` Generate a slightly different version or creative interpretation of this scene.`;
    }
    
    parts.push({ text: prompt });

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image-preview',
      contents: { parts },
      config: {
          responseModalities: [Modality.IMAGE, Modality.TEXT],
      },
    });
    
    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) {
        const base64ImageBytes: string = part.inlineData.data;
        const mimeType = part.inlineData.mimeType;
        return `data:${mimeType};base64,${base64ImageBytes}`;
      }
    }

    return null;
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    throw error;
  }
};
