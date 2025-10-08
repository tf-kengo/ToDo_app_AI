"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";

export default function RegistryPage() {
  const [userName, setUserName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!userName.trim()) {
      setError("ユーザー名を入力してください");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userName: userName.trim() }),
      });

      const data = await response.json();

      if (response.ok) {
        router.push("/");
      } else {
        setError(data.error || "新規登録に失敗しました");
      }
    } catch (error) {
      setError("新規登録に失敗しました");
      console.error("Register error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Todo App に新規登録
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            既にアカウントをお持ちですか？{" "}
            <Link
              href="/login"
              className="font-medium text-blue-600 hover:text-blue-500"
            >
              ログインはこちら
            </Link>
          </p>
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
            {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
          </div>
          <div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "登録中..." : "新規登録"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
