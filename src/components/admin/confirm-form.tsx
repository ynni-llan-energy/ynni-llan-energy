"use client";

import { useRef } from "react";

export function ConfirmForm({
  action,
  confirmMessage,
  children,
}: {
  action: (formData: FormData) => Promise<void>;
  confirmMessage: string;
  children: React.ReactNode;
}) {
  const formRef = useRef<HTMLFormElement>(null);

  return (
    <form
      ref={formRef}
      action={action}
      onSubmit={(e) => {
        if (!confirm(confirmMessage)) {
          e.preventDefault();
        }
      }}
    >
      {children}
    </form>
  );
}
