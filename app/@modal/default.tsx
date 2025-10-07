"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { TodoForm } from "@/components/TodoForm";

interface Todo {
  id: string;
  todoTitle: string;
  todoText: string;
  endTime: Date | null;
}

function ModalContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const createParam = searchParams.get("create");
  const editParam = searchParams.get("edit");
  const [todo, setTodo] = useState<Todo | null>(null);
  const [loading, setLoading] = useState(false);

  const handleClose = () => {
    router.push("/");
  };

  useEffect(() => {
    if (editParam) {
      setLoading(true);
      fetchTodo(editParam);
    } else {
      setTodo(null);
      setLoading(false);
    }
  }, [editParam]);

  const fetchTodo = async (id: string) => {
    try {
      const response = await fetch(`/api/todos/${id}`);
      if (response.ok) {
        const data = await response.json();
        setTodo(data);
      }
    } catch (error) {
      console.error("Error fetching todo for edit modal:", error);
    } finally {
      setLoading(false);
    }
  };

  // 新規作成モーダル
  if (createParam === "true") {
    return <TodoForm mode="create" open={true} onClose={handleClose} />;
  }

  // 編集モーダル
  if (editParam) {
    if (loading) {
      return null; // ローディング中は何も表示しない
    }

    if (todo) {
      return (
        <TodoForm todo={todo} mode="edit" open={true} onClose={handleClose} />
      );
    }

    return null; // todoが取得できなかった場合
  }

  return null;
}

export default function Default() {
  return (
    <Suspense fallback={null}>
      <ModalContent />
    </Suspense>
  );
}
