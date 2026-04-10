let accessToken: string | null = null;

export const authStore = {
  getAccessToken: (): string | null => accessToken,

  setAccessToken: (token: string | null) => {
    accessToken = token;
  },

  clearAccessToken: () => {
    accessToken = null;
  },
};