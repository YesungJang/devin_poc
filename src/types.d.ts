import '@testing-library/jest-dom';

declare global {
  interface Window {
    URL: {
      createObjectURL: (blob: Blob) => string;
      revokeObjectURL: (url: string) => void;
    };
  }
}

declare global {
  namespace jest {
    interface Matchers<R> {
      toBeInTheDocument(): R;
      toHaveAttribute(attr: string, value?: string): R;
      toHaveTextContent(text: string | RegExp): R;
    }
  }
}

export {};
