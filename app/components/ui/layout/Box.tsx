import React, { ElementType } from "react";

export interface BoxProps extends React.HTMLAttributes<HTMLElement> {
  as?: ElementType;
  p?: string | number;
  px?: string | number;
  py?: string | number;
  pt?: string | number;
  pb?: string | number;
  pl?: string | number;
  pr?: string | number;
  m?: string | number;
  mx?: string | number;
  my?: string | number;
  mt?: string | number;
  mb?: string | number;
  ml?: string | number;
  mr?: string | number;
  bg?: string;
  w?: string | number;
  h?: string | number;
  minW?: string | number;
  minH?: string | number;
  maxW?: string | number;
  maxH?: string | number;
  position?: "relative" | "absolute" | "fixed" | "sticky" | "static";
  top?: string | number;
  bottom?: string | number;
  left?: string | number;
  right?: string | number;
  zIndex?: number;
  overflow?: "hidden" | "auto" | "scroll" | "visible";
  border?: string;
  borderBottom?: string;
  borderTop?: string;
  borderLeft?: string;
  borderRight?: string;
  borderRadius?: string | number;
  textAlign?: "left" | "center" | "right" | "justify";
  opacity?: number;
  shadow?: string;
  cursor?: string;
  flex?: string | number;
  shrink?: number;
  grow?: number;
  href?: any;
}

export const Box = React.forwardRef<HTMLElement, BoxProps>(
  ({ as: Component = "div", style, className, p, px, py, pt, pb, pl, pr, m, mx, my, mt, mb, ml, mr, bg, w, h, minW, minH, maxW, maxH, position, top, bottom, left, right, zIndex, overflow, border, borderBottom, borderTop, borderLeft, borderRight, borderRadius, textAlign, opacity, shadow, cursor, flex, shrink, grow, href, ...props }, ref) => {
    const combinedStyle: React.CSSProperties = {
      ...style,
      padding: p, paddingLeft: pl || px, paddingRight: pr || px, paddingTop: pt || py, paddingBottom: pb || py,
      margin: m, marginLeft: ml || mx, marginRight: mr || mx, marginTop: mt || my, marginBottom: mb || my,
      background: bg,
      width: w, height: h, minWidth: minW, minHeight: minH, maxWidth: maxW, maxHeight: maxH,
      position, top, bottom, left, right, zIndex, overflow,
      border, borderBottom, borderTop, borderLeft, borderRight, borderRadius,
      textAlign, opacity, boxShadow: shadow, cursor,
      flex, flexShrink: shrink, flexGrow: grow
    };

    const cleanedStyle = Object.fromEntries(
      Object.entries(combinedStyle).filter(([_, v]) => v !== undefined)
    ) as React.CSSProperties;

    return (
      <Component ref={ref} style={cleanedStyle} className={className} {...props} />
    );
  }
);
Box.displayName = "Box";
