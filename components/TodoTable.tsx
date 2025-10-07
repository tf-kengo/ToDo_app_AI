"use client";

import { useState, useEffect } from "react";
import { format } from "date-fns";
import { ja } from "date-fns/locale";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Edit, Trash2, Eye } from "lucide-react";
import Link from "next/link";

interface Todo {
  id: string;
  todoTitle: string;
  todoText: string;
  endTime: Date | null;
}

export function TodoTable() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTodos();

    // カスタムイベントをリスニングしてtodoリストを更新
    const handleTodoUpdate = () => {
      fetchTodos();
    };

    window.addEventListener("todoUpdated", handleTodoUpdate);

    // クリーンアップ
    return () => {
      window.removeEventListener("todoUpdated", handleTodoUpdate);
    };
  }, []);

  const fetchTodos = async () => {
    try {
      const response = await fetch("/api/todos");
      if (response.ok) {
        const data = await response.json();
        setTodos(data);
      }
    } catch (error) {
      console.error("Failed to fetch todos:", error);
    } finally {
      setLoading(false);
    }
  };

  const deleteTodo = async (id: string) => {
    if (confirm("このTodoを削除しますか？")) {
      try {
        const response = await fetch(`/api/todos/${id}`, {
          method: "DELETE",
        });
        if (response.ok) {
          fetchTodos(); // リフレッシュ
        }
      } catch (error) {
        console.error("Failed to delete todo:", error);
      }
    }
  };

  if (loading) {
    return <div>読み込み中...</div>;
  }

  if (todos.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        Todoはありません
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>名前</TableHead>
          <TableHead>終了時間</TableHead>
          <TableHead>詳細</TableHead>
          <TableHead>操作</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {todos.map((todo) => (
          <TableRow key={todo.id}>
            <TableCell className="font-medium">{todo.todoTitle}</TableCell>
            <TableCell>
              {todo.endTime
                ? format(new Date(todo.endTime), "yyyy年MM月dd日", {
                    locale: ja,
                  })
                : "未設定"}
            </TableCell>
            <TableCell>
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Eye className="h-4 w-4" />
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>{todo.todoTitle}</DialogTitle>
                    <DialogDescription>
                      {todo.todoText || "詳細はありません"}
                    </DialogDescription>
                  </DialogHeader>
                </DialogContent>
              </Dialog>
            </TableCell>
            <TableCell>
              <div className="flex space-x-2">
                <Link href={`/?edit=${todo.id}`}>
                  <Button variant="outline" size="sm">
                    <Edit className="h-4 w-4" />
                  </Button>
                </Link>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => deleteTodo(todo.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
