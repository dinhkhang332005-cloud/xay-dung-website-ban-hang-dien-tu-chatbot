import { axiosClient } from "@/lib/axios";
import { LoginInput, RegisterInput } from "@/validations/auth.schema";

export const authApi = {
  
  register: async (data: RegisterInput) => {
    return await axiosClient.post("/api/auth/register", data);
  },
  login: async (data: LoginInput) => {
    return await axiosClient.post("/api/auth/login", data);
  },

};