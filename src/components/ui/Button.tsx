"use client";

import Link from "next/link";

interface ButtonProps {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "ghost" | "outline";
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  href?: string;
  className?: string;
  fullWidth?: boolean;
  disabled?: boolean;
  style?: React.CSSProperties;
}

export default function Button({
  children,
  variant = "primary",
  onClick,
  href,
  className = "",
  fullWidth = false,
  disabled = false,
  style,
}: ButtonProps) {
  const classes = `btn btn--${variant} ${fullWidth ? "w-full" : ""} ${className}`;

  if (href) {
    return (
      <Link href={href} className={classes} style={style}>
        {children}
      </Link>
    );
  }

  return (
    <button className={classes} onClick={onClick} disabled={disabled} style={style}>
      {children}
    </button>
  );
}