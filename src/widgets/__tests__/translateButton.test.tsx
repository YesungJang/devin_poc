import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { describe, test, expect, jest, beforeEach } from '@jest/globals';

const mockTranslateText = jest.fn().mockResolvedValue({
  originalText: 'Sample text',
  translatedText: 'サンプルテキスト',
  language: 'ja'
});

const mockGenerateSpeech = jest.fn().mockResolvedValue({
  audioUrl: 'blob:http://localhost:3000/mock-audio-url',
  text: 'サンプルテキスト',
  language: 'ja'
});

const mockGenerateSummary = jest.fn().mockResolvedValue({
  originalText: 'Sample text',
  summaryPoints: ['要点1', '要点2', '要点3', '要点4', '要点5'],
  language: 'ja'
});

jest.mock('@/libs/translate', () => ({
  translateText: () => mockTranslateText(),
  SupportedLanguage: { ja: 'ja', ko: 'ko' }
}));

jest.mock('@/libs/tts', () => ({
  generateSpeech: () => mockGenerateSpeech()
}));

jest.mock('@/libs/summarize', () => ({
  generateSummary: () => mockGenerateSummary()
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
