import { useState, useEffect } from "react";
import { X, Cookie } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export function CookieConsent() {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        // Check if user has already consented
        const consent = localStorage.getItem("juriq-cookie-consent");
        if (!consent) {
            // Delay slightly so it doesn't jarringly appear before paint
            const timer = setTimeout(() => {
                setIsVisible(true);
            }, 1500);
            return () => clearTimeout(timer);
        }
    }, []);

    const handleAccept = () => {
        localStorage.setItem("juriq-cookie-consent", "true");
        setIsVisible(false);
    };

    const handleDecline = () => {
        // Just hide it for this page load, but we want it to show up on fresh visits if unsupported
        setIsVisible(false);
    };

    if (!isVisible) return null;

    return (
        <div className="fixed bottom-0 left-0 right-0 z-[100] border-t border-border/50 bg-background/95 p-4 shadow-lg backdrop-blur-xl sm:p-6 animate-fade-in">
            <div className="mx-auto flex max-w-7xl flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-start gap-3 sm:items-center">
                    <div className="rounded-full bg-primary/10 p-2 text-primary hidden sm:block">
                        <Cookie className="h-5 w-5" />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-foreground">
                            We value your privacy
                        </p>
                        <p className="text-xs text-muted-foreground mt-1 max-w-3xl">
                            We use cookies to enhance your browsing experience, analyze site
                            traffic, and serve personalized content. By clicking "Accept All",
                            you consent to our use of cookies as described in our{" "}
                            <Link to="/privacy" className="underline hover:text-foreground">
                                Privacy Policy
                            </Link>
                            .
                        </p>
                    </div>
                </div>
                <div className="flex w-full flex-row items-center gap-2 sm:w-auto">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleDecline}
                        className="flex-1 sm:flex-none"
                    >
                        Decline
                    </Button>
                    <Button
                        variant="default"
                        size="sm"
                        onClick={handleAccept}
                        className="flex-1 sm:flex-none whitespace-nowrap"
                    >
                        Accept All
                    </Button>
                    <button
                        onClick={handleDecline}
                        className="ml-2 rounded-full p-1.5 text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
                        aria-label="Close"
                    >
                        <X className="h-4 w-4" />
                    </button>
                </div>
            </div>
        </div>
    );
}
