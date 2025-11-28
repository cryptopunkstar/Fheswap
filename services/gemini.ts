import { GoogleGenAI } from "@google/genai";
import { GeneratedContract, DeploymentStep } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
const MODEL_NAME = 'gemini-2.5-flash';

export const generateSmartContract = async (tokenA: string, tokenB: string): Promise<GeneratedContract> => {
  const prompt = `
    Create a Solidity smart contract for a private token swap using Fully Homomorphic Encryption (FHE).
    The swap should be between ${tokenA} and ${tokenB}.
    Use the syntax and patterns common for fhEVM (Zama) contracts (e.g., TFHE library, euint32).
    
    Requirements:
    1. Import necessary TFHE libraries.
    2. Define a function to swap encrypted amounts.
    3. Include comments explaining the "encrypted" aspect.
    
    Output the response in JSON format with two fields:
    - "code": The full solidity code string.
    - "explanation": A markdown string explaining how it works.
  `;

  try {
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      }
    });

    const text = response.text || "{}";
    return JSON.parse(text) as GeneratedContract;
  } catch (error) {
    console.error("Gemini API Error:", error);
    return {
      code: "// Error generating contract. Please check API Key.",
      explanation: "Failed to connect to AI service."
    };
  }
};

export const getDeploymentGuide = async (): Promise<DeploymentStep[]> => {
  const prompt = `
    Provide a step-by-step guide to deploying an FHE smart contract to the Sepolia testnet (specifically assuming usage of an FHE coprocessor or Zama's fhEVM testnet which is compatible with Sepolia/Ethereum tooling).
    
    Return a JSON array of objects, where each object has:
    - "title": Title of the step.
    - "description": Detailed explanation.
    - "command": Optional shell command (e.g., npm install, npx hardhat run).
  `;

  try {
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      }
    });

    const text = response.text || "[]";
    return JSON.parse(text) as DeploymentStep[];
  } catch (error) {
    console.error("Gemini API Error:", error);
    return [
      {
        title: "Error",
        description: "Could not fetch deployment guide. Please try again.",
      }
    ];
  }
};

export const getLocalSetupGuide = async (): Promise<DeploymentStep[]> => {
  const prompt = `
    Provide a step-by-step guide to setting up a local development environment for Fully Homomorphic Encryption (FHE) dApps using Zama's fhEVM.
    Focus on running a local fhEVM node using Docker and configuring Hardhat.
    
    Return a JSON array of objects, where each object has:
    - "title": Title of the step.
    - "description": Detailed explanation.
    - "command": Optional shell command (e.g., docker run commands).
  `;

  try {
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      }
    });

    const text = response.text || "[]";
    return JSON.parse(text) as DeploymentStep[];
  } catch (error) {
    console.error("Gemini API Error:", error);
    return [
      {
        title: "Error",
        description: "Could not fetch local setup guide. Please try again.",
      }
    ];
  }
};

export const chatWithExpert = async (message: string, history: {role: string, parts: {text: string}[]}[]): Promise<string> => {
  try {
    const chat = ai.chats.create({
      model: MODEL_NAME,
      history: history,
      config: {
        systemInstruction: "You are an expert blockchain developer specializing in Fully Homomorphic Encryption (FHE) and Ethereum. You help users deploy privacy-preserving dApps.",
      }
    });

    const result = await chat.sendMessage({ message });
    return result.text || "I couldn't process that request.";
  } catch (error) {
    console.error("Gemini Chat Error:", error);
    return "Error communicating with the AI expert.";
  }
};