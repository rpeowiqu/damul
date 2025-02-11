import axios from "axios";

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true,
});

// apiClient.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     if (error.response) {
//       if (error.response.status === 401 || error.response.status === 403) {
//         window.location.href = "/login";
//       }
//     }

//     return Promise.reject(error);
//   },
// );

export default apiClient;
