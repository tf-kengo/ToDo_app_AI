"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";

export default function LoginPage() {
  const [userName, setUserName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!userName.trim()) {
      alert("ユーザー名を入力してください");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userName: userName.trim() }),
      });

      if (response.ok) {
        router.push("/");
      } else {
        const error = await response.text();
        alert(`ログインに失敗しました: ${error}`);
      }
    } catch (error) {
      alert("ログインに失敗しました");
      console.error("Login error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Todo App にログイン
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div>
            <Label htmlFor="userName">ユーザー名</Label>
            <Input
              id="userName"
              type="text"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              placeholder="ユーザー名を入力"
              className="mt-1"
              disabled={isLoading}
            />
          </div>
          <div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "ログイン中..." : "ログイン"}
            </Button>
          </div>
          <div className="mt-4">
            <Link href="/registry">
              <Button
                variant="ghost"
                className="w-full text-sm text-gray-600 hover:text-gray-800"
                type="button"
              >
                新規登録はこちら
              </Button>
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
