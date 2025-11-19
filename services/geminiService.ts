
import { GoogleGenAI } from "@google/genai";

// NOTE: API Key is obtained from the environment variable.
// The application assumes process.env.API_KEY is available.

let aiClient: GoogleGenAI | null = null;

const getClient = () => {
  if (!aiClient) {
    aiClient = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  }
  return aiClient;
};

export const generateCampusImage = async (prompt: string): Promise<string> => {
  try {
    const client = getClient();
    
    // Use the high-quality image generation model as requested
    const response = await client.models.generateImages({
      model: 'imagen-4.0-generate-001',
      prompt: prompt,
      config: {
        numberOfImages: 1,
        outputMimeType: 'image/jpeg',
        aspectRatio: '16:9',
      },
    });

    const generatedImage = response.generatedImages?.[0];
    if (generatedImage?.image?.imageBytes) {
      const base64ImageBytes = generatedImage.image.imageBytes;
      return `data:image/jpeg;base64,${base64ImageBytes}`;
    }
    
    console.warn("No image generated, returning placeholder.");
    return 'https://picsum.photos/800/450';
  } catch (error) {
    console.error("Error generating campus image:", error);
    // Fallback image
    return 'https://picsum.photos/800/450';
  }
};
