export const DAY = 86400000;

export const URL =
  process.env.CONTEXT === 'production'
    ? process.env.URL
    : process.env.DEPLOY_URL || 'http://localhost:3000';
