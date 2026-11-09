"use client"
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema, RegisterInput } from "@/validations/auth.schema";
import { authApi } from "@/app/api_Client/auth.api";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import Link from "next/link";

const RegisterForm = () => {

  const router = useRouter();
  const [showPassword , setShowPassword] = useState(false);
  const [serverErrors, setServerErrors] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  
  const {
    register,
    handleSubmit,
    formState:{errors, isSubmitting},
  } = useForm<RegisterInput>({
    resolver:zodResolver(registerSchema),
    defaultValues:{
      name :"",
      email:"",
      password:"",
      phoneNumber:"",
      address:"",
    },
  })

  const onSubmit = async(data:RegisterInput) =>{
    try{
    setServerErrors("");
    setSuccessMessage("");
    await authApi.register(data);
    setSuccessMessage("Đăng ký tài khoản thành công! Đang chuyển hướng...");
    setTimeout(()=>{
      router.push("/login");
    },1500);
    }catch(error:any){
      const message = error.response?.data?.message|| "Đăng ký tài khoản thất bại. Vui lòng thử lại";
      setServerErrors(message);
    }
  }

  return (
    <div className="w-full max-w-md mx-auto p-6 bg-white dark:bg-zinc-900 rounded-2xl shadow-xl border border-zinc-200 dark:border-zinc-800">
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
          Tạo tài khoản mới
        </h1>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
          Điền thông tin bên dưới để trải nghiệm mua sắm
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

      <form onSubmit = {handleSubmit(onSubmit)}  className="space-y-4" >
        <div>
          <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
            Họ và tên <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            placeholder="Nguyễn Văn A"
            {...register("name")}
            className="w-full px-3.5 py-2.5 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-transparent text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition text-sm"
          />
          {errors.name && (
            <p className="text-xs text-red-500 mt-1">{errors.name.message}</p>
          )}
        </div>

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
          <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
            Mật khẩu <span className="text-red-500">*</span>
          </label>
          <div className="relative">
              <input
              type={showPassword ? "text" : "password"}
              placeholder="Ít nhất 8 ký tự, có chữ hoa, số & ký tự đặc biệt"
              {...register("password")}
              className="w-full px-3.5 py-2.5 pr-10 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-transparent text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition text-sm"
            />
              <button type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition">
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
          </div>
              {errors.password && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.password.message}
                </p>
          )}
        </div>
        
        <div>
          <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
            Số điện thoại
          </label>
          <input
            type="tel"
            placeholder="0912345678"
            {...register("phoneNumber")}
            className="w-full px-3.5 py-2.5 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-transparent text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition text-sm"
          />
          {errors.phoneNumber && (
            <p className="text-xs text-red-500 mt-1">
              {errors.phoneNumber.message}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
            Địa chỉ
          </label>
          <input
            type="text"
            placeholder="Số nhà, tên đường, phường/xã, quận/huyện..."
            {...register("address")}
            className="w-full px-3.5 py-2.5 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-transparent text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition text-sm"
          />
          {errors.address && (
            <p className="text-xs text-red-500 mt-1">
              {errors.address.message}
            </p>
          )}
        </div>

        <button type="submit"
          disabled={isSubmitting}
          className="w-full mt-2 py-2.5 px-4 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm flex items-center justify-center gap-2 transition disabled:opacity-50 disabled:cursor-not-allowed shadow-md shadow-blue-500/20"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="animate-spin" size={18} />
              <span>Đang đăng ký tài khoản...</span>
            </>
          ) : (
            <span>Đăng ký</span>
          )} 
          
        </button>
      </form>

       <div className="mt-6 text-center text-sm text-zinc-500 dark:text-zinc-400">
        Đã có tài khoản?{" "}
        <Link
          href="/login"
          className="text-blue-600 dark:text-blue-400 font-semibold hover:underline"
        >
          Đăng nhập ngay
        </Link>
      </div>
      
    </div>
  )
}

export default RegisterForm
