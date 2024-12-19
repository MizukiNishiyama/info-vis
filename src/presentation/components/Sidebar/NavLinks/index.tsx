"use client";

import clsx from "clsx";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { BiNetworkChart } from "react-icons/bi";
import { CiViewTimeline } from "react-icons/ci";
import { LuMicVocal } from "react-icons/lu";
import { MdOutlineCompareArrows } from "react-icons/md";

export const NavLinks: React.FC = () => {
  const pathname = usePathname();

  const links = [
    { name: "NETWORK", href: "/network", icon: BiNetworkChart, iconColor: "text-purple-400" },
    { name: "ARTIST", href: "/artists", icon: LuMicVocal, iconColor: "text-rose-400" },
    { name: "TIMELINE", href: "/timeline", icon: CiViewTimeline, iconColor: "text-indigo-400" },
    { name: "COMPARE", href: "/compare", icon: MdOutlineCompareArrows, iconColor: "text-sky-600" },
  ];

  return (
    <nav className="flex flex-col space-y-1 w-[220px]">
      {links.map((link) => {
        const LinkIcon = link.icon;

        return (
          <Link
            href={link.href}
            className="flex items-center py-2 pl-4 rounded-md group"
            key={link.name}
          >
            <div className="p-1 mr-4 border rounded-xl group-hover:shadow-md">
              <LinkIcon className={`text-xl ${link.iconColor}`} />
            </div>
            <div
              className={clsx("font-semibold text-sm group-hover:text-sky-400", {
                "text-sky-400": pathname === link.href,
              })}
            >
              {link.name}
            </div>
          </Link>
        );
      })}
    </nav>
  );
};
