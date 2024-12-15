export const parseJwt = (token: string): Record<string, any> | null => {
  try {
    const base64Payload = token.split('.')[1];
    const payload = atob(base64Payload);
    return JSON.parse(payload);
  } catch (error) {
    console.error('Failed to parse JWT:', error);
    return null;
  }
};
