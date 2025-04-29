import { validateSummaryPointCount } from '../summarize';
import { describe, test, expect } from '@jest/globals';

describe('Summary Utils', () => {
  test('要約が正確に5つの箇条書きを含むことを確認する', () => {
    const validSummary = [
      'First point of the summary.',
      'Second point of the summary.',
      'Third point of the summary.',
      'Fourth point of the summary.',
      'Fifth point of the summary.'
    ];
    
    const invalidSummary1 = [
      'First point of the summary.',
      'Second point of the summary.',
      'Third point of the summary.',
      'Fourth point of the summary.'
    ];
    
    const invalidSummary2 = [
      'First point of the summary.',
      'Second point of the summary.',
      'Third point of the summary.',
      'Fourth point of the summary.',
      'Fifth point of the summary.',
      'Sixth point of the summary.'
    ];
    
    expect(validateSummaryPointCount(validSummary)).toBe(true);
    expect(validateSummaryPointCount(invalidSummary1)).toBe(false);
    expect(validateSummaryPointCount(invalidSummary2)).toBe(false);
  });
});
