import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import MarketingLayout from "./layouts/MarketingLayout";
import AppLayout from "./layouts/AppLayout";

import Index from "./pages/Index";
import Product from "./pages/Product";
import Pricing from "./pages/Pricing";
import Security from "./pages/Security";

import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";
import Terms from "./pages/Terms";
import Privacy from "./pages/Privacy";
import Contact from "./pages/Contact";
import Disclaimer from "./pages/Disclaimer";
import Subprocessors from "./pages/Subprocessors";
import DataRetention from "./pages/DataRetention";
import AcceptableUse from "./pages/AcceptableUse";
import Cookies from "./pages/Cookies";
import Refunds from "./pages/Refunds";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";

import Chat from "./pages/app/Chat";
import Documents from "./pages/app/Documents";
import DocumentDetail from "./pages/app/DocumentDetail";
import EditSuggestions from "./pages/app/EditSuggestions";
import Settings from "./pages/app/Settings";
import Billing from "./pages/app/Billing";
import Upgrade from "./pages/app/Upgrade";

import NotFound from "./pages/NotFound";

import { AuthProvider } from "./contexts/AuthContext";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Marketing pages */}
            <Route element={<MarketingLayout />}>
              <Route path="/" element={<Index />} />
              <Route path="/product" element={<Product />} />
              <Route path="/pricing" element={<Pricing />} />
              <Route path="/security" element={<Security />} />

              <Route path="/blog" element={<Blog />} />
              <Route path="/blog/:slug" element={<BlogPost />} />
              <Route path="/terms" element={<Terms />} />
              <Route path="/privacy" element={<Privacy />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/disclaimer" element={<Disclaimer />} />
              <Route path="/subprocessors" element={<Subprocessors />} />
              <Route path="/data-retention" element={<DataRetention />} />
              <Route path="/acceptable-use" element={<AcceptableUse />} />
              <Route path="/cookies" element={<Cookies />} />
              <Route path="/refunds" element={<Refunds />} />
              <Route path="/billing-policy" element={<Navigate to="/refunds" replace />} />
            </Route>

            {/* Auth (no layout wrapper) */}
            <Route path="/signin" element={<SignIn />} />
            <Route path="/signup" element={<SignUp />} />

            {/* Dashboard redirects */}
            <Route path="/dashboard" element={<Navigate to="/app/chat" replace />} />
            <Route path="/dashboard/*" element={<Navigate to="/app/chat" replace />} />

            {/* App pages */}
            <Route path="/app" element={<AppLayout />}>
              <Route index element={<Navigate to="/app/chat" replace />} />
              <Route path="chat" element={<Chat />} />
              <Route path="documents" element={<Documents />} />
              <Route path="documents/:id" element={<DocumentDetail />} />
              <Route path="documents/:id/edit-suggestions" element={<EditSuggestions />} />
              <Route path="settings" element={<Settings />} />
              <Route path="billing" element={<Billing />} />
              <Route path="upgrade" element={<Upgrade />} />
            </Route>

            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
