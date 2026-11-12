import { userService } from "@/services/user.service";
import { changePasswordSchema, updateProfileSchema } from "@/validations/auth.schema";
import { NextRequest, NextResponse } from "next/server";

export const UserController = {
  // 1. Xem thông tin hồ sơ
  getProfile: async (req: NextRequest) => {
    try {
      const userId = req.nextUrl.searchParams.get("userId");

      if (!userId) {
        return NextResponse.json(
          { message: "Thiếu thông tin người dùng (userId)!" },
          { status: 400 }
        );
      }

      const user = await userService.getProfile(userId);
      return NextResponse.json({ user }, { status: 200 });
    } catch (error: any) {
      if (error.message === "USER_NOT_FOUND") {
        return NextResponse.json(
          { message: "Không tìm thấy tài khoản người dùng!" },
          { status: 404 }
        );
      }

      console.error("Lỗi Controller Lấy hồ sơ:", error);
      return NextResponse.json(
        { message: "Hệ thống gặp sự cố máy chủ nội bộ. Vui lòng thử lại sau!" },
        { status: 500 }
      );
    }
  },

  // 2. Cập nhật thông tin hồ sơ
  updateProfile: async (req: NextRequest) => {
    try {
      const body = await req.json();
      const { userId, ...profileData } = body;

      if (!userId) {
        return NextResponse.json(
          { message: "Vui lòng đăng nhập để thực hiện thao tác này!" },
          { status: 401 }
        );
      }

      const validation = updateProfileSchema.safeParse(profileData);
      if (!validation.success) {
        return NextResponse.json(
          {
            message: "Dữ liệu nhập vào không hợp lệ",
            errors: validation.error.flatten().fieldErrors,
          },
          { status: 400 }
        );
      }

      const updatedUser = await userService.updateProfile(userId, validation.data);
      return NextResponse.json(
        {
          message: "Cập nhật thông tin cá nhân thành công!",
          user: updatedUser,
        },
        { status: 200 }
      );
    } catch (error: any) {
      if (error.message === "USER_NOT_FOUND") {
        return NextResponse.json(
          { message: "Không tìm thấy tài khoản người dùng!" },
          { status: 404 }
        );
      }

      console.error("Lỗi Controller Cập nhật hồ sơ:", error);
      return NextResponse.json(
        { message: "Hệ thống gặp sự cố máy chủ nội bộ. Vui lòng thử lại sau!" },
        { status: 500 }
      );
    }
  },

  // 3. Đổi mật khẩu trong trang cá nhân
  changePassword: async (req: NextRequest) => {
    try {
      const body = await req.json();
      const { userId, ...passwordData } = body;

      if (!userId) {
        return NextResponse.json(
          { message: "Vui lòng đăng nhập để thực hiện thao tác này!" },
          { status: 401 }
        );
      }

      const validation = changePasswordSchema.safeParse(passwordData);
      if (!validation.success) {
        return NextResponse.json(
          {
            message: "Dữ liệu nhập vào không hợp lệ",
            errors: validation.error.flatten().fieldErrors,
          },
          { status: 400 }
        );
      }

      const result = await userService.changePassword(userId, validation.data);
      return NextResponse.json(result, { status: 200 });
    } catch (error: any) {
      if (error.message === "WRONG_CURRENT_PASSWORD") {
        return NextResponse.json(
          { message: "Mật khẩu hiện tại không chính xác!" },
          { status: 400 }
        );
      }

      if (error.message === "USER_NOT_FOUND") {
        return NextResponse.json(
          { message: "Không tìm thấy tài khoản người dùng!" },
          { status: 404 }
        );
      }

      console.error("Lỗi Controller Đổi mật khẩu:", error);
      return NextResponse.json(
        { message: "Hệ thống gặp sự cố máy chủ nội bộ. Vui lòng thử lại sau!" },
        { status: 500 }
      );
    }
  },
};