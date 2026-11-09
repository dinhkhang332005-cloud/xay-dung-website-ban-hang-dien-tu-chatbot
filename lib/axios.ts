import axios from "axios"

export const axiosClient = axios.create({
    baseURL:process.env.NEXT_PUBLIC_API_URL,
    timeout:10000,
    headers: {
        "Content-Type":'application/json'
    },
})

axiosClient.interceptors.request.use(
  (config) => {

    const token =
      typeof window !== "undefined" ? localStorage.getItem("access_token") : null;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);
// 3. RESPONSE INTERCEPTOR: Xử lý dữ liệu trả về và bắt lỗi tập trung
axiosClient.interceptors.response.use(
  (response) => {
    // Tự động bóc tách .data để component không cần chấm data 2 lần
    return response.data;
  },
  (error) => {
    if (error.response) {
      const status = error.response.status;
      const data = error.response.data;
      switch (status) {
        case 401:
          console.error("Phiên đăng nhập đã hết hạn hoặc chưa đăng nhập.");
          // Sau này có thể tự động xóa token và chuyển hướng về /login
          break;
        case 403:
          alert("Bạn không có quyền thực hiện hành động này!");
          break;
        case 404:
          console.warn("Dữ liệu không tồn tại trên hệ thống (404).");
          break;
        case 500:
          alert("Lỗi máy chủ nội bộ. Vui lòng thử lại sau!");
          break;
        // Các mã 400 (Validation) và 409 (Email trùng) không alert ở đây
        // để Form tự bắt và hiển thị chữ đỏ thân thiện cho người dùng.
        default:
          break;
      }
    } else {
      console.error("Lỗi mất kết nối mạng hoặc server không phản hồi:", error);
    }
    return Promise.reject(error);
  }
);
export default axiosClient;