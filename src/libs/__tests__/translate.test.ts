import { validateKoreanTranslationLength } from '../translate';
import { describe, test, expect } from '@jest/globals';

describe('Translation Utils', () => {
  test('韓国語翻訳が原文の1.3倍未満であることを確認する', () => {
    const originalText = 'This is a sample text for testing the Korean translation length validation. It should be less than 1.3 times the original text length.';
    const validTranslation = '이것은 한국어 번역 길이 검증을 위한 샘플 텍스트입니다. 원본 텍스트 길이의 1.3배 미만이어야 합니다.';
    const invalidTranslation = '이것은 한국어 번역 길이 검증을 위한 샘플 텍스트입니다. 원본 텍스트 길이의 1.3배 미만이어야 합니다. 그러나 이 번역은 너무 길어서 유효하지 않습니다. 추가 텍스트를 넣어 길이를 늘려보겠습니다. 이렇게 하면 원본보다 훨씬 길어질 것입니다. 더 많은 텍스트를 추가해 봅시다. 이것은 한국어 번역 길이 검증을 위한 샘플 텍스트입니다. 원본 텍스트 길이의 1.3배 미만이어야 합니다. 그러나 이 번역은 너무 길어서 유효하지 않습니다. 추가 텍스트를 넣어 길이를 늘려보겠습니다. 이렇게 하면 원본보다 훨씬 길어질 것입니다. 더 많은 텍스트를 추가해 봅시다.';
    
    expect(validateKoreanTranslationLength(originalText, validTranslation)).toBe(true);
    expect(validateKoreanTranslationLength(originalText, invalidTranslation)).toBe(false);
  });
});
