import RegisterForm from "@/components/auth/RegisterForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Đăng Ký Tài Khoản | Electronics Store",
  description: "Tạo tài khoản mua sắm thiết bị điện tử và nhận tư vấn AI thông minh",
};

export default function RegisterPage() {
  return (
    <main className="min-h-screen w-full flex items-center justify-center bg-neutral-100 dark:bg-neutral-950 p-4">
      <RegisterForm />
    </main>
  )
}