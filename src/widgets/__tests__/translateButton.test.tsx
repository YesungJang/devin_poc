import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { describe, test, expect, jest, beforeEach } from '@jest/globals';

type MockTranslateResult = {
  originalText: string;
  translatedText: string;
  language: string;
};

type MockSpeechResult = {
  audioUrl: string;
  text: string;
  language: string;
};

type MockSummaryResult = {
  originalText: string;
  summaryPoints: string[];
  language: string;
};

const mockTranslateText = jest.fn<Promise<MockTranslateResult>, any[]>().mockResolvedValue({
  originalText: 'Sample text',
  translatedText: 'サンプルテキスト',
  language: 'ja'
});

const mockGenerateSpeech = jest.fn<Promise<MockSpeechResult>, any[]>().mockResolvedValue({
  audioUrl: 'blob:http://localhost:3000/mock-audio-url',
  text: 'サンプルテキスト',
  language: 'ja'
});

const mockGenerateSummary = jest.fn<Promise<MockSummaryResult>, any[]>().mockResolvedValue({
  originalText: 'Sample text',
  summaryPoints: ['要点1', '要点2', '要点3', '要点4', '要点5'],
  language: 'ja'
});

jest.mock('@/libs/translate', () => ({
  translateText: (...args: any[]) => mockTranslateText(...args),
  SupportedLanguage: { ja: 'ja', ko: 'ko' }
}));

jest.mock('@/libs/tts', () => ({
  generateSpeech: (...args: any[]) => mockGenerateSpeech(...args)
}));

jest.mock('@/libs/summarize', () => ({
  generateSummary: (...args: any[]) => mockGenerateSummary(...args)
}));

import TranslateButton from '../translateButton';

describe('TranslateButton', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    global.URL.createObjectURL = jest.fn(() => 'blob:http://localhost:3000/mock-audio-url');
  });
  
  test('ボタンがレンダリングされることを確認する', () => {
    render(<TranslateButton text="Sample text" />);
    
    expect(screen.getByRole('button', { name: /翻訳 \+ 要約 \+ TTS/i })).toBeInTheDocument();
    expect(screen.getByRole('combobox')).toBeInTheDocument();
  });
});
