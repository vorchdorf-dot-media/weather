export const DAY = 86400000;

export const getUrl = (): string => {
  const fallback = process.env.PREVIEW_URL ?? 'http://localhost:3000';
  if (process.env.CONTEXT === 'production' && process.env.PROD === 'true') {
    return process.env.URL ?? fallback;
  }
  return fallback;
};
