import { motion } from "framer-motion";

export function DiffAnimation() {
    return (
        <div className="relative w-full h-[300px] overflow-hidden rounded-xl border border-border/50 bg-background/50 backdrop-blur-sm p-6 shadow-xl font-mono text-sm leading-relaxed text-muted-foreground flex flex-col justify-center">
            <div className="space-y-4">
                <p>
                    The Receiving Party agrees to hold the Confidential Information in strict confidence and
                </p>

                <div className="relative p-3 rounded-lg bg-secondary/30 border border-border/50">
                    <p className="line-through decoration-danger decoration-2 text-danger/70 mb-2">
                        shall not disclose it to any third party for any reason.
                    </p>
                    <motion.p
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, delay: 1 }}
                        className="text-success font-medium bg-success/10 py-1 px-2 rounded -ml-2 w-max"
                    >
                        shall only disclose it to employees on a strict need-to-know basis.
                    </motion.p>
                </div>

                <p>
                    Any breach of this provision will result in immediate termination of this Agreement.
                </p>
            </div>
        </div>
    );
}
