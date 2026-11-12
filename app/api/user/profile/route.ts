import { UserController } from "@/controllers/user.controller";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  return UserController.getProfile(req);
}
export async function PATCH(req: NextRequest) {
  return UserController.updateProfile(req);
}