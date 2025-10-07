"use client";

import { Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { TodoForm } from "@/components/TodoForm";

interface Todo {
  id: string;
  todoTitle: string;
  todoText: string;
  endTime: Date | null;
}

interface EditTodoModalProps {
  params: { id: string };
}

function EditModalContent({ params }: EditTodoModalProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isOpen = searchParams.get("edit") === params.id;
  const [todo, setTodo] = useState<Todo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isOpen && params.id) {
      fetchTodo();
    }
  }, [isOpen, params.id]);

  const fetchTodo = async () => {
    try {
      const response = await fetch(`/api/todos/${params.id}`);
      if (response.ok) {
        const data = await response.json();
        setTodo(data);
      }
    } catch (error) {
      console.error("Failed to fetch todo:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    router.push("/");
  };

  if (loading) {
    return null;
  }

  if (!todo) {
    return null;
  }

  return (
    <TodoForm todo={todo} mode="edit" open={isOpen} onClose={handleClose} />
  );
}

export default function EditTodoModal({ params }: EditTodoModalProps) {
  return (
    <Suspense fallback={null}>
      <EditModalContent params={params} />
    </Suspense>
  );
}
