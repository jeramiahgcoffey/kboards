export interface AuthStore {
  awaitingResponse: boolean;
  user: {
    email: string | null;
    token: string | null;
  };
}
