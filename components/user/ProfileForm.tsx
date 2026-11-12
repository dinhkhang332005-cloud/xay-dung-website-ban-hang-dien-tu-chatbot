"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuthStore } from "@/stores/auth.store";
import { userApi } from "@/app/api_Client/user.api";
import {
  updateProfileSchema,
  UpdateProfileInput,
  changePasswordSchema,
  ChangePasswordInput,
} from "@/validations/auth.schema";
import { CheckCircle2, Eye, EyeOff, KeyRound, Loader2, ShieldCheck, User as UserIcon } from "lucide-react";

const ProfileForm = () => {
  const router = useRouter();
  const { user, isHydrated, setUser } = useAuthStore();

  const [activeTab, setActiveTab] = useState<"info" | "password">("info");
  const [serverError, setServerError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // Ẩn/hiện các ô mật khẩu
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  // Nếu chưa đăng nhập thì đá về trang Login
  useEffect(() => {
    if (isHydrated && !user) {
      router.push("/login");
    }
  }, [isHydrated, user, router]);

  // Form 1: Cập nhật thông tin cá nhân
  const profileForm = useForm<UpdateProfileInput>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: {
      name: "",
      phoneNumber: "",
      address: "",
    },
  });

  // Form 2: Đổi mật khẩu
  const passwordForm = useForm<ChangePasswordInput>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmNewPassword: "",
    },
  });

  // Đổ dữ liệu hiện tại của người dùng vào Form 1
  useEffect(() => {
    if (user) {
      profileForm.reset({
        name: user.name || "",
        phoneNumber: user.phoneNumber || "",
        address: user.address || "",
      });
    }
  }, [user, profileForm]);

  // Xử lý lưu Thông tin cá nhân
  const onUpdateProfile = async (data: UpdateProfileInput) => {
    if (!user) return;
    try {
      setServerError("");
      setSuccessMessage("");

      const res: any = await userApi.updateProfile({
        userId: user.id,
        ...data,
      });

      // Cập nhật lại Zustand & localStorage để thanh Header đổi tên ngay lập tức
      if (res.user) {
        setUser(res.user);
      }
      setSuccessMessage(res.message || "Cập nhật thông tin thành công!");
    } catch (error: any) {
      setServerError(error.response?.data?.message || "Cập nhật thất bại. Vui lòng thử lại!");
    }
  };

  // Xử lý Đổi mật khẩu
  const onChangePassword = async (data: ChangePasswordInput) => {
    if (!user) return;
    try {
      setServerError("");
      setSuccessMessage("");

      const res: any = await userApi.changePassword({
        userId: user.id,
        ...data,
      });

      passwordForm.reset();
      setSuccessMessage(res.message || "Đổi mật khẩu thành công!");
    } catch (error: any) {
      setServerError(error.response?.data?.message || "Đổi mật khẩu thất bại. Vui lòng thử lại!");
    }
  };

  // Khi chuyển Tab thì xóa thông báo cũ
  const handleSwitchTab = (tab: "info" | "password") => {
    setActiveTab(tab);
    setServerError("");
    setSuccessMessage("");
  };

  if (!isHydrated || !user) {
    return (
      <div className="flex justify-center items-center py-20 text-zinc-500 text-sm">
        <Loader2 className="animate-spin mr-2" size={18} /> Đang tải thông tin tài khoản...
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl mx-auto bg-white dark:bg-zinc-900 rounded-2xl shadow-xl border border-zinc-200 dark:border-zinc-800 overflow-hidden">
      {/* Header của khung Hồ sơ */}
      <div className="p-6 bg-zinc-50 dark:bg-zinc-950/50 border-b border-zinc-200 dark:border-zinc-800 flex items-center gap-4">
        <div className="w-14 h-14 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold text-xl">
          {user.name ? user.name.charAt(0).toUpperCase() : "U"}
        </div>
        <div>
          <h1 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">{user.name}</h1>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-sm text-zinc-500 dark:text-zinc-400">{user.email}</span>
            <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300">
              <ShieldCheck size={12} /> {user.role}
            </span>
          </div>
        </div>
      </div>

      {/* Thanh chuyển Tab */}
      <div className="flex border-b border-zinc-200 dark:border-zinc-800">
        <button
          type="button"
          onClick={() => handleSwitchTab("info")}
          className={`flex-1 py-3.5 text-sm font-medium flex items-center justify-center gap-2 border-b-2 transition ${
            activeTab === "info"
              ? "border-blue-600 text-blue-600 dark:text-blue-400 bg-blue-50/40 dark:bg-blue-950/20"
              : "border-transparent text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200"
          }`}
        >
          <UserIcon size={16} /> Thông tin cá nhân
        </button>

        <button
          type="button"
          onClick={() => handleSwitchTab("password")}
          className={`flex-1 py-3.5 text-sm font-medium flex items-center justify-center gap-2 border-b-2 transition ${
            activeTab === "password"
              ? "border-blue-600 text-blue-600 dark:text-blue-400 bg-blue-50/40 dark:bg-blue-950/20"
              : "border-transparent text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200"
          }`}
        >
          <KeyRound size={16} /> Đổi mật khẩu
        </button>
      </div>

      <div className="p-6">
        {serverError && (
          <div className="mb-4 p-3 rounded-lg bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-sm text-red-600 dark:text-red-400">
            {serverError}
          </div>
        )}

        {successMessage && (
          <div className="mb-4 p-3 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-sm text-emerald-600 dark:text-emerald-400 flex items-center gap-2">
            <CheckCircle2 size={18} className="shrink-0" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* TAB 1: THÔNG TIN CÁ NHÂN */}
        {activeTab === "info" && (
          <form onSubmit={profileForm.handleSubmit(onUpdateProfile)} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                Email đăng nhập
              </label>
              <input
                type="email"
                value={user.email}
                disabled
                className="w-full px-3.5 py-2.5 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-800/50 text-zinc-500 text-sm cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                Họ và tên <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                {...profileForm.register("name")}
                className="w-full px-3.5 py-2.5 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-transparent text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition text-sm"
              />
              {profileForm.formState.errors.name && (
                <p className="text-xs text-red-500 mt-1">{profileForm.formState.errors.name.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                Số điện thoại
              </label>
              <input
                type="text"
                placeholder="Ví dụ: 0912345678"
                {...profileForm.register("phoneNumber")}
                className="w-full px-3.5 py-2.5 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-transparent text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition text-sm"
              />
              {profileForm.formState.errors.phoneNumber && (
                <p className="text-xs text-red-500 mt-1">{profileForm.formState.errors.phoneNumber.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                Địa chỉ giao hàng mặc định
              </label>
              <textarea
                rows={3}
                placeholder="Số nhà, tên đường, phường/xã, quận/huyện, tỉnh/thành phố"
                {...profileForm.register("address")}
                className="w-full px-3.5 py-2.5 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-transparent text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition text-sm"
              />
              {profileForm.formState.errors.address && (
                <p className="text-xs text-red-500 mt-1">{profileForm.formState.errors.address.message}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={profileForm.formState.isSubmitting}
              className="w-full py-2.5 px-4 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm flex items-center justify-center gap-2 transition disabled:opacity-50"
            >
              {profileForm.formState.isSubmitting ? (
                <>
                  <Loader2 className="animate-spin" size={18} />
                  <span>Đang lưu thay đổi...</span>
                </>
              ) : (
                <span>Lưu thông tin cá nhân</span>
              )}
            </button>
          </form>
        )}

        {/* TAB 2: ĐỔI MẬT KHẨU */}
        {activeTab === "password" && (
          <form onSubmit={passwordForm.handleSubmit(onChangePassword)} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                Mật khẩu hiện tại <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type={showCurrent ? "text" : "password"}
                  {...passwordForm.register("currentPassword")}
                  className="w-full px-3.5 py-2.5 pr-10 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-transparent text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition text-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowCurrent(!showCurrent)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600"
                >
                  {showCurrent ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {passwordForm.formState.errors.currentPassword && (
                <p className="text-xs text-red-500 mt-1">{passwordForm.formState.errors.currentPassword.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                Mật khẩu mới <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type={showNew ? "text" : "password"}
                  placeholder="Ít nhất 8 ký tự, chữ hoa, số & ký tự đặc biệt"
                  {...passwordForm.register("newPassword")}
                  className="w-full px-3.5 py-2.5 pr-10 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-transparent text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition text-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowNew(!showNew)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600"
                >
                  {showNew ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {passwordForm.formState.errors.newPassword && (
                <p className="text-xs text-red-500 mt-1">{passwordForm.formState.errors.newPassword.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                Xác nhận mật khẩu mới <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type={showConfirm ? "text" : "password"}
                  {...passwordForm.register("confirmNewPassword")}
                  className="w-full px-3.5 py-2.5 pr-10 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-transparent text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition text-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600"
                >
                  {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {passwordForm.formState.errors.confirmNewPassword && (
                <p className="text-xs text-red-500 mt-1">{passwordForm.formState.errors.confirmNewPassword.message}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={passwordForm.formState.isSubmitting}
              className="w-full py-2.5 px-4 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm flex items-center justify-center gap-2 transition disabled:opacity-50"
            >
              {passwordForm.formState.isSubmitting ? (
                <>
                  <Loader2 className="animate-spin" size={18} />
                  <span>Đang đổi mật khẩu...</span>
                </>
              ) : (
                <span>Xác nhận đổi mật khẩu</span>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ProfileForm;