declare global {
  interface Window {
    grecaptcha?: {
      ready?: (callback: () => void) => void;
      render: (
        container: HTMLElement,
        parameters: {
          sitekey: string;
          theme?: 'light' | 'dark';
          callback?: (token: string) => void;
          'expired-callback'?: () => void;
          'error-callback'?: () => void;
        },
      ) => number;
      reset: (widgetId?: number) => void;
    };
  }
}

export {};
