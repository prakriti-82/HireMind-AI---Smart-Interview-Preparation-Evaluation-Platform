import axios from "axios";

// =====================================
// AXIOS INSTANCE
// =====================================
const instance = axios.create({

  baseURL:
    import.meta.env.VITE_API_URL ||
    "http://localhost:5000/api",

  headers: {
    "Content-Type":
      "application/json",
  },

  withCredentials: false,
});

// =====================================
// REQUEST INTERCEPTOR
// =====================================
instance.interceptors.request.use(

  (config) => {

    const token =
      localStorage.getItem(
        "accessToken"
      );

    if (token) {

      config.headers.Authorization =
        `Bearer ${token}`;
    }

    return config;
  },

  (error) => {

    return Promise.reject(error);
  }
);

// =====================================
// RESPONSE INTERCEPTOR
// =====================================
instance.interceptors.response.use(

  (response) => response,

  (error) => {

    // =====================================
    // TOKEN EXPIRED / UNAUTHORIZED
    // =====================================
    if (
      error.response &&
      error.response.status === 401
    ) {

      // CLEAR STORAGE
      localStorage.removeItem(
        "accessToken"
      );

      localStorage.removeItem(
        "user"
      );

      // REDIRECT TO HOME
      if (
        window.location.pathname !==
        "/"
      ) {

        window.location.href = "/";
      }
    }

    // =====================================
    // NETWORK ERROR
    // =====================================
    if (
      error.code === "ERR_NETWORK"
    ) {

      console.error(
        "Network Error: Backend may be offline"
      );
    }

    return Promise.reject(error);
  }
);

export default instance;