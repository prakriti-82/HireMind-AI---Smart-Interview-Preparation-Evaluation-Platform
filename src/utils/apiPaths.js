const BASE_URL = "http://localhost:5000/api";

export const API_PATHS = {
  AUTH: {
    LOGIN: `${BASE_URL}/auth/login`,
    REGISTER: `${BASE_URL}/auth/register`,
  },
  AI: {
    GENERATE: `${BASE_URL}/ai/generate`,
  },
};

export default BASE_URL;