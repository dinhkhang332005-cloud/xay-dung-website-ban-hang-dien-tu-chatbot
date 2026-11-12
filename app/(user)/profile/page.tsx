
import ProfileForm from "@/components/user/ProfileForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Hồ Sơ Cá Nhân | Electronics Store",
  description: "Xem và cập nhật thông tin tài khoản của bạn",
};

export default function ProfilePage() {
  return (
    <main className="min-h-screen w-full py-10 px-4 bg-neutral-100 dark:bg-neutral-950">
        <ProfileForm />
    </main>
  );
}