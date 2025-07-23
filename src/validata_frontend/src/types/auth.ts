export interface User {
  principal: string;
  role?: "client" | "labeler" | "admin" | null;
  profile?: {
    username?: string;
    email?: string;
    reputation?: number;
    level?: string;
  };
}

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  isLoading: boolean;
  error?: string;
}
