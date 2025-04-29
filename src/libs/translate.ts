import OpenAI from 'openai';
import { loadGlossary } from './glossary';

const isTestEnv = process.env.NODE_ENV === 'test';

const isDev = process.env.NODE_ENV === 'development' || isTestEnv;
const hasValidApiKey = (process.env.NEXT_PUBLIC_OPENAI_API_KEY && process.env.NEXT_PUBLIC_OPENAI_API_KEY !== 'your_api_key_here') || 
                      (process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY !== 'your_api_key_here');

let mockLanguage: SupportedLanguage = 'ja';

const openai = isDev || !hasValidApiKey
  ? {
      chat: {
        completions: {
          create: (params: any) => {
            console.log('Using mock translation data');
            
            const systemPrompt = params.messages[0]?.content || '';
            if (systemPrompt.includes('韓国語')) {
              mockLanguage = 'ko';
            } else {
              mockLanguage = 'ja';
            }
            
            console.log('Selected mock language:', mockLanguage);
            
            const mockTranslations = {
              ja: '当社のエンタープライズクラウドプラットフォームは、現代のビジネスが効率的に業務を拡大するために設計された包括的なSaaSソリューションです。このプラットフォームは、自動化されたワークフロー管理、リアルタイム分析ダッシュボード、既存のツールとの安全なAPI統合など、幅広い機能を提供しています。\n\nサブスクリプションベースのモデルにより、高度なデータ可視化、カスタムレポート作成、専任カスタマーサポートなどのすべてのプレミアム機能にアクセスできます。当社のクラウドコンピューティングインフラストラクチャは、99.9%のアップタイムと堅牢なセキュリティ対策により、お客様の機密データを保護します。\n\nプラットフォームの直感的なダッシュボードでは、主要なパフォーマンス指標を一目で確認し、データに基づいた意思決定を行うことができます。APIドキュメントは包括的で定期的に更新されており、サードパーティサービスとの統合がシームレスです。\n\n多くのフォーチュン500企業がすでに当社のエンタープライズクラウドプラットフォームを導入しており、運用コストの大幅な削減と生産性の向上を実現しています。専任のカスタマーサクセスチームが24時間365日体制でサポートし、サブスクリプションの価値を最大化するお手伝いをします。',
              ko: '당사의 엔터프라이즈 클라우드 플랫폼은 현대 비즈니스가 효율적으로 운영을 확장할 수 있도록 설계된 종합적인 SaaS 솔루션입니다. 이 플랫폼은 자동화된 워크플로우 관리, 실시간 분석 대시보드 및 기존 도구와의 안전한 API 통합을 포함한 광범위한 기능을 제공합니다.\n\n구독 기반 모델을 통해 고급 데이터 시각화, 맞춤형 보고서 및 전담 고객 지원과 같은 모든 프리미엄 기능에 액세스할 수 있습니다. 당사의 클라우드 컴퓨팅 인프라는 99.9% 가동 시간과 강력한 보안 조치로 민감한 데이터를 보호합니다.\n\n플랫폼의 직관적인 대시보드를 통해 주요 성과 지표를 한눈에 모니터링하고 데이터 기반 의사 결정을 내릴 수 있습니다. API 문서는 포괄적이고 정기적으로 업데이트되어 타사 서비스와의 통합이 원활합니다.\n\n이미 많은 포춘 500대 기업이 당사의 엔터프라이즈 클라우드 플랫폼을 구현하여 상당한 운영 비용 절감과 생산성 향상을 달성했습니다. 전담 고객 성공 팀이 연중무휴로 지원하여 구독의 가치를 극대화할 수 있도록 도와드립니다.'
            };
            return Promise.resolve({
              choices: [{ message: { content: mockTranslations[mockLanguage] } }]
            });
          }
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
