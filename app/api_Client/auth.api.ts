import { axiosClient } from "@/lib/axios";
import { ForgotPasswordInput, LoginInput, RegisterInput, ResetPasswordInput } from "@/validations/auth.schema";

export const authApi = {
  
  register: async (data: RegisterInput) => {
    return await axiosClient.post("/api/auth/register", data);
  },
  login: async (data: LoginInput) => {
    return await axiosClient.post("/api/auth/login", data);
  },


  forgotPassword: async (data: ForgotPasswordInput) => {
    return await axiosClient.post("/api/auth/forgot-password", data);
  },

  
  resetPassword: async (data: ResetPasswordInput) => {
    return await axiosClient.post("/api/auth/reset-password", data);
  },
};