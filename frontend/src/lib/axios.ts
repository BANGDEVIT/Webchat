import { useAuthStore } from "@/stores/useAuthStore";
import axios from "axios";

const api = axios.create({
  // baseURL:
  //   import.meta.env.MODE === "development"
  //     ? "http://localhost:5001/api"
  //     : "/api",
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true, // ko có dòng này thì cookie không được gửi lên server
});

// gắn access token vào req header
api.interceptors.request.use((config) => {
  const { accessToken } = useAuthStore.getState(); // chỉ lấy access token trong store khi hàm này được gọi và nếu sau khi được gán thì nếu access Token thay dổi thì biến này vẫn giữ nguyên giá trị mà không thay đổi
  // const { accessToken } = useAuthStore() // tự động cập nhật mỗi khi có bất kì biến nào thay đổi
  // const accesstoken = useAuthStore((s) => s.accessToken) // tự động cập nhật khi access Token thay đổi
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }

  return config;
});

// tự động gọi refresh api khi access token hết hạn
api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const originalRequest = error.config;

    // những api không cần check
    if (
      originalRequest.url.includes("/auth/signin") ||
      originalRequest.url.includes("/auth/signup") ||
      originalRequest.url.includes("/auth/refresh")
    ) {
      return Promise.reject(error);
    }

    originalRequest._retryCount = originalRequest._retryCount || 0;

    if (error.response?.status === 403 && originalRequest._retryCount < 4) {
      originalRequest._retryCount += 1;

      try {
        const res = await api.post("/auth/refresh", { withCredentials: true });
        const newAccessToken = res.data.accessToken;

        useAuthStore.getState().setAccessToken(newAccessToken);

        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        useAuthStore.getState().clearState();
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  },
);

export default api;
