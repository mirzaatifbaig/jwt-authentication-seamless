import axios from "axios";
import {useAuthStore} from "@/store/useAuthStore";

const api = axios.create({
    baseURL: "http://localhost:5002/api/auth",
    withCredentials: true,
});
api.interceptors.request.use(
    (config) => {
        const accessToken = useAuthStore.getState().accessToken;
        if (accessToken) {
            config.headers.Authorization = `Bearer ${accessToken}`;
        }
        return config;
    },
    (error) => Promise.reject(error),
);
let isRefreshing = false;
let failedQueue = [];
const processQueue = (error, token = null) => {
    failedQueue.forEach((prom) => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(token);
        }
    });
    failedQueue = [];
};
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        const authStore = useAuthStore.getState();

        if (
            error.response?.status === 401 &&
            !originalRequest._retry &&
            originalRequest.url !== "/refresh-token"
        ) {
            if (isRefreshing) {
                return new Promise((resolve, reject) => {
                    failedQueue.push({resolve, reject});
                })
                    .then((token) => {
                        originalRequest.headers["Authorization"] = "Bearer " + token;
                        return axios(originalRequest);
                    })
                    .catch((err) => {
                        return Promise.reject(err);
                    });
            }
            originalRequest._retry = true;
            isRefreshing = true;
            try {
                const newAccessToken = await authStore.refreshTokenFn();
                if (newAccessToken) {
                    originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
                    processQueue(null, newAccessToken);
                    return axios(originalRequest);
                } else {
                    await authStore.logout();
                    processQueue(new Error("Session expired. Please login again."), null);
                    return Promise.reject(
                        new Error("Session expired. Please login again."),
                    );
                }
            } catch (refreshError) {
                await authStore.logout();
                processQueue(refreshError, null);
                return Promise.reject(refreshError);
            } finally {
                isRefreshing = false;
            }
        }
        return Promise.reject(error);
    },
);

export default api;
