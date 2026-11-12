import { axiosClient } from "@/lib/axios";
import { ChangePasswordInput, UpdateProfileInput } from "@/validations/auth.schema";

export const userApi = {
  getProfile: async (userId: string) => {
    return await axiosClient.get(`/api/user/profile?userId=${userId}`);
  },

  updateProfile: async (data: UpdateProfileInput & { userId: string }) => {
    return await axiosClient.patch("/api/user/profile", data);
  },

  changePassword: async (data: ChangePasswordInput & { userId: string }) => {
    return await axiosClient.post("/api/user/change-password", data);
  },
  
};