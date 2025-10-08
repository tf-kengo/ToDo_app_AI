"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

interface HeaderProps {
  userName: string;
}

export default function Header({ userName }: HeaderProps) {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      const response = await fetch("/api/auth/logout", {
        method: "POST",
      });

      if (response.ok) {
        router.push("/login");
      } else {
        alert("ログアウトに失敗しました");
      }
    } catch (error) {
      alert("ログアウトに失敗しました");
      console.error("Logout error:", error);
    }
  };

  return (
    <header className="bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div>
            <h1 className="text-xl font-semibold text-gray-900">Todo App</h1>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-700">
              ようこそ、<span className="font-medium">{userName}</span>さん
            </span>
            <Button onClick={handleLogout} variant="outline" size="sm">
              ログアウト
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
