import type { ReactNode } from "react";
import "./Stamp.css";

export type StampTone = "leaf" | "papaya" | "stamp" | "forest";

interface SealStampProps {
  variant: "seal";
  top: string;
  label: string;
  bottom: string;
  tone?: StampTone;
  tilt?: number;
  className?: string;
}

interface TagStampProps {
  variant?: "tag";
  tone?: StampTone;
  children: ReactNode;
  className?: string;
}

type StampProps = SealStampProps | TagStampProps;

/**
 * Carimbo — elemento de assinatura da marca "Feira Livre".
 * variant="seal": selo circular (momentos de destaque, ex. hero).
 * variant="tag": etiqueta retangular (status, categoria, badges).
 */
export function Stamp(props: StampProps) {
  const tone = props.tone ?? "leaf";

  if (props.variant === "seal") {
    const { top, label, bottom, tilt = -8, className = "" } = props;
    return (
      <div
        className={`stamp stamp-seal stamp-tone-${tone} ${className}`}
        style={{ transform: `rotate(${tilt}deg)` }}
        aria-hidden="true"
      >
        <span className="stamp-seal-top">{top}</span>
        <span className="stamp-seal-label">{label}</span>
        <span className="stamp-seal-bottom">{bottom}</span>
      </div>
    );
  }

  const { children, className = "" } = props;
  return (
    <span className={`stamp stamp-tag stamp-tone-${tone} ${className}`}>
      {children}
    </span>
  );
}
