import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import api from "../api/axios";
import { toast } from "sonner";
export const useAuthStore = create(
  persist(
    (set, get) => ({
      accessToken: null,
      user: null,
      isAuthenticated: false,
      error: null,
      isLoading: false,
      isLoadingAuth: true,
      signup: async (name, email, password) => {
        set({ isLoading: true, error: null });
        try {
          const response = await api.post(`/signup`, { name, email, password });
          const { accessToken, user } = response.data;
          set({
            accessToken,
            user,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });

          return response.data;
        } catch (error) {
          const errorMessage =
            error.response?.data?.message ||
            "Error signing up. Please try again.";
          set({
            error: errorMessage,
            isLoading: false,
            isAuthenticated: false,
          });
          throw new Error(errorMessage);
        }
      },

      login: async (email, password) => {
        set({ isLoading: true, error: null });
        try {
          const response = await api.post(`/login`, { email, password });
          const { accessToken, user } = response.data;
          set({
            accessToken,
            user,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });
          toast.message(response?.data?.message)
          return response.data;
        } catch (error) {
          const errorMessage =
            error.response?.data?.message ||
            "Login failed. Invalid email or password.";
          set({
            error: errorMessage,
            isLoading: false,
            isAuthenticated: false,
          });
          throw new Error(errorMessage);
        }
      },

      logout: async () => {
        set({ isLoading: true, error: null });
        try {
          await api.post(`/logout`);
        } catch (apiError) {
          console.error(
            "Error calling /logout endpoint:",
            apiError.response?.data?.message || apiError.message,
          );
        } finally {
          set({
            accessToken: null,
            user: null,
            isAuthenticated: false,
            isLoading: false,
            error: null,
          });
          toast.message("You have been logged out.")
        }
      },

      refreshTokenFn: async () => {
        const currentRefreshToken = get().accessToken;
        if (!currentRefreshToken) {
          set({ isLoadingAuth: false, isAuthenticated: false });
          return null;
        }
        set({ isLoadingAuth: true, error: null });
        try {
          const response = await api.post(`/refresh-token`);
          const accessToken = response.data.accessToken;
          set({
            accessToken: response?.data?.accessToken,
            isAuthenticated: true,
            isLoadingAuth: false,
            error: null,
          });
          return accessToken;
        } catch (error) {
          console.error(
            "Failed to refresh token:",
            error.response?.data?.message || error.message,
          );
          set({
            accessToken: null,
            user: null,
            isAuthenticated: false,
            isLoadingAuth: false,
            error: "Session expired. Please login again.",
          });
          return null;
        }
      },

      checkAuth: async () => {
        set({ isLoadingAuth: true, error: null });
        const currentAccessToken = get().accessToken;

        if (currentAccessToken) {
          try {
            const response = await api.get(`/me`);
            set({
              user: response.data.user,
              isAuthenticated: true,
              isLoadingAuth: false,
              error: null,
            });
            return true;
          } catch (error) {
            console.warn(
              "Access token validation failed, attempting refresh:",
              error.message,
            );
            if (error.response?.status === 401) {
              const newAccessToken = await get().refreshTokenFn();
              if (newAccessToken) {
                try {
                  const response = await api.get(`/me`);
                  set({
                    user: response.data.user,
                    isAuthenticated: true,
                    isLoadingAuth: false,
                  });
                  return true;
                } catch (meError) {
                  console.error(
                    "Failed to fetch user after token refresh:",
                    meError.message,
                  );
                  await get().logout();
                  return false;
                }
              } else {
                await get().logout();
                return false;
              }
            } else {
              await get().logout();
              return false;
            }
          }
        }
      },

      forgotPassword: async (email) => {
        set({ isLoading: true, error: null});
        try {
          const response = await api.post(`/forgot-password`, { email });
          set({
            isLoading: false,
            error: null,
          });
          return response.data.message;
        } catch (error) {
          const errorMessage =
            error.response?.data?.message ||
            "Error sending password reset email.";
          set({ isLoading: false, error: errorMessage });
          throw new Error(errorMessage);
        }
      },

      resetPassword: async (token, password) => {
        set({ isLoading: true, error: null});
        try {
          const response = await api.post(`/reset-password/${token}`, {
            password,
          });
          set({
            isLoading: false,
            error: null,
          });
          return response.data.message;
        } catch (error) {
          const errorMessage =
            error.response?.data?.message || "Error resetting password.";
          set({ isLoading: false, error: errorMessage });
          throw new Error(errorMessage);
        }
      },

      testProtected: async () => {
        set({ isLoading: true, error: null});
        try {
          const response = await api.get(`/protected`);
          set({
            isLoading: false,
            error: null,
          });

          return response.data;
        } catch (error) {
          const errorMessage =
            error.response?.data?.message ||
            `Failed to access protected route. Status: ${error.response?.status || "unknown"}`;
          set({ isLoading: false, error: errorMessage });
          throw new Error(errorMessage);
        }
      },
      clearMessages: () => set({ error: null}),
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        accessToken: state.accessToken,
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
      onRehydrateStorage: () => {
        return (state, error) => {
          if (error) {
            console.error(
              "Failed to rehydrate auth state from storage:",
              error,
            );
          }
        };
      },
    },
  ),
);

