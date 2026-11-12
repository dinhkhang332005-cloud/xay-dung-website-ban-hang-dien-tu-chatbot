"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { forgotPasswordSchema, ForgotPasswordInput } from "@/validations/auth.schema";
import { authApi } from "@/app/api_Client/auth.api";
import { ArrowLeft, Loader2, MailCheck } from "lucide-react";

const ForgotPasswordForm = () => {
  const [serverErrors, setServerErrors] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordInput>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: "" },
  });

  const onSubmit = async (data: ForgotPasswordInput) => {
    try {
      setServerErrors("");
      setSuccessMessage("");

      const res: any = await authApi.forgotPassword(data);
      setSuccessMessage(res.message || "Đường link đặt lại mật khẩu đã được tạo! Vui lòng kiểm tra Terminal console.");
    } catch (error: any) {
      const message = error.response?.data?.message || "Gửi yêu cầu thất bại. Vui lòng thử lại!";
      setServerErrors(message);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto p-6 bg-white dark:bg-zinc-900 rounded-2xl shadow-xl border border-zinc-200 dark:border-zinc-800">
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
          Quên mật khẩu?
        </h1>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
          Nhập email của bạn để nhận đường link khôi phục mật khẩu
        </p>
      </div>

      {serverErrors && (
        <div className="mb-4 p-3 rounded-lg bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-sm text-red-600 dark:text-red-400">
          {serverErrors}
        </div>
      )}

      {successMessage && (
        <div className="mb-4 p-3 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-sm text-emerald-600 dark:text-emerald-400 flex items-start gap-2">
          <MailCheck size={18} className="shrink-0 mt-0.5" />
          <span>{successMessage}</span>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
            Địa chỉ Email <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            placeholder="example@gmail.com"
            {...register("email")}
            className="w-full px-3.5 py-2.5 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-transparent text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition text-sm"
          />
          {errors.email && (
            <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>
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
              <span>Đang gửi yêu cầu...</span>
            </>
          ) : (
            <span>Gửi link khôi phục</span>
          )}
        </button>
      </form>

      <div className="mt-6 text-center text-sm text-zinc-500 dark:text-zinc-400">
        <Link
          href="/login"
          className="inline-flex items-center gap-1.5 text-blue-600 dark:text-blue-400 font-semibold hover:underline"
        >
          <ArrowLeft size={16} /> Quay lại đăng nhập
        </Link>
      </div>
    </div>
  );
};

export default ForgotPasswordForm;