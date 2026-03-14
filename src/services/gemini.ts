import { GoogleGenAI, Type } from "@google/genai";
import { BidAnalysis } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

export async function analyzeBidDocument(text: string): Promise<Partial<BidAnalysis>> {
  const model = "gemini-3.1-pro-preview";
  
  const response = await ai.models.generateContent({
    model,
    contents: [
      {
        role: "user",
        parts: [
          {
            text: `Analise o seguinte edital de licitação e extraia as informações detalhadas em formato JSON.
            O texto do edital é:
            
            ${text.substring(0, 30000)} // Limit text size for prompt
            
            Retorne um objeto JSON seguindo exatamente esta estrutura:
            {
              "generalInfo": {
                "organ": "Nome do órgão",
                "bidNumber": "Número do edital",
                "modality": "Modalidade",
                "judgmentType": "Tipo de julgamento",
                "object": "Resumo do objeto",
                "estimatedValue": "Valor estimado se houver"
              },
              "deadlines": {
                "publicSession": "Data/Hora",
                "proposalSubmission": "Data limite",
                "appeal": "Prazo",
                "impugnation": "Prazo",
                "delivery": "Prazo",
                "contractSigning": "Prazo"
              },
              "paymentConditions": {
                "deadline": "Prazo",
                "measurement": true/false,
                "delivery": true/false,
                "retentions": "Detalhes",
                "invoiceRequirement": "Detalhes",
                "contractGuarantee": "Detalhes"
              },
              "location": {
                "address": "Endereço",
                "city": "Cidade",
                "state": "Estado",
                "department": "Secretaria",
                "deliveryPoint": "Local exato"
              },
              "risks": [
                {
                  "title": "Título do risco",
                  "riskLevel": "high|medium|low",
                  "explanation": "Por que é um risco",
                  "snippet": "Trecho do edital",
                  "page": 1
                }
              ],
              "checklist": [
                {
                  "document": "Nome do documento",
                  "status": "required|possibly|not_identified"
                }
              ],
              "executiveSummary": ["Ponto 1", "Ponto 2", "..."],
              "difficultyScore": {
                "level": "Easy|Moderate|Difficult",
                "score": 75,
                "reasoning": "Explicação do score"
              }
            }`
          }
        ]
      }
    ],
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          generalInfo: {
            type: Type.OBJECT,
            properties: {
              organ: { type: Type.STRING },
              bidNumber: { type: Type.STRING },
              modality: { type: Type.STRING },
              judgmentType: { type: Type.STRING },
              object: { type: Type.STRING },
              estimatedValue: { type: Type.STRING }
            }
          },
          deadlines: {
            type: Type.OBJECT,
            properties: {
              publicSession: { type: Type.STRING },
              proposalSubmission: { type: Type.STRING },
              appeal: { type: Type.STRING },
              impugnation: { type: Type.STRING },
              delivery: { type: Type.STRING },
              contractSigning: { type: Type.STRING }
            }
          },
          paymentConditions: {
            type: Type.OBJECT,
            properties: {
              deadline: { type: Type.STRING },
              measurement: { type: Type.BOOLEAN },
              delivery: { type: Type.BOOLEAN },
              retentions: { type: Type.STRING },
              invoiceRequirement: { type: Type.STRING },
              contractGuarantee: { type: Type.STRING }
            }
          },
          location: {
            type: Type.OBJECT,
            properties: {
              address: { type: Type.STRING },
              city: { type: Type.STRING },
              state: { type: Type.STRING },
              department: { type: Type.STRING },
              deliveryPoint: { type: Type.STRING }
            }
          },
          risks: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING },
                riskLevel: { type: Type.STRING, enum: ["high", "medium", "low"] },
                explanation: { type: Type.STRING },
                snippet: { type: Type.STRING },
                page: { type: Type.NUMBER }
              }
            }
          },
          checklist: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                document: { type: Type.STRING },
                status: { type: Type.STRING, enum: ["required", "possibly", "not_identified"] }
              }
            }
          },
          executiveSummary: {
            type: Type.ARRAY,
            items: { type: Type.STRING }
          },
          difficultyScore: {
            type: Type.OBJECT,
            properties: {
              level: { type: Type.STRING, enum: ["Easy", "Moderate", "Difficult"] },
              score: { type: Type.NUMBER },
              reasoning: { type: Type.STRING }
            }
          }
        }
      }
    }
  });

  return JSON.parse(response.text || "{}");
}
