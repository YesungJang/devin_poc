import OpenAI from 'openai';
import { SupportedLanguage } from './translate';

const isTestEnv = process.env.NODE_ENV === 'test';

const isDev = process.env.NODE_ENV === 'development' || isTestEnv;
const hasValidApiKey = (process.env.NEXT_PUBLIC_OPENAI_API_KEY && process.env.NEXT_PUBLIC_OPENAI_API_KEY !== 'your_api_key_here') || 
                      (process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY !== 'your_api_key_here');

const openai = isDev || !hasValidApiKey
  ? {
      audio: {
        speech: {
          create: () => {
            console.log('Using mock TTS data');
            const mockAudioBuffer = new ArrayBuffer(1024);
            return {
              arrayBuffer: () => Promise.resolve(mockAudioBuffer)
            };
          }
        }
      }
    } as unknown as OpenAI
  : new OpenAI({
      apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY || process.env.OPENAI_API_KEY || '',
      dangerouslyAllowBrowser: true,
    });

export interface TTSOptions {
  text: string;
  language: SupportedLanguage;
  speed?: number; // 話速調整（0.25-4.0）
}

interface TTSResult {
  audioUrl: string;
  text: string;
  language: SupportedLanguage;
}

/**
 * テキストから音声を生成します
 * @param options TTSオプション
 * @returns 音声URL、テキスト、言語を含む結果
 */
export async function generateSpeech(options: TTSOptions): Promise<TTSResult> {
  try {
    const { text, language, speed = 1.0 } = options;
    
    const voiceMap = {
      ja: 'shimmer', // 日本語に適した音声
      ko: 'shimmer'  // 韓国語に適した音声（shimmerは多言語対応）
    };
    
    const response = await openai.audio.speech.create({
      model: 'tts-1',
      voice: voiceMap[language],
      input: text,
      speed,
      response_format: 'mp3', // 128 kbps MP3ストリーム
    });
    
    const arrayBuffer = await response.arrayBuffer();
    
    const blob = new Blob([arrayBuffer], { type: 'audio/mpeg' });
    
    const audioUrl = URL.createObjectURL(blob);
    
    return {
      audioUrl,
      text,
      language
    };
  } catch (error) {
    console.error('TTS error:', error);
    throw new Error('音声生成中にエラーが発生しました');
  }
}
