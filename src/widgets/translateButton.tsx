'use client';

import { useState, useCallback, useRef } from 'react';
import { translateText, SupportedLanguage, TranslationResult } from '@/libs/translate';
import { generateSpeech } from '@/libs/tts';
import { generateSummary, SummaryResult } from '@/libs/summarize';
import LocaleSelector from '@/components/LocaleSelector';

interface TranslateButtonProps {
  text: string;
  className?: string;
}

interface TranslationState {
  isLoading: boolean;
  isModalOpen: boolean;
  error: string | null;
  translation: TranslationResult | null;
  summary: SummaryResult | null;
  audioUrl: string | null;
  selectedLanguage: SupportedLanguage;
}

export default function TranslateButton({ text, className = '' }: TranslateButtonProps) {
  const [state, setState] = useState<TranslationState>({
    isLoading: false,
    isModalOpen: false,
    error: null,
    translation: null,
    summary: null,
    audioUrl: null,
    selectedLanguage: 'ja' // デフォルトは日本語
  });
  
  const audioRef = useRef<HTMLAudioElement>(null);
  
  const handleLanguageChange = (language: SupportedLanguage) => {
    setState(prev => ({ ...prev, selectedLanguage: language }));
  };
  
  const handleTranslate = useCallback(async () => {
    try {
      setState(prev => ({ 
        ...prev, 
        isLoading: true, 
        isModalOpen: true, 
        error: null 
      }));
      
      const translationResult = await translateText(text, state.selectedLanguage);
      
      const speechResult = await generateSpeech({
        text: translationResult.translatedText,
        language: state.selectedLanguage
      });
      
      const summaryResult = await generateSummary(text, state.selectedLanguage);
      
      setState(prev => ({
        ...prev,
        isLoading: false,
        translation: translationResult,
        summary: summaryResult,
        audioUrl: speechResult.audioUrl
      }));
      
      if (audioRef.current && speechResult.audioUrl) {
        audioRef.current.play();
      }
    } catch (error) {
      console.error('Translation process error:', error);
      setState(prev => ({ 
        ...prev, 
        isLoading: false, 
        error: error instanceof Error ? error.message : '処理中にエラーが発生しました' 
      }));
    }
  }, [text, state.selectedLanguage]);
  
  const closeModal = () => {
    setState(prev => ({ ...prev, isModalOpen: false }));
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  };
  
  return (
    <>
      <div className="translate-button-container flex items-center space-x-4">
        <LocaleSelector 
          onChange={handleLanguageChange}
          currentLocale={state.selectedLanguage}
        />
        
        <button
          onClick={handleTranslate}
          disabled={state.isLoading}
          className={`translate-button px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed ${className}`}
        >
          {state.isLoading ? '処理中...' : '翻訳 + 要約 + TTS'}
        </button>
      </div>
      
      {/* 音声プレーヤー（非表示） */}
      {state.audioUrl && (
        <audio ref={audioRef} src={state.audioUrl} controls className="hidden" />
      )}
      
      {/* 翻訳・要約モーダル */}
      {state.isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">
                {state.selectedLanguage === 'ja' ? '翻訳と要約' : '번역 및 요약'}
              </h2>
              <button
                onClick={closeModal}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            
            {state.isLoading ? (
              <div className="flex justify-center items-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            ) : state.error ? (
              <div className="text-red-500 py-4">
                エラー: {state.error}
              </div>
            ) : (
              <>
                {/* 翻訳結果 */}
                {state.translation && (
                  <div className="mb-6">
                    <h3 className="font-semibold mb-2">
                      {state.selectedLanguage === 'ja' ? '翻訳:' : '번역:'}
                    </h3>
                    <p className="p-3 bg-gray-50 rounded-md">
                      {state.translation.translatedText}
                    </p>
                    
                    {/* 音声再生コントロール */}
                    <div className="mt-4">
                      <button
                        onClick={() => audioRef.current?.play()}
                        className="px-3 py-1 bg-green-500 text-white rounded-md hover:bg-green-600"
                      >
                        {state.selectedLanguage === 'ja' ? '音声を再生' : '오디오 재생'}
                      </button>
                    </div>
                  </div>
                )}
                
                {/* 要約結果 */}
                {state.summary && (
                  <div>
                    <h3 className="font-semibold mb-2">
                      {state.selectedLanguage === 'ja' ? '5行要約:' : '5줄 요약:'}
                    </h3>
                    <ul className="list-disc pl-5 p-3 bg-gray-50 rounded-md">
                      {state.summary.summaryPoints.map((point, idx) => (
                        <li key={idx} className="mb-1">
                          {point}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
