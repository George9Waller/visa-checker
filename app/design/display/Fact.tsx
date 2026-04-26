import { ReactNode } from "react";
import { Kicker } from "../primitives/Kicker";

export interface FactProps {
  label: string;
  value: ReactNode;
}

export function Fact({ label, value }: FactProps) {
  return (
    <div>
      <Kicker>{label}</Kicker>
      <div className="mt-1 text-md text-fg font-semibold">{value}</div>
    </div>
  );
}
