"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMemo } from "react";

const BottomNav = () => {
  const pathname = usePathname();

  const getItemClassNames = (href: string) => {
    if (pathname === href) {
      return "dock-active";
    }
    return "";
  };

  const items = useMemo(() => {
    return [
      {
        label: "Trips",
        icon: "timeline",
        href: "/",
        className: getItemClassNames("/"),
      },
      {
        label: "Visas",
        icon: "passport",
        href: "/visas",
        className: getItemClassNames("/visas"),
      },
    ];
  }, [pathname]);

  return (
    <div className="dock z-11 md:hidden">
      {items.map((item) => (
        <Link key={item.href} href={item.href} className={item.className}>
          <span className="material-symbols-outlined">{item.icon}</span>
          <span className="dock-label">{item.label}</span>
        </Link>
      ))}
    </div>
  );
};

export default BottomNav;
