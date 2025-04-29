import OpenAI from 'openai';
import { SupportedLanguage } from './translate';

const isTestEnv = process.env.NODE_ENV === 'test';

const openai = isTestEnv 
  ? {
      chat: {
        completions: {
          create: () => Promise.resolve({
            choices: [{ message: { content: '- 要点1\n- 要点2\n- 要点3\n- 要点4\n- 要点5' } }]
          })
        }
      }
    } as unknown as OpenAI
  : new OpenAI({
      apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY || process.env.OPENAI_API_KEY || '',
      dangerouslyAllowBrowser: true,
    });

export interface SummaryResult {
  originalText: string;
  summaryPoints: string[];
  language: SupportedLanguage;
}

/**
 * テキストの5行要約を生成します
 * @param text 要約するテキスト
 * @param language 要約言語
 * @returns 要約結果
 */
export async function generateSummary(
  text: string,
  language: SupportedLanguage
): Promise<SummaryResult> {
  try {
    const languageMap = {
      ja: '日本語',
      ko: '韓国語'
    };
    
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: `あなたは高品質な要約システムです。以下のテキストを${languageMap[language]}で5つの箇条書きに要約してください。
          各要点は1文に簡潔にまとめ、重要な情報を優先してください。
          出力形式は次のとおりです：
          - 要点1
          - 要点2
          - 要点3
          - 要点4
          - 要点5
          必ず5つの箇条書きにしてください。それ以上でも以下でも不可です。`
        },
        { 
          role: 'user', 
          content: text 
        }
      ],
      temperature: 0.5,
    });
    
    const summaryText = response.choices[0].message.content || '';
    
    const summaryPoints = summaryText
      .split('\n')
      .filter(line => line.trim().startsWith('-'))
      .map(line => line.replace(/^-\s*/, '').trim());
    
    if (summaryPoints.length !== 5) {
      throw new Error('要約は5つの箇条書きでなければなりません');
    }
    
    return {
      originalText: text,
      summaryPoints,
      language
    };
  } catch (error) {
    console.error('Summary error:', error);
    throw new Error('要約中にエラーが発生しました');
  }
}

export function validateSummaryPointCount(points: string[]): boolean {
  return points.length === 5;
}
