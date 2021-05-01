declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: 'development' | 'production';
      BLOCKFROST_PROJECT_ID: 'string';
    }
  }
}

export {};
