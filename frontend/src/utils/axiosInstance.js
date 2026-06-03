import axios from "axios";

const instance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: { "Content-Type": "application/json" },
});

// =====================================
// REQUEST INTERCEPTOR
// =====================================
instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

// =====================================
// REFRESH QUEUE SETUP
// =====================================
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(({ resolve, reject }) => {
    error ? reject(error) : resolve(token);
  });
  failedQueue = [];
};

// =====================================
// RESPONSE INTERCEPTOR
// =====================================
instance.interceptors.response.use(
  (response) => response,

  async (error) => {
    const original = error.config;

    // =====================================
    // HANDLE 401 — TRY REFRESH FIRST
    // =====================================
    if (error.response?.status === 401 && !original._retry) {
      original._retry = true; // prevent infinite loop

      const refreshToken = localStorage.getItem("refreshToken");

      // No refresh token → logout immediately
      if (!refreshToken) {
        logout();
        return Promise.reject(error);
      }

      // Another request is already refreshing → queue this one
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            original.headers.Authorization = `Bearer ${token}`;
            return instance(original); // retry with new token
          })
          .catch((err) => Promise.reject(err));
      }

      // This request will do the refresh
      isRefreshing = true;

      try {
        const res = await axios.post(
  `${import.meta.env.VITE_API_URL}/auth/refresh`,
  { refreshToken }
);

        const newAccessToken = res.data.accessToken;
        localStorage.setItem("accessToken", newAccessToken);

        // Update default header for future requests
        instance.defaults.headers.common["Authorization"] = `Bearer ${newAccessToken}`;

        processQueue(null, newAccessToken); // unblock queued requests
        original.headers.Authorization = `Bearer ${newAccessToken}`;
        return instance(original); // retry original request

      } catch (refreshError) {
        processQueue(refreshError, null);
        logout(); // refresh failed → force logout
        return Promise.reject(refreshError);

      } finally {
        isRefreshing = false;
      }
    }

    // =====================================
    // NETWORK ERROR
    // =====================================
    if (error.code === "ERR_NETWORK") {
      console.error("Network Error: Backend may be offline.");
    }

    return Promise.reject(error);
  }
);

// =====================================
// LOGOUT HELPER
// =====================================
const logout = () => {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
  localStorage.removeItem("user");
  if (window.location.pathname !== "/") {
    window.location.replace("/");
  }
};

export default instance;