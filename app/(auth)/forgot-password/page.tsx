
import ForgotPasswordForm from "@/components/auth/ForgotPasswordForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Quên Mật Khẩu | Electronics Store",
  description: "Khôi phục lại mật khẩu tài khoản mua sắm của bạn",
};

export default function ForgotPasswordPage() {
  return (
    <main className="min-h-screen w-full flex items-center justify-center bg-neutral-100 dark:bg-neutral-950 p-4">
      <ForgotPasswordForm />
    </main>
  );
}