import { GoogleGenAI } from "@google/genai";
import { CartItem, Product } from "../types";

const getClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API Key not found");
  }
  return new GoogleGenAI({ apiKey });
};

export const getRecipeSuggestion = async (items: CartItem[]): Promise<string> => {
  if (items.length === 0) return "Add some items to get a recipe suggestion!";

  const ai = getClient();
  const itemNames = items.map(i => `${i.quantity}x ${i.name}`).join(", ");
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `I have these ingredients in my shopping cart: ${itemNames}. Suggest one simple, delicious recipe I can make. Keep it brief (under 50 words).`,
    });
    return response.text || "Could not generate recipe.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Chef AI is currently offline.";
  }
};

export const identifyProductFromImage = async (base64Image: string): Promise<{ name: string; category: string; confidence: number; weight_g?: number } | null> => {
  const ai = getClient();
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: 'image/jpeg',
              data: base64Image.split(',')[1] // Remove data:image/jpeg;base64, prefix
            }
          },
          {
            text: "Identify this grocery product. Return JSON with 'name' (generic product name), 'category' (e.g. Dairy, Produce, Bakery), 'confidence' (0.0-1.0), and 'weight_g' (estimated net weight in grams as a number, e.g. 500). Do not include markdown formatting."
          }
        ]
      },
      config: {
        responseMimeType: "application/json"
      }
    });

    const text = response.text || "{}";
    return JSON.parse(text);
  } catch (error) {
    console.error("Gemini Vision Error:", error);
    return null;
  }
};