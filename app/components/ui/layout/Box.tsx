import React, { ElementType } from "react";

export type Spacing = "none" | "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "section";

export interface BoxProps extends Omit<React.AllHTMLAttributes<any>, "as"> {
  as?: ElementType;
  variant?: "base" | "sunken" | "card" | "ghost" | "page-container";
  p?: Spacing;
  px?: Spacing;
  py?: Spacing;
  pt?: Spacing;
  pb?: Spacing;
  pl?: Spacing;
  pr?: Spacing;
  mt?: Spacing;
  mb?: Spacing;
  ml?: Spacing;
  mr?: Spacing;
  width?: "full" | "auto" | "screen";
  minW?: number | string;
  textAlign?: "left" | "center" | "right";
  overflow?: "auto" | "hidden" | "visible" | "scroll";
  position?: "relative" | "absolute" | "fixed" | "sticky";
}

const SPACING_MAP: Record<Spacing, string> = {
  none: "0",
  xs: "4px",
  sm: "8px",
  md: "16px",
  lg: "24px",
  xl: "32px",
  "2xl": "48px",
  section: "80px",
};

export const Box = React.forwardRef<any, BoxProps>(
  ({ as: Component = "div", variant = "base", p, px, py, pt, pb, pl, pr, mt, mb, ml, mr, width, minW, textAlign, overflow, position, style, className, href, ...props }, ref) => {
    let variantStyle: React.CSSProperties = {};
    
    if (variant === "sunken") {
      variantStyle = { background: "var(--bg-sunken)", borderRadius: "var(--r)" };
    } else if (variant === "card") {
      variantStyle = { 
        background: "var(--fg)", 
        color: "var(--bg)", 
        borderRadius: "var(--r)",
      };
    } else if (variant === "ghost") {
      variantStyle = { background: "transparent" };
    } else if (variant === "page-container") {
      variantStyle = { maxWidth: "42rem", margin: "0 auto", width: "100%", paddingBottom: "8rem" };
    }

    const spacingStyle: React.CSSProperties = {};
    if (p) spacingStyle.padding = SPACING_MAP[p];
    if (px) { spacingStyle.paddingLeft = SPACING_MAP[px]; spacingStyle.paddingRight = SPACING_MAP[px]; }
    if (py) { spacingStyle.paddingTop = SPACING_MAP[py]; spacingStyle.paddingBottom = SPACING_MAP[py]; }
    if (pt) spacingStyle.paddingTop = SPACING_MAP[pt];
    if (pb) spacingStyle.paddingBottom = SPACING_MAP[pb];
    if (pl) spacingStyle.paddingLeft = SPACING_MAP[pl];
    if (pr) spacingStyle.paddingRight = SPACING_MAP[pr];
    if (mt) spacingStyle.marginTop = SPACING_MAP[mt];
    if (mb) spacingStyle.marginBottom = SPACING_MAP[mb];
    if (ml) spacingStyle.marginLeft = SPACING_MAP[ml];
    if (mr) spacingStyle.marginRight = SPACING_MAP[mr];

    const layoutStyle: React.CSSProperties = {};
    if (width === "full") layoutStyle.width = "100%";
    if (width === "auto") layoutStyle.width = "auto";
    if (width === "screen") layoutStyle.width = "100vw";
    if (minW !== undefined) layoutStyle.minWidth = minW;
    if (textAlign) layoutStyle.textAlign = textAlign;
    if (overflow) layoutStyle.overflow = overflow;
    if (position) layoutStyle.position = position;

    const combinedStyle: React.CSSProperties = {
      ...variantStyle,
      ...spacingStyle,
      ...layoutStyle,
      ...style,
    };

    return (
      <Component ref={ref} style={combinedStyle} className={className} {...props} />
    );
  }
);
Box.displayName = "Box";
