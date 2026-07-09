import { AppProvider } from "./context/AppContext";
import { useHash } from "./hooks/useHash";
import Header from "./components/Header";
import Hero from "./components/Hero";
import BreakingTicker from "./components/BreakingTicker";
import NewsSection from "./components/NewsSection";
import Gallery from "./components/Gallery";
import ClubSection from "./components/ClubSection";
import Footer from "./components/Footer";
import LoginModal from "./components/LoginModal";
import NewsPage from "./components/NewsPage";
import AdminLogin from "./components/AdminLogin";
import AdminPanel from "./components/AdminPanel";
import ArchivePage from "./components/ArchivePage";
import { useApp } from "./context/AppContext";
import { useEffect } from "react";
import { Analytics } from "@vercel/analytics/react";

/* ─── Scroll-to-hash helper: whenever the hash changes to an in-page anchor, scroll to it ─── */
function useHashScroll() {
  const hash = useHash();
  useEffect(() => {
    // Scroll to top for full-page routes
    if (
      hash.startsWith("#admin") ||
      hash.startsWith("#news/") ||
      hash.startsWith("#archive")
    ) {
      window.scrollTo({ top: 0, behavior: "auto" });
      return;
    }

    // In-page anchor scroll (e.g. #media, #club, #news, #about)
    const id = hash.replace(/^#/, "").split("/")[0].split("?")[0];
    if (!id || id === "home") {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    const el = document.getElementById(id);
    if (el) {
      // Delay so DOM has time to render
      setTimeout(() => {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 50);
    }
  }, [hash]);
}

function Router() {
  const hash = useHash();
  const { adminAuth, setAdminAuth } = useApp();
  useHashScroll();

  if (hash.startsWith("#admin")) {
    if (!adminAuth) return <AdminLogin onSuccess={() => setAdminAuth(true)} />;
    return <AdminPanel onLogout={() => setAdminAuth(false)} />;
  }

  if (hash.startsWith("#news/")) {
    const id = hash.replace("#news/", "");
    return <NewsPage newsId={id} />;
  }

  if (hash.startsWith("#archive")) {
    // #archive → all; #archive/culture → filter culture
    const parts = hash.replace("#archive", "").replace(/^\//, "");
    const category = parts && parts !== "all" ? parts : undefined;
    return <ArchivePage initialCategory={category} />;
  }

  return (
    <>
      <Hero />
      <BreakingTicker />
      <NewsSection />
      <Gallery />
      <ClubSection />
      <Footer />
    </>
  );
}

function AdminShortcut() {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === "a") {
        e.preventDefault();
        window.location.hash = "#admin";
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);
  return null;
}

export default function App() {
  const hash = useHash();
  // Show footer on archive page too (footer is not part of ArchivePage itself)
  const showFooter = hash.startsWith("#archive") || hash.startsWith("#news/");

  return (
    <AppProvider>
      <div className="min-h-screen bg-navy-950 text-white no-scroll-x">
        <AdminShortcut />
        <Header />
        <main>
          <Router />
          {showFooter && <Footer />}
        </main>
        <LoginModal />
        <Analytics />
      </div>
    </AppProvider>
  );
}
