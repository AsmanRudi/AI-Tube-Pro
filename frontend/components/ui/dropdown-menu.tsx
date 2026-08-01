"use client";

import { ReactNode, useEffect, useRef, useState } from "react";
import { MoreVertical } from "lucide-react";

interface DropdownMenuProps {
  trigger?: ReactNode;
  children: ReactNode | ((onClose: () => void) => ReactNode);
  align?: "left" | "right";
}

export function DropdownMenu({
  trigger,
  children,
  align = "right",
}: DropdownMenuProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((v) => !v)}
        className="rounded-md p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800"
      >
        {trigger ?? <MoreVertical size={16} />}
      </button>

      {open && (
        <div
          className={`absolute z-20 mt-1 min-w-[160px] rounded-lg border bg-white py-1 shadow-lg dark:border-gray-700 dark:bg-gray-900 ${
            align === "right" ? "right-0" : "left-0"
          }`}
        >
          {typeof children === "function" ? children(() => setOpen(false)) : children}
        </div>
      )}
    </div>
  );
}

export function DropdownMenuItem({
  children,
  onClick,
  className,
}: {
  children: ReactNode;
  onClick?: () => void;
  className?: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`block w-full px-4 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-800 ${className ?? ""}`}
    >
      {children}
    </button>
  );
}

