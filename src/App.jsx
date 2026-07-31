import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { ContentProvider } from "./context/ContentContext";
import Header from "./components/Header";
import Footer from "./components/Footer";
import BottomNav from "./components/BottomNav";
import { Spinner } from "./components/Spinner";

// تحميل الصفحات عند الحاجة (Lazy) لتقليل الحزمة الأولى
const Home = lazy(() => import("./pages/Home"));
const Lesson = lazy(() => import("./pages/Lesson"));
const Certificate = lazy(() => import("./pages/Certificate"));
const About = lazy(() => import("./pages/About"));
const References = lazy(() => import("./pages/References"));
const Admin = lazy(() => import("./pages/admin/Admin"));

function Shell() {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith("/admin");

  if (isAdmin) {
    return (
      <Suspense fallback={<Spinner />}>
        <Routes><Route path="/admin" element={<Admin />} /></Routes>
      </Suspense>
    );
  }

  return (
    <div dir="rtl" lang="ar" className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 pb-20 sm:pb-0">
        <Suspense fallback={<Spinner />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/lesson/:id" element={<Lesson />} />
            <Route path="/certificate" element={<Certificate />} />
            <Route path="/about" element={<About />} />
            <Route path="/references" element={<References />} />
          </Routes>
        </Suspense>
      </main>
      <Footer />
      <BottomNav />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ContentProvider>
          <Shell />
        </ContentProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
