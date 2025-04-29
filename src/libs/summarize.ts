import OpenAI from 'openai';
import { SupportedLanguage, setMockLanguage } from './translate';

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
            console.log('Using mock summary data');
            
            const systemPrompt = params.messages[0]?.content || '';
            if (systemPrompt.includes('韓国語')) {
              mockLanguage = 'ko';
            } else {
              mockLanguage = 'ja';
            }
            
            console.log('Selected mock language for summary:', mockLanguage);
            
            const mockSummaries = {
              ja: '- エンタープライズクラウドプラットフォームは、ビジネスの効率的な拡大のための包括的なSaaSソリューションです。\n- 自動化されたワークフロー管理、リアルタイム分析ダッシュボード、安全なAPI統合などの機能を提供します。\n- サブスクリプションモデルで高度なデータ可視化やカスタムレポート作成などのプレミアム機能にアクセスできます。\n- 99.9%のアップタイムと堅牢なセキュリティ対策により、お客様の機密データを保護します。\n- 多くのフォーチュン500企業が導入し、運用コスト削減と生産性向上を実現しています。',
              ko: '- 엔터프라이즈 클라우드 플랫폼은 비즈니스 확장을 위한 종합적인 SaaS 솔루션입니다.\n- 자동화된 워크플로우 관리, 실시간 분석 대시보드, 안전한 API 통합 기능을 제공합니다.\n- 구독 모델로 고급 데이터 시각화 및 맞춤형 보고서와 같은 프리미엄 기능에 액세스할 수 있습니다.\n- 99.9% 가동 시간과 강력한 보안 조치로 민감한 데이터를 보호합니다.\n- 많은 포춘 500대 기업이 도입하여 운영 비용 절감과 생산성 향상을 달성했습니다.'
            };
            return Promise.resolve({
              choices: [{ message: { content: mockSummaries[mockLanguage] } }]
            });
          }
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
    if (isDev || !hasValidApiKey) {
      setMockLanguage(language);
    }
    
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
