import { GoogleGenAI, Type } from "@google/genai";
import { MaterialData, FinancialReport, Persona, WhatIfResponse } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// Upgraded to Pro model for complex reasoning and calculations
const modelId = 'gemini-3-pro-preview';

/**
 * Generates an optimization plan (What-If Analysis)
 */
export const generateOptimization = async (
  currentMaterials: MaterialData[],
  userPrompt: string
): Promise<WhatIfResponse> => {
  const prompt = `
    Current Building Materials: ${JSON.stringify(currentMaterials)}
    User Request: "${userPrompt}"

    Task:
    1. Adjust the volumes of materials based on the user's request (e.g., replace steel with timber).
    2. Recalculate implicitly the impact, but return the NEW material list with updated volumes.
    3. Calculate the estimated percentage change in total Carbon and Total Cost compared to the original.
    4. Provide a brief explanation of the structural and sustainability implications.

    Return JSON matching the schema.
  `;

  const response = await ai.models.generateContent({
    model: modelId,
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          materials: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING },
                volume: { type: Type.NUMBER },
                factor: { type: Type.NUMBER },
                costPerUnit: { type: Type.NUMBER }
              }
            }
          },
          explanation: { type: Type.STRING },
          carbonReductionPercent: { type: Type.NUMBER },
          costDeltaPercent: { type: Type.NUMBER }
        }
      }
    }
  });

  const text = response.text;
  if (!text) throw new Error("No response from AI");
  return JSON.parse(text) as WhatIfResponse;
};

/**
 * Generates the Investment Decision Report
 */
export const generateFinancialReport = async (
  inputs: {
    lifespan: number;
    holdingPeriod: number;
    totalCarbon: number;
    area: number;
    location: string;
  },
  persona: Persona
): Promise<FinancialReport> => {
  const prompt = `
    Role: Real Estate Financial Analyst AI.
    Persona: Generating report for a ${persona}.
    
    Building Data:
    - Expected Lifespan: ${inputs.lifespan} years
    - Holding Period: ${inputs.holdingPeriod} years
    - Total Embodied Carbon: ${inputs.totalCarbon} kgCO2e
    - Gross Floor Area: ${inputs.area} m2
    - Location: ${inputs.location} (Consider UK/London Carbon Tax trends)

    Task:
    Perform a financial stress test and asset valuation.
    1. Predict NPV (Net Present Value) trajectory over the holding period considering rising carbon taxes.
    2. Identify the "Stranded Asset" year (when carbon penalties outweigh asset value growth).
    3. Calculate sensitivity: if carbon price rises, how much does valuation drop?
    4. Provide specific advice for the ${persona}.
       - If Manager: Focus on ROI and Risk.
       - If Developer: Focus on Liquidity and Cost-Balance.
       - If Compliance: Focus on TCFD and Disclosure.

    Return JSON.
  `;

  const response = await ai.models.generateContent({
    model: modelId,
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          riskRating: { type: Type.STRING, enum: ['Low', 'Medium', 'High', 'Critical'] },
          npvData: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                year: { type: Type.NUMBER },
                value: { type: Type.NUMBER }
              }
            }
          },
          strandedYear: { type: Type.NUMBER, nullable: true },
          sensitivityData: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                carbonPriceIncrease: { type: Type.STRING },
                valuationDrop: { type: Type.NUMBER }
              }
            }
          },
          liquidityBoost: { type: Type.NUMBER, nullable: true },
          interestSaved: { type: Type.NUMBER, nullable: true },
          advice: {
            type: Type.ARRAY,
            items: { type: Type.STRING }
          },
          reportType: { type: Type.STRING, enum: ['ROI', 'Breakeven', 'Compliance'] }
        }
      }
    }
  });

  const text = response.text;
  if (!text) throw new Error("No response from AI");
  return JSON.parse(text) as FinancialReport;
};