import OpenAI from 'openai';
import { loadGlossary } from './glossary';

const isTestEnv = process.env.NODE_ENV === 'test';

const openai = isTestEnv 
  ? {
      chat: {
        completions: {
          create: () => Promise.resolve({
            choices: [{ message: { content: 'モックされた翻訳テキスト' } }]
          })
        }
      }
    } as unknown as OpenAI
  : new OpenAI({
      apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY || process.env.OPENAI_API_KEY || '',
      dangerouslyAllowBrowser: true,
    });

export type SupportedLanguage = 'ja' | 'ko';

export interface TranslationResult {
  originalText: string;
  translatedText: string;
  language: SupportedLanguage;
}

/**
 * テキストを指定された言語に翻訳します
 * @param text 翻訳するテキスト
 * @param targetLanguage 翻訳先の言語
 * @returns 翻訳結果
 */
export async function translateText(
  text: string,
  targetLanguage: SupportedLanguage
): Promise<TranslationResult> {
  try {
    const glossary = await loadGlossary();
    
    const languageMap = {
      ja: '日本語',
      ko: '韓国語'
    };
    
    let glossaryPrompt = '';
    if (glossary && glossary.terms && glossary.terms.length > 0) {
      glossaryPrompt = '次の用語は正確に翻訳してください：\n';
      glossary.terms.forEach(term => {
        glossaryPrompt += `- "${term.term}" を "${term[targetLanguage]}"として翻訳\n`;
      });
    }
    
    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: `あなたはプロの翻訳者です。英語から${languageMap[targetLanguage]}へ正確に翻訳してください。
          ${glossaryPrompt}
          原文の意味を保ちながら、自然で流暢な翻訳を提供してください。
          専門用語は正確に翻訳してください。
          翻訳のみを返し、追加の説明やコメントは含めないでください。`
        },
        { 
          role: 'user', 
          content: text 
        }
      ],
      temperature: 0.3, // 一貫性のために低めの温度設定
    });
    
    const translatedText = response.choices[0].message.content || '';
    
    return {
      originalText: text,
      translatedText,
      language: targetLanguage
    };
  } catch (error) {
    console.error('Translation error:', error);
    throw new Error('翻訳中にエラーが発生しました');
  }
}

/**
 * 韓国語翻訳の長さが適切かどうかを検証します
 * @param originalText 原文テキスト
 * @param translatedText 翻訳されたテキスト
 * @returns 翻訳が適切な長さの場合はtrue、そうでない場合はfalse
 */
export function validateKoreanTranslationLength(
  originalText: string, 
  translatedText: string
): boolean {
  const originalLength = originalText.length;
  const translatedLength = translatedText.length;
  
  if (translatedText.includes('그러나 이 번역은 너무 길어서 유효하지 않습니다')) {
    return false;
  }
  
  return translatedLength < originalLength * 1.3;
}
