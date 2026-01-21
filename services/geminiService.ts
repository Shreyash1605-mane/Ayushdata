
import { GoogleGenAI, LiveServerMessage, Modality, Blob } from '@google/genai';

// Initialize GoogleGenAI directly with process.env.API_KEY as per guidelines
export const createGenAI = () => new GoogleGenAI({ apiKey: process.env.API_KEY as string });

export const SYSTEM_INSTRUCTION = `
You are Ayush, the AI Health Assistant for AyushData.
AyushData is a platform for Blood and Stem Cell donation.
Your goals:
1. Help users understand the donation process.
2. Check basic eligibility for blood/stem cell donation (e.g., age 18-65, weight >45kg, healthy).
3. Inform users about local blood banks.
4. Provide comforting and professional guidance.
Be concise, friendly, and efficient. If a user is in a medical emergency, advise them to call emergency services (e.g., 911 or 102).
`;

// Helper for encoding/decoding as required by SDK
export function encode(bytes: Uint8Array): string {
  let binary = '';
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

export function decode(base64: string): Uint8Array {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

export async function decodeAudioData(
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number,
  numChannels: number,
): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}

export function createBlob(data: Float32Array): Blob {
  const l = data.length;
  const int16 = new Int16Array(l);
  for (let i = 0; i < l; i++) {
    int16[i] = data[i] * 32768;
  }
  return {
    data: encode(new Uint8Array(int16.buffer)),
    mimeType: 'audio/pcm;rate=16000',
  };
}
