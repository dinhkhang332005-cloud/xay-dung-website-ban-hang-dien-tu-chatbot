import prisma from "@/lib/prisma";
import { ChangePasswordInput, UpdateProfileInput } from "@/validations/auth.schema";
import bcrypt from "bcryptjs";

export class UserService {
  
  async getProfile(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        phoneNumber: true,
        address: true,
        role: true,
        createdAt: true,
      },
    });

    if (!user) {
      throw new Error("USER_NOT_FOUND");
    }

    return user;
  }

  // 2. Cập nhật họ tên, số điện thoại, địa chỉ
  async updateProfile(userId: string, data: UpdateProfileInput) {
    const existingUser = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!existingUser) {
      throw new Error("USER_NOT_FOUND");
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        name: data.name.trim(),
        phoneNumber: data.phoneNumber ? data.phoneNumber.trim() : null,
        address: data.address ? data.address.trim() : null,
      },
      select: {
        id: true,
        name: true,
        email: true,
        phoneNumber: true,
        address: true,
        role: true,
      },
    });

    return updatedUser;
  }

  // 3. Đổi mật khẩu khi đang đăng nhập
  async changePassword(userId: string, data: ChangePasswordInput) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user || !user.password) {
      throw new Error("USER_NOT_FOUND");
    }

    // Kiểm tra mật khẩu hiện tại có khớp trong DB không
    const isPasswordMatch = await bcrypt.compare(data.currentPassword, user.password);
    if (!isPasswordMatch) {
      throw new Error("WRONG_CURRENT_PASSWORD");
    }

    // Băm mật khẩu mới và lưu vào DB
    const hashedPassword = await bcrypt.hash(data.newPassword, 10);

    await prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword },
    });

    return {
      message: "Đổi mật khẩu thành công!",
    };
  }
}

export const userService = new UserService();