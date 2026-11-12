
import ResetPasswordForm from "@/components/auth/ResetPasswordForm";
import { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Đặt Lại Mật Khẩu | Electronics Store",
  description: "Tạo mật khẩu mới cho tài khoản của bạn",
};

export default function ResetPasswordPage() {
  return (
    <main className="min-h-screen w-full flex items-center justify-center bg-neutral-100 dark:bg-neutral-950 p-4">
      <Suspense fallback={<div className="text-sm text-zinc-500">Đang tải biểu mẫu...</div>}>
        <ResetPasswordForm />
      </Suspense>
    </main>
  );
}