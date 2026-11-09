"use client";
import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/auth.store";
import { LogOut, ShoppingCart, User as UserIcon } from "lucide-react";

const Header = () => {
    const router = useRouter();
    const {user, isHydrated,logout,initAuth} = useAuthStore();

    useEffect(()=>{
        initAuth();
    },[initAuth]);

    const handleLogout = ()=>{
        logout();
        router.push("/login");
    }
  return (
    <header className="sticky top-0 z-50 w-full bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
            <div className="flex items-center gap-8">
                <Link href="/" className="text-xl font-extrabold tracking-tight text-blue-600 dark:text-blue-400 flex items-center gap-2">
                <span className="text-2xl">⚡</span>
                <span>ElectroStore</span>
                </Link>

                <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-zinc-600 dark:text-zinc-300">
                <Link href="/" className="hover:text-blue-600 dark:hover:text-blue-400 transition">
                    Trang chủ
                </Link>
                <Link href="/products" className="hover:text-blue-600 dark:hover:text-blue-400 transition">
                    Sản phẩm
                </Link>
                </nav>

            </div>

        <div className="flex items-center gap-4">
            <Link href="/cart" className="p-2 text-zinc-600 dark:text-zinc-300 hover:text-blue-600 transition relative">
            <ShoppingCart size={22} />
          </Link>

          {!isHydrated ? (
            <div className="w-24 h-8 bg-zinc-200 dark:bg-zinc-800 animate-pulse rounded-lg"></div>
          ) : user ? (
            /* 👉 ĐÃ ĐĂNG NHẬP: Hiện tên khách, vai trò và nút Đăng Xuất */
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700">
                <UserIcon size={16} className="text-blue-600 dark:text-blue-400" />
                <span className="text-sm font-semibold text-zinc-800 dark:text-zinc-200 max-w-[120px] truncate">
                  {user.name || user.email}
                </span>
                {/* Huy hiệu vai trò */}
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                  {user.role}
                </span>
              </div>
              {/* NÚT BẤM ĐĂNG XUẤT (UC-06) */}
              <button
                onClick={handleLogout}
                title="Đăng xuất"
                className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 rounded-lg transition"
              >
                <LogOut size={16} />
                <span className="hidden sm:inline">Đăng xuất</span>
              </button>
            </div>
          ) : (
            /* 👉 CHƯA ĐĂNG NHẬP: Hiện 2 nút Đăng nhập & Đăng ký */
            <div className="flex items-center gap-2">
              <Link
                href="/login"
                className="px-3.5 py-1.5 text-sm font-medium text-zinc-700 dark:text-zinc-200 hover:text-blue-600 transition"
              >
                Đăng nhập
              </Link>
              <Link
                href="/register"
                className="px-3.5 py-1.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm transition"
              >
                Đăng ký
              </Link>
            </div>
          )}
        </div>

        </div>
    </header>
  )
}

export default Header
