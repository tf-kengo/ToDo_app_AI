"use client";

import { Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { TodoForm } from "@/components/TodoForm";

function CreateModalContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isOpen = searchParams.get("create") === "true";

  // デバッグログ
  console.log("CreateModalContent rendered");
  console.log("searchParams:", searchParams.toString());
  console.log("create param:", searchParams.get("create"));
  console.log("isOpen:", isOpen);

  const handleClose = () => {
    router.push("/");
  };

  return <TodoForm mode="create" open={isOpen} onClose={handleClose} />;
}

export default function CreateTodoModal() {
  return (
    <Suspense fallback={null}>
      <CreateModalContent />
    </Suspense>
  );
}
