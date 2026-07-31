import { Link, useLocation } from "react-router-dom";
import { Home, Users, Library, Award } from "lucide-react";

const ITEMS = [
  { to: "/", label: "الرحلة", icon: Home },
  { to: "/about", label: "من نحن", icon: Users },
  { to: "/references", label: "المراجع", icon: Library },
  { to: "/certificate", label: "الشهادة", icon: Award },
];

export default function BottomNav() {
  const { pathname } = useLocation();
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-gold/20 bg-cream/95 backdrop-blur sm:hidden">
      <div className="flex items-center justify-around">
        {ITEMS.map((it) => {
          const active = pathname === it.to;
          return (
            <Link key={it.to} to={it.to}
              className={`flex flex-1 flex-col items-center gap-0.5 py-2.5 font-body text-[11px] transition-colors
                ${active ? "text-burgundy" : "text-stone"}`}>
              <it.icon size={20} />
              {it.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
