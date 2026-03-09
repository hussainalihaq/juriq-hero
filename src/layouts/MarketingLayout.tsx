import { Outlet } from "react-router-dom";
import { Navbar } from "@/components/marketing/Navbar";
import { Footer } from "@/components/marketing/Footer";
import { CookieConsent } from "@/components/marketing/CookieConsent";
import { LeadCaptureModal } from "@/components/marketing/LeadCaptureModal";

export default function MarketingLayout() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <CookieConsent />
      <LeadCaptureModal />
    </div>
  );
}
