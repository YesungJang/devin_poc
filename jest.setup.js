import '@testing-library/jest-dom';
import { expect } from '@jest/globals';

Object.defineProperty(window, 'URL', {
  value: {
    createObjectURL: jest.fn(() => 'blob:http://localhost:3000/mock-audio-url'),
    revokeObjectURL: jest.fn()
  }
});

process.env.NODE_ENV = 'test';
process.env.OPENAI_API_KEY = 'test_api_key';
