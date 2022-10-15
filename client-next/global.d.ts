declare global {
  interface Window {
    ethereum: {
      request: (obj: any) => Promise<any>;
      [key: string]: any;
    };
  }
}

export {};
