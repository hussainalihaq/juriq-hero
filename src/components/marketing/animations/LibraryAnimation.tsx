import { motion } from "framer-motion";
import { FileText, CheckCircle2 } from "lucide-react";

export function LibraryAnimation() {
    const documents = [
        { name: "Master Services Agreement.pdf", delay: 0 },
        { name: "Vendor_NDA_Acme_Corp.docx", delay: 0.2 },
        { name: "Employment_Contract_Q3.pdf", delay: 0.4 },
    ];

    return (
        <div className="relative w-full h-[300px] overflow-hidden rounded-xl border border-border/50 bg-background/50 backdrop-blur-sm p-4 shadow-xl flex flex-col gap-3 justify-center">
            {documents.map((doc, idx) => (
                <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.5 + doc.delay }}
                    className="flex items-center justify-between p-4 rounded-lg border border-border/50 bg-card shadow-sm"
                >
                    <div className="flex items-center gap-3">
                        <div className="rounded p-2 bg-primary/10 text-primary">
                            <FileText className="h-4 w-4" />
                        </div>
                        <span className="text-sm font-medium text-foreground truncate max-w-[150px] sm:max-w-[200px]">
                            {doc.name}
                        </span>
                    </div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.4, delay: 1.5 + doc.delay }}
                        className="flex items-center gap-1 text-xs font-semibold text-success bg-success/10 px-2 py-1 rounded-full"
                    >
                        <CheckCircle2 className="h-3 w-3" />
                        Analyzed
                    </motion.div>
                </motion.div>
            ))}

            {/* Decorative gradient */}
            <div className="pointer-events-none absolute top-10 right-10 h-32 w-32 rounded-full bg-primary/10 blur-3xl" />
        </div>
    );
}
