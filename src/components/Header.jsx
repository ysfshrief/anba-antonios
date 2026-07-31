import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { User, LogOut } from "lucide-react";

export default function Header() {
  const { user, login, logout } = useAuth();
  const [name, setName] = useState("");
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-gold/20 bg-cream/85 backdrop-blur-md">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
        <Link to="/" className="flex items-center gap-2.5">
          <img src="/assets/church-logo.png" alt="" className="h-9 w-9 object-contain" />
          <span className="hidden font-display text-lg font-bold text-ink sm:block">
            الأنبا أنطونيوس
          </span>
        </Link>

        {user ? (
          <div className="flex items-center gap-3">
            <span className="font-body text-sm text-desert">
              أهلًا، <span className="font-bold">{user.name}</span>
            </span>
            <button onClick={logout} aria-label="تسجيل الخروج"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-gold/40 bg-parchment text-burgundy transition-colors hover:bg-sand">
              <LogOut size={16} />
            </button>
          </div>
        ) : open ? (
          <div className="flex items-center gap-2">
            <input
              autoFocus value={name} onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && login(name) && setOpen(false)}
              placeholder="اكتب اسمك"
              className="w-32 rounded-full border border-gold/40 bg-parchment px-4 py-1.5 text-right font-body text-sm outline-none focus:border-gold sm:w-40"
            />
            <button onClick={() => login(name) && setOpen(false)}
              className="rounded-full bg-burgundy px-4 py-1.5 font-body text-sm font-medium text-parchment hover:bg-[#571822]">
              دخول
            </button>
          </div>
        ) : (
          <button onClick={() => setOpen(true)}
            className="flex items-center gap-2 rounded-full border border-gold/40 bg-parchment px-4 py-1.5 font-body text-sm font-medium text-desert transition-colors hover:bg-sand">
            <User size={16} /> تسجيل الدخول
          </button>
        )}
      </div>
    </header>
  );
}
