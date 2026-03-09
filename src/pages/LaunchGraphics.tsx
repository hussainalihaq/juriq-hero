import React from 'react';
import { Badge } from "@/components/ui/badge";
import { Sparkles, FileText, AlertTriangle, MessageSquare, ArrowRight, CheckCircle } from "lucide-react";

function MockupFrame({ children, className = "" }: { children: React.ReactNode, className?: string }) {
    return (
        <div className={`rounded-xl border border-white/10 bg-black/40 shadow-2xl overflow-hidden backdrop-blur-xl ${className}`}>
            <div className="h-10 border-b border-white/10 flex items-center px-4 gap-2 bg-white/5">
                <div className="w-3 h-3 rounded-full bg-red-500/80" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                <div className="w-3 h-3 rounded-full bg-green-500/80" />
            </div>
            {children}
        </div>
    )
}

export default function LaunchGraphics() {
    return (
        <div className="min-h-screen bg-neutral-950 p-10 overflow-auto flex flex-col items-center">
            <div className="max-w-3xl text-center text-white mb-20">
                <h1 className="text-4xl font-display font-bold mb-4">LinkedIn Launch Assets</h1>
                <p className="text-lg text-gray-400 mb-6">
                    Rather than generating blurry AI poster images, I have built your exact designs in code using your brand tokens. This guarantees incredibly crisp text and allows you to edit the copy directly in the source code.
                </p>
                <div className="bg-primary/10 border border-primary/20 rounded-xl p-6 text-left">
                    <h3 className="font-bold text-primary mb-2">How to export:</h3>
                    <ol className="list-decimal pl-5 space-y-2 text-primary/80">
                        <li>Right-click anywhere on the frame you want to export.</li>
                        <li>Select <strong>Inspect</strong> to open Chrome DevTools.</li>
                        <li>Ensure the <code>&lt;div className="post-frame..."&gt;</code> element is selected in the Elements panel.</li>
                        <li>Press <kbd className="bg-black/50 px-2 py-1 rounded">Cmd + Shift + P</kbd> (Mac) or <kbd className="bg-black/50 px-2 py-1 rounded">Ctrl + Shift + P</kbd> (Windows).</li>
                        <li>Type <strong>"Capture node screenshot"</strong> and hit Enter.</li>
                        <li>You will instantly download a perfectly crisp 1080x1350 PNG!</li>
                    </ol>
                </div>
            </div>

            <div className="flex flex-col gap-32 pb-32">

                {/* SINGLE IMAGE POST */}
                <div>
                    <h2 className="text-white text-2xl font-bold mb-6 font-display">1. Single Image Post (1080x1350)</h2>
                    <div className="post-frame relative w-[1080px] h-[1350px] bg-[#0a0a0a] overflow-hidden flex flex-col border border-white/10 shrink-0 shadow-2xl">
                        {/* Glowing orb background */}
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[700px] bg-primary/20 blur-[130px] rounded-full pointer-events-none" />

                        <div className="relative z-10 flex-1 flex flex-col items-center pt-32 px-20">
                            <div className="flex items-center gap-4 mb-16">
                                <img src="/juriq-logo.svg" alt="Juriq" className="w-16 h-16" />
                                <span className="text-4xl font-display font-bold text-white tracking-tight">Juriq</span>
                            </div>

                            <Badge className="bg-primary/10 text-primary border-primary/20 px-8 py-2.5 text-2xl rounded-full mb-10 font-medium">
                                Private Beta
                            </Badge>

                            <h1 className="text-[85px] font-display font-bold text-white leading-[1.05] tracking-tight text-center mb-8">
                                Juriq goes live<br /><span className="text-primary">next week.</span>
                            </h1>

                            <p className="text-3xl text-gray-400 text-center mb-20 max-w-3xl leading-relaxed">
                                AI legal copilot for founders, students, and lawyers.
                            </p>

                            {/* Value Props Grid */}
                            <div className="grid grid-cols-3 gap-8 w-full mb-20">
                                <div className="bg-white/5 border border-white/10 rounded-3xl p-8 flex flex-col items-center text-center backdrop-blur-sm">
                                    <div className="w-20 h-20 bg-blue-500/20 text-blue-400 rounded-2xl flex items-center justify-center mb-6">
                                        <FileText className="w-10 h-10" />
                                    </div>
                                    <p className="text-2xl text-white font-medium leading-snug">Understand<br />contracts clearly</p>
                                </div>
                                <div className="bg-white/5 border border-white/10 rounded-3xl p-8 flex flex-col items-center text-center backdrop-blur-sm">
                                    <div className="w-20 h-20 bg-red-500/20 text-red-400 rounded-2xl flex items-center justify-center mb-6">
                                        <AlertTriangle className="w-10 h-10" />
                                    </div>
                                    <p className="text-2xl text-white font-medium leading-snug">Spot risks and<br />red flags</p>
                                </div>
                                <div className="bg-white/5 border border-white/10 rounded-3xl p-8 flex flex-col items-center text-center backdrop-blur-sm">
                                    <div className="w-20 h-20 bg-green-500/20 text-green-400 rounded-2xl flex items-center justify-center mb-6">
                                        <MessageSquare className="w-10 h-10" />
                                    </div>
                                    <p className="text-2xl text-white font-medium leading-snug">Ask questions<br />instantly</p>
                                </div>
                            </div>
                        </div>

                        <div className="relative z-10 w-full flex justify-center pb-24">
                            <div className="text-3xl font-medium text-white/50 bg-white/5 border border-white/10 px-10 py-5 rounded-full flex items-center gap-4">
                                Join the waitlist <ArrowRight className="w-8 h-8 text-primary" /> <span className="text-white">juriq.app/waitlist</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* CAROUSEL SLIDE 1 */}
                <div>
                    <h2 className="text-white text-2xl font-bold mb-6 font-display">2. Carousel Slide 1</h2>
                    <div className="post-frame relative w-[1080px] h-[1350px] bg-[#0a0a0a] overflow-hidden flex flex-col justify-center items-center shrink-0 border border-white/10 shadow-2xl">
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/15 blur-[150px] rounded-full" />

                        <div className="relative z-10 text-center px-24">
                            <h1 className="text-[100px] font-display font-bold text-white leading-[1.1] tracking-tight mb-16">
                                Legal should not feel <span className="text-primary italic">confusing</span><br />by default.
                            </h1>
                            <p className="text-4xl text-gray-400">
                                Juriq goes live next week.
                            </p>
                        </div>
                    </div>
                </div>

                {/* CAROUSEL SLIDE 2 */}
                <div>
                    <h2 className="text-white text-2xl font-bold mb-6 font-display">3. Carousel Slide 2</h2>
                    <div className="post-frame relative w-[1080px] h-[1350px] bg-[#0a0a0a] overflow-hidden flex flex-col justify-center shrink-0 border border-white/10 px-32 shadow-2xl">
                        <div className="absolute top-0 right-0 w-[900px] h-[900px] bg-primary/10 blur-[150px] rounded-full translate-x-1/3 -translate-y-1/3" />

                        <div className="relative z-10">
                            <Badge className="bg-primary/10 text-primary border-primary/20 px-6 py-2.5 text-2xl rounded-full mb-12 font-medium">
                                Fast & Clear
                            </Badge>
                            <h1 className="text-[90px] font-display font-bold text-white leading-[1.05] tracking-tight mb-12">
                                Built for founders,<br />students, and lawyers.
                            </h1>
                            <p className="text-4xl text-gray-400 max-w-2xl leading-relaxed">
                                An AI legal copilot for faster, clearer legal understanding.
                            </p>
                        </div>
                    </div>
                </div>

                {/* CAROUSEL SLIDE 3 */}
                <div>
                    <h2 className="text-white text-2xl font-bold mb-6 font-display">4. Carousel Slide 3</h2>
                    <div className="post-frame relative w-[1080px] h-[1350px] bg-[#0a0a0a] overflow-hidden flex flex-col justify-center shrink-0 border border-white/10 px-32 shadow-2xl">
                        <div className="absolute bottom-0 left-0 w-[900px] h-[900px] bg-primary/10 blur-[150px] rounded-full -translate-x-1/3 translate-y-1/3" />

                        <div className="relative z-10">
                            <h1 className="text-[80px] font-display font-bold text-primary leading-tight tracking-tight mb-20">
                                What Juriq helps you do
                            </h1>

                            <div className="space-y-14">
                                <div className="flex items-center gap-10">
                                    <div className="w-24 h-24 rounded-3xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                                        <FileText className="w-12 h-12 text-blue-400" />
                                    </div>
                                    <p className="text-4xl text-white font-medium">Understand contracts in plain English</p>
                                </div>
                                <div className="flex items-center gap-10">
                                    <div className="w-24 h-24 rounded-3xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                                        <AlertTriangle className="w-12 h-12 text-red-400" />
                                    </div>
                                    <p className="text-4xl text-white font-medium">Identify risks and red flags</p>
                                </div>
                                <div className="flex items-center gap-10">
                                    <div className="w-24 h-24 rounded-3xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                                        <CheckCircle className="w-12 h-12 text-green-400" />
                                    </div>
                                    <p className="text-4xl text-white font-medium">Extract key clauses and obligations</p>
                                </div>
                                <div className="flex items-center gap-10">
                                    <div className="w-24 h-24 rounded-3xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                                        <MessageSquare className="w-12 h-12 text-purple-400" />
                                    </div>
                                    <p className="text-4xl text-white font-medium">Ask questions about legal docs</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* CAROUSEL SLIDE 4 */}
                <div>
                    <h2 className="text-white text-2xl font-bold mb-6 font-display">5. Carousel Slide 4</h2>
                    <div className="post-frame relative w-[1080px] h-[1350px] bg-[#0a0a0a] overflow-hidden flex flex-col shrink-0 border border-white/10 shadow-2xl">
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1100px] h-[1100px] bg-primary/15 blur-[160px] rounded-full pointer-events-none" />

                        <div className="relative z-10 flex flex-col items-center pt-32 px-20">

                            <h1 className="text-[100px] font-display font-bold text-white leading-[1.05] tracking-tight text-center mb-10">
                                Launching<br /><span className="text-primary">next week.</span>
                            </h1>

                            <div className="text-3xl font-medium text-white/70 bg-white/5 border border-white/10 px-12 py-6 rounded-full flex items-center gap-4 mb-24">
                                Join the waitlist <ArrowRight className="w-8 h-8 text-primary" /> <span className="text-white">juriq.app/waitlist</span>
                            </div>

                            {/* UI Mockup embedded to look authentic */}
                            <MockupFrame className="w-full flex-1 mb-[-20px] mx-10">
                                <div className="p-10">
                                    <div className="flex items-start gap-8 mb-8">
                                        <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center shrink-0 border border-primary/30">
                                            <Sparkles className="h-8 w-8 text-primary" />
                                        </div>
                                        <div className="bg-white/5 rounded-3xl rounded-tl-sm border border-white/10 p-8 flex-1 backdrop-blur-md">
                                            <p className="text-3xl text-white/90 leading-relaxed mb-8">
                                                I've analyzed the "Non-Compete" clause in Section 4.2.
                                            </p>
                                            <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-6">
                                                <div className="flex gap-3 text-red-500 font-bold text-2xl mb-3 items-center">
                                                    <AlertTriangle className="w-8 h-8" /> High Risk
                                                </div>
                                                <p className="text-red-200/90 text-2xl leading-snug">The geographic scope (Global) and duration (5 years) are unusually broad and likely unenforceable in your jurisdiction.</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </MockupFrame>

                        </div>
                    </div>
                </div>

            </div>
        </div>
    )
} 
