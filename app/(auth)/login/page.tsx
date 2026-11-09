
import LoginForm from "@/components/auth/LoginForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Đăng Nhập | Electronics Store",
  description: "Đăng nhập tài khoản mua sắm thiết bị điện tử",
};

export default function LoginPage() {
  return (
    <main className="min-h-screen w-full flex items-center justify-center bg-neutral-100 dark:bg-neutral-950 p-4">
      <LoginForm />
    </main>
  );
}