"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, LoginInput } from "@/validations/auth.schema";
import { authApi } from "@/app/api_Client/auth.api";
import { Eye, EyeOff, Loader2 } from "lucide-react";


const LoginForm = () => {
 const router = useRouter();
 const [showPassword, setShowPassword] = useState(false);
 const [serverErrors, setServerErrors] = useState("");
 const [successMessage, setSuccessMessage] = useState("");

 const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginInput) => {
    try {
      setServerErrors("");
      setSuccessMessage("");
      
      const response: any = await authApi.login(data);
      
      if (response?.user) {
        localStorage.setItem("user", JSON.stringify(response.user));
      }
      setSuccessMessage("Đăng nhập thành công! Đang chuyển hướng...");
      
      setTimeout(() => {
        router.push("/");
      }, 1000);
    } catch (error: any) {
      
      const message =
        error.response?.data?.message || "Đăng nhập thất bại. Vui lòng thử lại!";
      setServerErrors(message);
    }
  };
  return (
    <div className="w-full max-w-md mx-auto p-6 bg-white dark:bg-zinc-900 rounded-2xl shadow-xl border border-zinc-200 dark:border-zinc-800">
      {/* Tiêu đề */}
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
          Đăng nhập tài khoản
        </h1>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
          Chào mừng bạn quay trở lại với Electronics Store
        </p>
      </div>
      
      {serverErrors && (
        <div className="mb-4 p-3 rounded-lg bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-sm text-red-600 dark:text-red-400">
          {serverErrors}
        </div>
      )}
     
      {successMessage && (
        <div className="mb-4 p-3 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-sm text-emerald-600 dark:text-emerald-400">
          {successMessage}
        </div>
      )}
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* 1. Email */}
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
        
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Mật khẩu <span className="text-red-500">*</span>
            </label>
            <Link
              href="/forgot-password"
              className="text-xs text-blue-600 dark:text-blue-400 hover:underline"
            >
              Quên mật khẩu?
            </Link>
          </div>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Nhập mật khẩu của bạn"
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
            <p className="text-xs text-red-500 mt-1">
              {errors.password.message}
            </p>
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
              <span>Đang đăng nhập...</span>
            </>
          ) : (
            <span>Đăng nhập</span>
          )}
        </button>
      </form>
      {}
      <div className="mt-6 text-center text-sm text-zinc-500 dark:text-zinc-400">
        Chưa có tài khoản?{" "}
        <Link
          href="/register"
          className="text-blue-600 dark:text-blue-400 font-semibold hover:underline"
        >
          Đăng ký ngay
        </Link>
      </div>
    </div>
  )
}

export default LoginForm
