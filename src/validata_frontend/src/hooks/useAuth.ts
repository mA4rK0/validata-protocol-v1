import { useState, useEffect, createContext, useContext } from "react";
import { AuthClient } from "@dfinity/auth-client";
import { Principal } from "@dfinity/principal";
import { User, AuthState } from "../types/auth";

const AuthContext = createContext<{
  authState: AuthState;
  login: (role?: "client" | "labeler" | "admin") => Promise<void>;
  logout: () => Promise<void>;
  setUserRole: (role: "client" | "labeler" | "admin") => Promise<void>;
} | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const useAuthState = () => {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    user: null,
    isLoading: true,
  });

  const [authClient, setAuthClient] = useState<AuthClient | null>(null);

  useEffect(() => {
    initAuth();
  }, []);

  const initAuth = async () => {
    try {
      const client = await AuthClient.create();
      setAuthClient(client);

      const isAuthenticated = await client.isAuthenticated();

      if (isAuthenticated) {
        const identity = client.getIdentity();
        const principal = identity.getPrincipal().toString();

        // Simulate fetching user role from backend
        const userRole = await fetchUserRole(principal);

        setAuthState({
          isAuthenticated: true,
          user: {
            principal,
            role: userRole || undefined,
            profile: {
              username: `user_${principal.slice(0, 8)}`,
              reputation: 4.8,
              level: "Expert",
            },
          },
          isLoading: false,
        });
      } else {
        setAuthState({
          isAuthenticated: false,
          user: null,
          isLoading: false,
        });
      }
    } catch (error) {
      console.error("Auth initialization failed:", error);
      setAuthState({
        isAuthenticated: false,
        user: null,
        isLoading: false,
        error: "Failed to initialize authentication",
      });
    }
  };

  const login = async (role?: "client" | "labeler" | "admin" | null) => {
    if (!authClient) return;

    try {
      setAuthState((prev) => ({ ...prev, isLoading: true }));

      await authClient.login({
        identityProvider: "https://identity.ic0.app",
        onSuccess: async () => {
          const identity = authClient.getIdentity();
          const principal = identity.getPrincipal().toString();

          // If role is provided, set it immediately
          let userRole = role;
          if (!userRole) {
            userRole = await fetchUserRole(principal);
          }

          setAuthState({
            isAuthenticated: true,
            user: {
              principal,
              role: userRole || undefined,
              profile: {
                username: `user_${principal.slice(0, 8)}`,
                reputation: 4.8,
                level: "Expert",
              },
            },
            isLoading: false,
          });

          // Save role if provided
          if (role) {
            await saveUserRole(principal, role);
          }
        },
        onError: (error) => {
          console.error("Login failed:", error);
          setAuthState({
            isAuthenticated: false,
            user: null,
            isLoading: false,
            error: "Login failed",
          });
        },
      });
    } catch (error) {
      console.error("Login error:", error);
      setAuthState({
        isAuthenticated: false,
        user: null,
        isLoading: false,
        error: "Login failed",
      });
    }
  };

  const logout = async () => {
    if (!authClient) return;

    try {
      await authClient.logout();
      setAuthState({
        isAuthenticated: false,
        user: null,
        isLoading: false,
      });
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const setUserRole = async (role: "client" | "labeler" | "admin") => {
    if (!authState.isAuthenticated || !authState.user) return;

    try {
      // Simulate saving role to backend
      await saveUserRole(authState.user.principal, role);

      setAuthState((prev) => ({
        ...prev,
        user: prev.user ? { ...prev.user, role } : null,
      }));
    } catch (error) {
      console.error("Failed to set user role:", error);
    }
  };

  return {
    authState,
    login,
    logout,
    setUserRole,
  };
};

// Simulate backend API calls
const fetchUserRole = async (principal: string): Promise<"client" | "labeler" | "admin" | null> => {
  // In a real app, this would be an API call to your backend canister
  const stored = localStorage.getItem(`user_role_${principal}`);
  return stored as "client" | "labeler" | "admin" | null;
};

const saveUserRole = async (principal: string, role: "client" | "labeler" | "admin"): Promise<void> => {
  // In a real app, this would be an API call to your backend canister
  localStorage.setItem(`user_role_${principal}`, role);
};

export { AuthContext };
