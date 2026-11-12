import { UserController } from "@/controllers/user.controller";
import { NextRequest } from "next/server";

// Đổi mật khẩu khi đang đăng nhập
export async function POST(req: NextRequest) {
  return UserController.changePassword(req);
}