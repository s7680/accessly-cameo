import React from "react";

interface SectionWrapperProps {
  id?: string;
  title?: React.ReactNode;
  subtitle?: string;
  eyebrow?: string;
  children: React.ReactNode;
  className?: string;
  titleAlign?: "left" | "center";
  action?: React.ReactNode;
}

export default function SectionWrapper({
  id,
  title,
  subtitle,
  eyebrow,
  children,
  className = "",
  titleAlign = "center",
  action,
}: SectionWrapperProps) {
  const alignClass = titleAlign === "left" ? "text-left" : "text-center mx-auto";

  return (
    <section id={id} className={`section-block ${className}`}>
      <div className="container">
        {(eyebrow || title || subtitle || action) && (
          <div className={`section-header ${alignClass}`}>
            {eyebrow && <p className="section-eyebrow">{eyebrow}</p>}
            {title && <h2 className="section-title">{title}</h2>}
            {subtitle && <p className="section-subtitle">{subtitle}</p>}
            {action && <div className="section-action">{action}</div>}
          </div>
        )}
        {children}
      </div>
    </section>
  );
}