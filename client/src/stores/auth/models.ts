export interface AuthStore {
  user: {
    email: string | null;
    token: string | null;
  };
}
