"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { resetPasswordSchema, ResetPasswordInput } from "@/validations/auth.schema";
import { authApi } from "@/app/api_Client/auth.api";
import { CheckCircle2, Eye, EyeOff, Loader2 } from "lucide-react";

const ResetPasswordForm = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tokenFromUrl = searchParams.get("token") || "";

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [serverErrors, setServerErrors] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordInput>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      token: tokenFromUrl,
      password: "",
      confirmPassword: "",
    },
  });

  // Tự động gán token từ URL vào form
  useEffect(() => {
    if (tokenFromUrl) {
      setValue("token", tokenFromUrl);
    }
  }, [tokenFromUrl, setValue]);

  const onSubmit = async (data: ResetPasswordInput) => {
    try {
      setServerErrors("");
      setSuccessMessage("");

      const res: any = await authApi.resetPassword(data);
      setSuccessMessage(res.message || "Đặt lại mật khẩu thành công! Đang chuyển hướng đến đăng nhập...");

      setTimeout(() => {
        router.push("/login");
      }, 2000);
    } catch (error: any) {
      const message = error.response?.data?.message || "Đặt lại mật khẩu thất bại. Vui lòng thử lại!";
      setServerErrors(message);
    }
  };

  // Nếu trên URL không có token
  if (!tokenFromUrl) {
    return (
      <div className="w-full max-w-md mx-auto p-6 bg-white dark:bg-zinc-900 rounded-2xl shadow-xl border border-zinc-200 dark:border-zinc-800 text-center">
        <h1 className="text-xl font-bold text-red-600 mb-2">Liên kết không hợp lệ</h1>
        <p className="text-sm text-zinc-500 mb-6">
          Không tìm thấy mã xác thực khôi phục mật khẩu. Vui lòng thực hiện lại từ trang quên mật khẩu.
        </p>
        <Link
          href="/forgot-password"
          className="inline-block py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm rounded-lg transition"
        >
          Yêu cầu gửi lại link
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto p-6 bg-white dark:bg-zinc-900 rounded-2xl shadow-xl border border-zinc-200 dark:border-zinc-800">
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
          Đặt lại mật khẩu mới
        </h1>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
          Nhập mật khẩu mới an toàn cho tài khoản của bạn
        </p>
      </div>

      {serverErrors && (
        <div className="mb-4 p-3 rounded-lg bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-sm text-red-600 dark:text-red-400">
          {serverErrors}
        </div>
      )}

      {successMessage && (
        <div className="mb-4 p-3 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-sm text-emerald-600 dark:text-emerald-400 flex items-start gap-2">
          <CheckCircle2 size={18} className="shrink-0 mt-0.5" />
          <span>{successMessage}</span>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Input ẩn lưu token */}
        <input type="hidden" {...register("token")} />

        {/* 1. Mật khẩu mới */}
        <div>
          <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
            Mật khẩu mới <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Ít nhất 8 ký tự, có chữ hoa, số & ký tự đặc biệt"
              {...register("password")}
              className="w-full px-3.5 py-2.5 pr-10 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-transparent text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition text-sm"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          {errors.password && (
            <p className="text-xs text-red-500 mt-1">{errors.password.message}</p>
          )}
        </div>

        {/* 2. Xác nhận mật khẩu mới */}
        <div>
          <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
            Nhập lại mật khẩu mới <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <input
              type={showConfirm ? "text" : "password"}
              placeholder="Nhập lại mật khẩu mới giống ở trên"
              {...register("confirmPassword")}
              className="w-full px-3.5 py-2.5 pr-10 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-transparent text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition text-sm"
            />
            <button
              type="button"
              onClick={() => setShowConfirm(!showConfirm)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition"
            >
              {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          {errors.confirmPassword && (
            <p className="text-xs text-red-500 mt-1">{errors.confirmPassword.message}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full mt-2 py-2.5 px-4 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm flex items-center justify-center gap-2 transition disabled:opacity-50 disabled:cursor-not-allowed shadow-md shadow-blue-500/20"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="animate-spin" size={18} />
              <span>Đang lưu mật khẩu mới...</span>
            </>
          ) : (
            <span>Xác nhận đổi mật khẩu</span>
          )}
        </button>
      </form>
    </div>
  );
};

export default ResetPasswordForm;