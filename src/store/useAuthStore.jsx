import {create} from "zustand";
import {createJSONStorage, persist} from "zustand/middleware";
import api from "../api/axios";
import {toast} from "sonner";

export const useAuthStore = create(
    persist(
        (set, get) => ({
          tempToken: null,
          accessToken: null,
          twoFactorEnabled: false,
          qrCode: null,
          user: null,
          isAuthenticated: false,
          error: null,
          isLoading: false,
          isLoadingAuth: true,
          signup: async (name, email, password) => {
            set({isLoading: true, error: null});
            try {
              const response = await api.post(`/signup`, {name, email, password});
              if (response?.error === "Email already in use") {
                toast.error("Email already in use");
                set({
                  isLoading: false,
                  isAuthenticated: false,
                  error: "Email already in use",
                });
                return;
              }
              const {accessToken, user} = response.data;
              set({
                accessToken: accessToken,
                user: user,
                isAuthenticated: true,
                isLoading: false,
                error: null,
              });
              return response.data;
            } catch (error) {
              const errorMessage =
                  error?.message || "Error signing up. Please try again.";
              set({
                error: errorMessage,
                isLoading: false,
                isAuthenticated: false,
              });
              toast.error(errorMessage);
              throw new Error(errorMessage);
            }
          },
          login: async (email, password) => {
            set({isLoading: true, error: null});
            try {
              const response = await api.post(`/login`, {email, password});
              const {accessToken, tempToken, user, requires2FA} =
              response?.data || "";
              set({
                tempToken,
                accessToken,
                twoFactorEnabled: requires2FA,
                user,
                isAuthenticated: true,
                isLoading: false,
                error: null,
              });
              toast.success("Logged In Successfully!");
              return response.data;
            } catch (error) {
              const errorMessage =
                  error?.response?.data?.error ||
                  "Login failed. Invalid email or password.";
              toast.error(errorMessage);
              set({
                error: errorMessage,
                isLoading: false,
                isAuthenticated: false,
              });
              throw new Error(errorMessage);
            }
          },
          logout: async () => {
            set({isLoading: true, error: null});
            try {
              await api.post(`/logout`);
            } catch (apiError) {
              console.error(
                  "Error calling /logout endpoint:",
                  apiError?.message || apiError.message,
              );
            } finally {
              set({
                accessToken: null,
                user: null,
                isAuthenticated: false,
                isLoading: false,
                error: null,
              });
              toast.error("You have been logged out.");
            }
          },
          refreshTokenFn: async () => {
            const currentRefreshToken = get().accessToken;
            if (!currentRefreshToken) {
              set({isLoadingAuth: false, isAuthenticated: false});
              return null;
            }
            set({isLoadingAuth: true, error: null});
            try {
              const response = await api.post(`/refresh-token`);
              const accessToken = response?.data.accessToken;
              set({
                accessToken: accessToken,
                isAuthenticated: true,
                isLoadingAuth: false,
                error: null,
              });
              return accessToken;
            } catch (error) {
              console.error(
                  "Failed to refresh token:",
                  error?.message || error.message,
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
            set({isLoadingAuth: true, error: null});
            const currentAccessToken = get().accessToken;

            if (currentAccessToken) {
              try {
                const response = await api.get(`/me`);
                set({
                  user: response.data.user,
                  twoFactorEnabled: response.data.user.twoFactorEnabled,
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
                if (error?.status === 401) {
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
            set({isLoading: true, error: null});
            try {
              const response = await api.post(`/forgot-password`, {email});
              toast.success("Check your email!");
              set({
                isLoading: false,
                error: null,
              });
              return response?.message;
            } catch (error) {
              const errorMessage =
                  error?.message || "Error sending password reset email.";
              toast.error(errorMessage);
              set({isLoading: false, error: errorMessage});
              throw new Error(errorMessage);
            }
          },
          login2FA: async (otpCode) => {
            set({isLoading: true, error: null});
            try {
              const tempToken = get().tempToken;
              const response = await api.post(
                  `/2fa/login`,
                  {token: otpCode},
                  {
                    headers: {
                      Authorization: `Bearer ${tempToken}`,
                    },
                  },
              );
              const {accessToken} = response.data;
              set({
                accessToken,
                isAuthenticated: true,
                tempToken: null,
                isLoading: false,
                error: null,
              });
              toast.success("2FA Login Successful!");
              return response.data;
            } catch (error) {
              const errorMessage =
                  error?.response?.data?.error || "2FA verification failed.";
              toast.error(errorMessage);
              set({isLoading: false, error: errorMessage});
              throw new Error(errorMessage);
            }
          },
          disable2FA: async () => {
            set({isLoading: true, error: null});
            try {
              await api.post(`/2fa/disable`, {
                userId: get().user.id,
              });
              toast.success("2FA Disabled!");
              set({
                qrCode: null,
                isLoading: false,
                error: null,
              });
            } catch (error) {
              const errorMessage = error?.message || "Error disabling 2FA.";
              toast.error(errorMessage);
              set({isLoading: false, error: errorMessage});
              throw new Error(errorMessage);
            }
          },
          verify2FA: async (token) => {
            set({isLoading: true, error: null});
            try {
              const response = await api.post(`/2fa/verify-setup`, {
                userId: get().user.id,
                token: token,
              })
              toast.success(response.data.message);
              set({
                qrCode: response.data.qrCode,
                isLoading: false,
                error: null,
              });
              return response.data.qrCode;
            } catch (error) {
              const errorMessage = error?.response.data.error || "Error enabling 2FA.";
              toast.error(errorMessage);
              set({isLoading: false, error: errorMessage});
              throw new Error(errorMessage);
            }
          },
          enable2FA: async () => {
            set({isLoading: true, error: null});
            try {
              const response = await api.post(`/2fa/setup`, {
                userId: get().user.id,
              });
              toast.success("2FA Enabled!");
              set({
                qrCode: response.data.qrCode,
                isLoading: false,
                error: null,
              });
              return response.data.qrCode;
            } catch (error) {
              const errorMessage = error?.message || "Error enabling 2FA.";
              toast.error(errorMessage);
              set({isLoading: false, error: errorMessage});
              throw new Error(errorMessage);
            }
          },
          resetPassword: async (token, newPassword) => {
            set({isLoading: true, error: null});
            try {
              const response = await api.post(`/reset-password`, {
                token,
                newPassword,
              });
              toast.success("Password Reset Successfully!");
              set({
                isLoading: false,
                error: null,
              });
              return response?.message;
            } catch (error) {
              const errorMessage = error?.message || "Error resetting password.";
              toast.error(errorMessage);
              set({isLoading: false, error: errorMessage});
              throw new Error(errorMessage);
            }
          },
          testProtected: async () => {
            set({isLoading: true, error: null});
            try {
              const response = await api
                  .get(`/protected`)
                  .then((response) => toast.success(response.data.message));
              set({
                isLoading: false,
                error: null,
              });
              return response?.data;
            } catch (error) {
              const errorMessage =
                  error?.response?.message ||
                  `Failed to access protected route. Status: ${error.response?.status || "unknown"}`;
              set({isLoading: false, error: errorMessage});
              throw new Error(errorMessage);
            }
          },
        }),
        {
          name: "auth-storage",
          storage: createJSONStorage(() => localStorage),
          partialize: (state) => ({
            accessToken: state.accessToken,
            user: state.user,
            qrCode: state.qrCode,
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
