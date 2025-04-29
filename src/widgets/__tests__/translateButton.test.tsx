import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { describe, test, expect, jest, beforeEach } from '@jest/globals';

jest.mock('@/libs/translate', () => {
  return {
    translateText: jest.fn().mockImplementation(() => {
      return Promise.resolve({
        originalText: 'Sample text',
        translatedText: 'サンプルテキスト',
        language: 'ja'
      });
    }),
    SupportedLanguage: { ja: 'ja', ko: 'ko' }
  };
});

jest.mock('@/libs/tts', () => {
  return {
    generateSpeech: jest.fn().mockImplementation(() => {
      return Promise.resolve({
        audioUrl: 'blob:http://localhost:3000/mock-audio-url',
        text: 'サンプルテキスト',
        language: 'ja'
      });
    })
  };
});

jest.mock('@/libs/summarize', () => {
  return {
    generateSummary: jest.fn().mockImplementation(() => {
      return Promise.resolve({
        originalText: 'Sample text',
        summaryPoints: ['要点1', '要点2', '要点3', '要点4', '要点5'],
        language: 'ja'
      });
    })
  };
});

import TranslateButton from '../translateButton';

describe('TranslateButton', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    Object.defineProperty(window, 'URL', {
      value: {
        createObjectURL: jest.fn(() => 'blob:http://localhost:3000/mock-audio-url'),
        revokeObjectURL: jest.fn()
      },
      configurable: true
    });
  });
  
  test('ボタンがレンダリングされることを確認する', () => {
    render(<TranslateButton text="Sample text" />);
    
    const button = screen.getByRole('button', { name: /翻訳 \+ 要約 \+ TTS/i });
    const dropdown = screen.getByRole('combobox');
    
    expect(button).toBeInTheDocument();
    expect(dropdown).toBeInTheDocument();
  });
});
