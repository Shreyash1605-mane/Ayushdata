
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { GoogleGenAI, LiveServerMessage, Modality } from '@google/genai';
import { 
  createGenAI, 
  SYSTEM_INSTRUCTION, 
  decode, 
  decodeAudioData, 
  createBlob,
  encode
} from '../services/geminiService';
import { Mic, MicOff, Phone, X, Volume2, Waves, MessageSquare, Headphones } from 'lucide-react';
import { realtimeDb } from '../services/realtimeStore';

interface LiveAssistantProps {
  userMobile?: string;
}

export const LiveAssistant: React.FC<LiveAssistantProps> = ({ userMobile }) => {
  const [isActive, setIsActive] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [transcript, setTranscript] = useState<string[]>([]);
  
  const audioContextRef = useRef<AudioContext | null>(null);
  const outputAudioContextRef = useRef<AudioContext | null>(null);
  const sessionRef = useRef<any>(null);
  const sourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());
  const nextStartTimeRef = useRef<number>(0);
  const streamRef = useRef<MediaStream | null>(null);
  const transcriptRef = useRef<string[]>([]);

  // Update ref when state changes so stopSession can use current transcript
  useEffect(() => {
    transcriptRef.current = transcript;
  }, [transcript]);

  const stopSession = useCallback(async () => {
    if (sessionRef.current) {
      sessionRef.current.close?.();
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
    }
    if (audioContextRef.current) audioContextRef.current.close();
    if (outputAudioContextRef.current) outputAudioContextRef.current.close();
    
    // Summary logic: if there's an active user and a conversation happened
    if (userMobile && transcriptRef.current.length > 1) {
      try {
        const ai = createGenAI();
        const summaryResponse = await ai.models.generateContent({
          model: 'gemini-3-flash-preview',
          contents: `Provide a very short, one-sentence professional summary for a medical dashboard history of this conversation between a donor and an AI assistant named Ayush: ${transcriptRef.current.join('\n')}`,
        });
        
        const summary = summaryResponse.text?.trim() || "Consulted Ayush Assistant regarding donation.";
        
        realtimeDb.addCallRecord(userMobile, {
          id: `CALL-${Math.random().toString(36).substring(2, 7).toUpperCase()}`,
          timestamp: new Date().toLocaleString(),
          summary: summary
        });
      } catch (err) {
        console.error("Failed to generate call summary:", err);
      }
    }

    setIsActive(false);
    setIsConnecting(false);
    setTranscript(prev => [...prev, "[Session Ended]"]);
  }, [userMobile]);

  const startSession = async () => {
    try {
      setIsConnecting(true);
      const ai = createGenAI();
      
      const inputCtx = new AudioContext({ sampleRate: 16000 });
      const outputCtx = new AudioContext({ sampleRate: 24000 });
      
      audioContextRef.current = inputCtx;
      outputAudioContextRef.current = outputCtx;
      
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const sessionPromise = ai.live.connect({
        model: 'gemini-2.5-flash-native-audio-preview-12-2025',
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: {
            voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Kore' } },
          },
          systemInstruction: SYSTEM_INSTRUCTION,
          inputAudioTranscription: {},
          outputAudioTranscription: {},
        },
        callbacks: {
          onopen: () => {
            setIsActive(true);
            setIsConnecting(false);
            setTranscript(["Hello! I'm Ayush, your automated AI donation assistant. How can I help you today?"]);
            
            const source = inputCtx.createMediaStreamSource(stream);
            const scriptProcessor = inputCtx.createScriptProcessor(4096, 1, 1);
            
            scriptProcessor.onaudioprocess = (e) => {
              const inputData = e.inputBuffer.getChannelData(0);
              const pcmBlob = createBlob(inputData);
              sessionPromise.then(session => {
                session.sendRealtimeInput({ media: pcmBlob });
              });
            };
            
            source.connect(scriptProcessor);
            scriptProcessor.connect(inputCtx.destination);
          },
          onmessage: async (message: LiveServerMessage) => {
            const base64Audio = message.serverContent?.modelTurn?.parts[0]?.inlineData?.data;
            if (base64Audio) {
              const outCtx = outputAudioContextRef.current!;
              nextStartTimeRef.current = Math.max(nextStartTimeRef.current, outCtx.currentTime);
              
              const audioBuffer = await decodeAudioData(decode(base64Audio), outCtx, 24000, 1);
              const source = outCtx.createBufferSource();
              source.buffer = audioBuffer;
              source.connect(outCtx.destination);
              
              source.addEventListener('ended', () => {
                sourcesRef.current.delete(source);
              });
              
              source.start(nextStartTimeRef.current);
              nextStartTimeRef.current += audioBuffer.duration;
              sourcesRef.current.add(source);
            }

            if (message.serverContent?.inputTranscription) {
              setTranscript(prev => [...prev, `You: ${message.serverContent.inputTranscription.text}`]);
            }
            if (message.serverContent?.outputTranscription) {
              setTranscript(prev => [...prev, `Ayush: ${message.serverContent.outputTranscription.text}`]);
            }

            if (message.serverContent?.interrupted) {
              sourcesRef.current.forEach(s => s.stop());
              sourcesRef.current.clear();
              nextStartTimeRef.current = 0;
            }
          },
          onerror: (e) => {
            console.error("Live Assistant Error:", e);
            stopSession();
          },
          onclose: () => {
            setIsActive(false);
          }
        }
      });

      sessionRef.current = await sessionPromise;
    } catch (err) {
      console.error("Failed to start AI Assistant:", err);
      setIsConnecting(false);
      alert("Microphone access is required for the AI Voice Assistant.");
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {isActive ? (
        <div className="w-80 h-[500px] bg-white rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.15)] flex flex-col overflow-hidden border border-slate-200 animate-in slide-in-from-bottom-5 duration-300">
          <div className="bg-slate-900 p-5 flex items-center justify-between text-white">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-3 h-3 bg-red-500 rounded-full absolute -top-1 -right-1 border-2 border-slate-900 animate-pulse"></div>
                <Headphones className="w-6 h-6 text-red-500" />
              </div>
              <div>
                <span className="font-black text-sm block tracking-tight">Ayush Assistant</span>
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Active Voice Link</span>
              </div>
            </div>
            <button onClick={stopSession} className="hover:bg-white/10 p-2 rounded-xl transition-colors">
              <X className="w-5 h-5 text-slate-400" />
            </button>
          </div>
          
          <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-slate-50 scrollbar-hide">
            {transcript.map((line, i) => {
              const isUser = line.startsWith('You:');
              return (
                <div key={i} className={`flex ${isUser ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2 duration-300`}>
                  <div className={`max-w-[85%] p-3 rounded-2xl text-xs font-medium leading-relaxed ${
                    isUser ? 'bg-slate-900 text-white rounded-tr-none' : 'bg-white text-slate-600 shadow-sm border border-slate-100 rounded-tl-none'
                  }`}>
                    {line.replace(/^(You:|Ayush:)/, '').trim()}
                  </div>
                </div>
              );
            })}
            <div className="flex justify-center py-6">
              <div className="flex items-center gap-1.5 h-10">
                {[1, 2, 3, 4, 5, 6, 7].map(i => (
                  <div 
                    key={i} 
                    className="w-1.5 bg-red-600 rounded-full animate-bounce" 
                    style={{ 
                      height: `${Math.random() * 30 + 10}px`, 
                      animationDuration: `${Math.random() * 0.5 + 0.5}s`,
                      animationDelay: `${i * 0.1}s` 
                    }} 
                  />
                ))}
              </div>
            </div>
          </div>
          
          <div className="p-5 bg-white border-t border-slate-100 flex flex-col gap-3">
            <div className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-center flex items-center justify-center gap-2">
              <Volume2 className="w-3 h-3 text-red-600" /> Ayush is listening...
            </div>
            <button 
              onClick={stopSession}
              className="w-full py-4 bg-red-50 text-red-600 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-red-100 transition-all shadow-sm"
            >
              End Call Session
            </button>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-end gap-3 group">
          <div className="bg-slate-900 text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity translate-x-2 group-hover:translate-x-0 pointer-events-none mb-1 shadow-xl">
             Need help? Ask Ayush
          </div>
          
          <button
            onClick={isConnecting ? undefined : startSession}
            disabled={isConnecting}
            className={`w-16 h-16 rounded-full shadow-[0_15px_35px_rgba(239,68,68,0.25)] flex items-center justify-center transition-all hover:scale-110 active:scale-95 ${
              isConnecting ? 'bg-slate-200 cursor-not-allowed' : 'bg-red-600 pulse-red text-white'
            }`}
          >
            {isConnecting ? (
              <div className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <Mic className="w-7 h-7" />
            )}
          </button>
          
          {!isConnecting && (
            <button 
              onClick={startSession}
              className="px-6 py-3 bg-white border border-slate-100 rounded-2xl shadow-lg flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-900 hover:text-red-600 transition-all animate-in slide-in-from-right-4 duration-500"
            >
              <MessageSquare className="w-4 h-4" /> Start AI Call
            </button>
          )}
        </div>
      )}
    </div>
  );
};
