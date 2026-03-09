import React, { useState } from 'react';
import { toPng } from 'html-to-image';
import { Sparkles, FileText, AlertTriangle, MessageSquare, CheckCircle, ArrowRight, Shield } from 'lucide-react';

export default function LaunchAssets() {
    const [generating, setGenerating] = useState(false);
    const [images, setImages] = useState<string[]>([]);

    const generateImages = async () => {
        setGenerating(true);
        const slides = [
            { id: 'slide-hero' },
            { id: 'carousel-1' },
            { id: 'carousel-2' },
            { id: 'carousel-3' },
            { id: 'carousel-4' }
        ];

        const generatedPaths: string[] = [];

        for (const slide of slides) {
            const el = document.getElementById(slide.id);
            if (el) {
                try {
                    // Temporarily remove borders or conflicting styles
                    const originalBorder = el.style.border;
                    el.style.border = 'none';

                    const dataUrl = await toPng(el, {
                        quality: 1,
                        pixelRatio: 2,
                        width: 1080,
                        height: 1350,
                        style: { margin: '0' },
                        cacheBust: true,
                        skipFonts: false
                    });

                    el.style.border = originalBorder;
                    generatedPaths.push(dataUrl);

                    // Pause between renders
                    await new Promise(r => setTimeout(r, 600));
                } catch (err) {
                    console.error('Failed to render', slide.id, err);
                }
            }
        }
        setImages(generatedPaths);
        setGenerating(false);
    };

    const slideBaseStyle = "relative w-[1080px] h-[1350px] bg-background text-foreground overflow-hidden shrink-0 shadow-2xl border border-border";
    // html-to-image struggles with CSS blur filters, causing overlapping solid blocks. Using CSS radial gradients instead.
    const GlowTopLeft = () => <div className="absolute -top-[400px] -left-[400px] w-[900px] h-[900px] pointer-events-none rounded-full" style={{ background: 'radial-gradient(circle, rgba(59,130,246,0.15) 0%, rgba(59,130,246,0) 65%)' }} />;
    const GlowBottomRight = () => <div className="absolute -bottom-[400px] -right-[400px] w-[900px] h-[900px] pointer-events-none rounded-full" style={{ background: 'radial-gradient(circle, rgba(79,70,229,0.15) 0%, rgba(79,70,229,0) 65%)' }} />;

    const Logo = () => (
        <div className="absolute top-20 left-20 flex items-center gap-4 z-10">
            <img src="/juriq-logo.svg" alt="Juriq Logo" className="w-16 h-16" />
            <span className="font-display font-bold text-5xl tracking-tight text-foreground">Juriq</span>
        </div>
    );

    const WaitlistPill = () => (
        <div className="absolute top-20 right-20 flex items-center gap-3 bg-secondary border border-border/50 px-6 py-3 rounded-full z-10">
            <Sparkles className="w-5 h-5 text-primary" />
            <span className="font-sans font-medium text-xl text-foreground">juriq.app/waitlist</span>
        </div>
    );

    return (
        <div className="min-h-screen bg-neutral-900 py-12 flex flex-col items-center">

            {/* Download Header UI */}
            <div className="mb-12 flex items-center justify-between bg-black/60 p-6 rounded-xl border border-white/10 w-[1080px] shadow-2xl backdrop-blur-lg sticky top-8 z-50">
                <div>
                    <h1 className="text-2xl font-bold text-white font-display">LinkedIn Launch Assets</h1>
                    <p className="text-neutral-400 mt-1">
                        {images.length > 0
                            ? "Right-click the images below and select 'Save Image As...' to download."
                            : "Click Generate to convert these layouts into downloadable images."}
                    </p>
                </div>
                {!images.length ? (
                    <button
                        onClick={generateImages}
                        disabled={generating}
                        className="bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-3 rounded-lg font-semibold flex items-center gap-2 transition"
                    >
                        {generating ? 'Generating High-Res Images...' : 'Generate Images'}
                    </button>
                ) : (
                    <button
                        onClick={() => setImages([])}
                        className="bg-secondary hover:bg-secondary/80 text-foreground px-6 py-3 rounded-lg font-semibold flex items-center gap-2 transition border border-border/50"
                    >
                        Reset to HTML Mode
                    </button>
                )}
            </div>

            {images.length > 0 ? (
                /* --- RENDERED IMAGES VIEW --- */
                <div className="flex flex-col gap-24 items-center">
                    {images.map((src, idx) => (
                        <div key={idx} className="relative group cursor-pointer w-[1080px]">
                            <img src={src} alt={`Generated Slide ${idx}`} className="w-full rounded-none shadow-2xl border border-border" />
                            <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition duration-300 flex flex-col items-center justify-center pointer-events-none backdrop-blur-[2px]">
                                <span className="bg-background text-foreground font-bold text-2xl px-6 py-3 rounded-xl shadow-2xl border border-border">
                                    Right-Click → Save Image As...
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                /* --- HTML SLIDES VIEW --- */
                <div className="flex flex-col gap-24 items-center relative">

                    {/* --- SINGLE IMAGE HERO --- */}
                    <div id="slide-hero" className={`${slideBaseStyle} flex flex-col justify-end`}>
                        <GlowTopLeft />
                        <GlowBottomRight />
                        <Logo />

                        <div className="absolute top-48 left-20 right-20 z-10">
                            <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-5 py-2 mb-8 shadow-inner shadow-primary/5">
                                <Sparkles className="h-6 w-6 text-primary" />
                                <span className="text-primary font-medium text-2xl tracking-wide uppercase">Juriq goes live next week</span>
                            </div>
                            <h1 className="font-display font-bold text-[84px] leading-[1.05] tracking-tight mb-12 max-w-4xl text-foreground">
                                AI legal copilot for founders, students, and lawyers.
                            </h1>

                            <div className="flex flex-col gap-8 mb-16 text-3xl text-muted-foreground font-sans">
                                <div className="flex items-center gap-5"><CheckCircle className="text-primary w-10 h-10" /> Understand contracts in plain English</div>
                                <div className="flex items-center gap-5"><CheckCircle className="text-primary w-10 h-10" /> Spot risks and red flags instantly</div>
                                <div className="flex items-center gap-5"><CheckCircle className="text-primary w-10 h-10" /> Ask questions directly to your documents</div>
                            </div>
                        </div>

                        {/* Minimal UI Mockup Peeking from bottom */}
                        <div className="relative z-20 mx-auto w-[920px] h-[480px] bg-card rounded-t-3xl border-t border-l border-r border-border shadow-[0_-20px_80px_rgba(0,0,0,0.5)] overflow-hidden">
                            {/* Window controls */}
                            <div className="h-14 border-b border-border/50 bg-muted/30 flex items-center px-6 gap-3">
                                <div className="w-4 h-4 rounded-full bg-destructive/80 shadow-sm"></div>
                                <div className="w-4 h-4 rounded-full bg-warning/80 shadow-sm"></div>
                                <div className="w-4 h-4 rounded-full bg-success/80 shadow-sm"></div>
                            </div>
                            <div className="p-10 flex gap-8">
                                <div className="w-1/3 bg-background rounded-2xl border border-border/50 p-7 space-y-5">
                                    <div className="h-6 w-3/4 bg-border rounded"></div>
                                    <div className="h-4 w-full bg-muted rounded"></div>
                                    <div className="h-4 w-5/6 bg-muted rounded"></div>
                                    <div className="h-4 w-full bg-muted rounded"></div>
                                </div>
                                <div className="flex-1 rounded-2xl border border-destructive/20 bg-destructive/5 p-8 flex gap-6">
                                    <AlertTriangle className="text-destructive w-10 h-10 shrink-0 mt-1" />
                                    <div>
                                        <h4 className="text-destructive font-bold text-2xl mb-3">Unlimited Liability Clause Detected</h4>
                                        <p className="text-foreground/80 text-lg leading-relaxed">This Master Service Agreement exposes your company to uncapped liability in section 4.2. Recommended edit: Cap damages at 12 months of fees.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>


                    {/* --- CAROUSEL SLIDE 1 --- */}
                    <div id="carousel-1" className={`${slideBaseStyle} items-center justify-center text-center p-20 flex flex-col`}>
                        <GlowTopLeft />
                        <GlowBottomRight />
                        <Logo />
                        <WaitlistPill />

                        <div className="z-10 flex flex-col items-center">
                            <h1 className="font-display font-bold text-[100px] leading-[1.1] tracking-tight mb-10 max-w-[900px] text-foreground">
                                Legal should not feel <span className="text-primary italic">confusing</span> by default.
                            </h1>
                            <p className="text-4xl text-muted-foreground font-sans mt-4">
                                Juriq goes live next week.
                            </p>
                        </div>
                    </div>


                    {/* --- CAROUSEL SLIDE 2 --- */}
                    <div id="carousel-2" className={`${slideBaseStyle} items-start justify-center p-24 flex flex-col`}>
                        <GlowTopLeft />
                        <GlowBottomRight />
                        <Logo />

                        <div className="z-10 mt-10">
                            <h1 className="font-display font-bold text-[90px] leading-[1.1] tracking-tight mb-12 max-w-[900px] text-foreground">
                                Built for <span className="italic text-primary">founders,</span> <br />students, and lawyers.
                            </h1>
                            <p className="text-4xl text-muted-foreground font-sans leading-relaxed max-w-[800px]">
                                An AI legal copilot for faster, clearer legal understanding without the heavy retainer.
                            </p>
                        </div>
                    </div>


                    {/* --- CAROUSEL SLIDE 3 --- */}
                    <div id="carousel-3" className={`${slideBaseStyle} items-start justify-center p-24 flex flex-col`}>
                        <GlowTopLeft />
                        <GlowBottomRight />
                        <Logo />

                        <div className="z-10 mt-10 w-full">
                            <h2 className="font-display font-bold text-[72px] mb-20 text-foreground">
                                What Juriq helps you do:
                            </h2>

                            <div className="flex flex-col gap-12 text-3xl text-foreground font-sans">
                                <div className="flex block items-start gap-8 bg-card border border-border p-8 rounded-2xl w-full">
                                    <FileText className="text-primary w-12 h-12 shrink-0 mt-1" />
                                    <span className="leading-snug">Understand dense, complex contracts in <span className="font-bold text-primary">plain English</span>.</span>
                                </div>
                                <div className="flex items-start gap-8 bg-card border border-border p-8 rounded-2xl w-full text-foreground/90">
                                    <AlertTriangle className="text-destructive w-12 h-12 shrink-0 mt-1" />
                                    <span className="leading-snug">Identify hidden <span className="font-bold text-destructive">risks and red flags</span> before you sign.</span>
                                </div>
                                <div className="flex items-start gap-8 bg-card border border-border p-8 rounded-2xl w-full">
                                    <Shield className="text-success w-12 h-12 shrink-0 mt-1" />
                                    <span className="leading-snug">Extract key <span className="font-bold">clauses and obligations</span> instantly.</span>
                                </div>
                                <div className="flex items-start gap-8 bg-card border border-border p-8 rounded-2xl w-full">
                                    <MessageSquare className="text-primary w-12 h-12 shrink-0 mt-1" />
                                    <span className="leading-snug">Ask <span className="font-bold">contextual questions</span> about your specific legal documents.</span>
                                </div>
                            </div>
                        </div>
                    </div>


                    {/* --- CAROUSEL SLIDE 4 --- */}
                    <div id="carousel-4" className={`${slideBaseStyle} flex flex-col justify-end`}>
                        <GlowTopLeft />
                        <GlowBottomRight />
                        <Logo />

                        <div className="absolute top-48 left-20 right-20 z-10 text-center flex flex-col items-center">
                            <h1 className="font-display font-bold text-[90px] leading-[1.05] tracking-tight mb-8 text-foreground">
                                Launching next week.
                            </h1>
                            <div className="inline-flex items-center gap-4 bg-primary text-primary-foreground px-8 py-5 rounded-full mt-6 shadow-2xl shadow-primary/30">
                                <span className="font-sans font-bold text-3xl">Join the waitlist: juriq.app/waitlist</span>
                                <ArrowRight className="w-8 h-8" />
                            </div>
                        </div>

                        {/* Huge UI Mockup Peeking from bottom */}
                        <div className="relative z-20 mx-auto w-[960px] h-[600px] bg-card rounded-t-3xl border-t border-l border-r border-border shadow-[0_-20px_100px_rgba(0,0,0,0.5)] overflow-hidden">
                            <div className="h-16 border-b border-border/50 bg-muted/30 flex items-center px-8 gap-3">
                                <div className="w-4 h-4 rounded-full bg-destructive/80"></div>
                                <div className="w-4 h-4 rounded-full bg-warning/80"></div>
                                <div className="w-4 h-4 rounded-full bg-success/80"></div>
                                <div className="ml-6 flex items-center gap-2 text-muted-foreground font-sans text-xl">
                                    <Shield className="w-6 h-6" /> analysis_report.pdf
                                </div>
                            </div>
                            <div className="p-12 flex gap-10 h-full">
                                {/* PDF Viewer Mock */}
                                <div className="flex-1 bg-background rounded-2xl border border-border/50 p-10 space-y-6">
                                    <div className="h-8 w-1/3 bg-border rounded"></div>
                                    <div className="h-4 w-full bg-muted rounded mt-12"></div>
                                    <div className="h-4 w-full bg-muted rounded"></div>
                                    <div className="h-4 w-5/6 bg-muted rounded"></div>
                                    <div className="h-4 w-full bg-muted rounded"></div>
                                    <div className="h-4 w-3/4 bg-muted rounded"></div>
                                    <div className="h-4 w-full bg-muted rounded mt-8"></div>
                                    <div className="h-4 w-4/5 bg-muted rounded"></div>
                                </div>
                                {/* Chat Mock */}
                                <div className="w-1/3 flex flex-col gap-6">
                                    <div className="bg-primary/10 border border-primary/20 p-6 rounded-2xl rounded-tr-sm">
                                        <p className="text-foreground text-xl leading-relaxed font-sans mt-2">Are there any non-compete clauses in this contract?</p>
                                    </div>
                                    <div className="bg-background border border-border pb-6 pt-5 px-6 rounded-2xl rounded-tl-sm shadow-sm">
                                        <div className="flex items-center gap-3 mb-4">
                                            <Sparkles className="w-6 h-6 text-primary" />
                                            <span className="text-foreground font-bold text-xl">Juriq AI</span>
                                        </div>
                                        <p className="text-muted-foreground text-xl leading-relaxed font-sans">Yes. Section 3.2 contains a 24-month non-compete clause spanning the entire United States. This is exceptionally broad and likely unenforceable in California.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
