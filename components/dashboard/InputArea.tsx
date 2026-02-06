import React, { useState } from 'react';

interface AttachedFile {
    name: string;
    type: string;
    size: number;
    isValid?: boolean; // New: Validation state for green/red feedback
}

interface InputAreaProps {
    onSend: (text: string, attachedFile?: AttachedFile) => void;
    disabled: boolean;
    onUploadClick?: () => void;
    // New: For showing attachment preview
    attachedFile?: AttachedFile | null;
    onRemoveAttachment?: () => void;
}

export const InputArea: React.FC<InputAreaProps> = ({
    onSend,
    disabled,
    onUploadClick,
    attachedFile,
    onRemoveAttachment
}) => {
    const [text, setText] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Only allow sending invalid files if we disable check, but robustly we should probably block sending if invalid
        // For now, adhere to "green/red" request purely visual, but let's block send if invalid to be safe?
        // User didn't ask to block, just feedback.
        if ((text.trim() || (attachedFile && attachedFile.isValid !== false)) && !disabled) {
            onSend(text, attachedFile || undefined);
            setText('');
        }
    };

    const getFileIcon = (type: string) => {
        if (type.includes('pdf')) return 'picture_as_pdf';
        if (type.includes('word') || type.includes('document')) return 'description';
        if (type.includes('text')) return 'article';
        return 'attach_file';
    };

    const getFileColor = (file: AttachedFile) => {
        // Red if invalid
        if (file.isValid === false) return 'text-red-500 bg-red-50 dark:bg-red-500/10 border-red-500 dark:border-red-500 ring-1 ring-red-500/20';

        // Green if valid (explicitly valid)
        if (file.isValid === true) return 'text-green-600 bg-green-50 dark:bg-green-500/10 border-green-500 dark:border-green-500 ring-1 ring-green-500/20';

        // Default colors based on type if validation not run/neutral
        const type = file.type;
        if (type.includes('pdf')) return 'text-red-500 bg-red-50 dark:bg-red-500/10 border-red-200 dark:border-red-500/20';
        if (type.includes('word') || type.includes('document')) return 'text-blue-500 bg-blue-50 dark:bg-blue-500/10 border-blue-200 dark:border-blue-500/20';
        return 'text-slate-500 bg-slate-50 dark:bg-slate-500/10 border-slate-200 dark:border-slate-500/20';
    };

    return (
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10 z-20 flex flex-col items-center bg-gradient-to-t from-off-white via-off-white/90 to-transparent dark:from-midnight-bg dark:via-midnight-bg/90 dark:to-transparent transition-colors duration-300">

            <div className="w-full max-w-3xl relative space-y-3">

                {/* Attachment Preview (Enhanced Visual Feedback) */}
                {attachedFile && (
                    <div className={`inline-flex items-center gap-3 px-4 py-3 rounded-xl border-2 ${getFileColor(attachedFile)} shadow-lg max-w-sm transition-all duration-300 animate-in slide-in-from-bottom-2`}>
                        {/* File Icon with Pulse Animation for Valid Files */}
                        <div className={`relative w-12 h-12 rounded-xl flex items-center justify-center ${attachedFile.isValid === true ? 'bg-green-100 dark:bg-green-500/20' : attachedFile.isValid === false ? 'bg-red-100 dark:bg-red-500/20' : 'bg-white/50 dark:bg-black/20'}`}>
                            {attachedFile.isValid === true && (
                                <div className="absolute inset-0 rounded-xl bg-green-400/30 animate-ping" />
                            )}
                            <span className={`material-symbols-outlined text-2xl relative z-10 ${attachedFile.isValid === true ? 'text-green-600' : attachedFile.isValid === false ? 'text-red-500' : ''}`}>{getFileIcon(attachedFile.type)}</span>
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-bold truncate">{attachedFile.name}</p>
                            <div className="flex items-center gap-2 mt-0.5">
                                <span className="text-xs opacity-70 uppercase">
                                    {attachedFile.type.split('/')[1]?.toUpperCase() || 'FILE'}
                                </span>
                                <span className="text-xs opacity-50">•</span>
                                <span className="text-xs opacity-70">
                                    {(attachedFile.size / 1024).toFixed(0)} KB
                                </span>
                                {attachedFile.isValid === false && (
                                    <>
                                        <span className="text-xs opacity-50">•</span>
                                        <span className="font-bold text-red-600 dark:text-red-400 text-xs">Too Large (Max 4.5MB)</span>
                                    </>
                                )}
                                {attachedFile.isValid === true && (
                                    <>
                                        <span className="text-xs opacity-50">•</span>
                                        <span className="font-bold text-green-600 dark:text-green-400 text-xs flex items-center gap-0.5">
                                            <span className="material-symbols-outlined text-xs">check_circle</span>
                                            Ready to Analyze
                                        </span>
                                    </>
                                )}
                            </div>
                        </div>
                        <button
                            onClick={onRemoveAttachment}
                            className="w-7 h-7 rounded-full bg-slate-200 dark:bg-white/10 hover:bg-red-100 dark:hover:bg-red-500/20 flex items-center justify-center text-slate-500 hover:text-red-500 dark:text-slate-400 dark:hover:text-red-400 transition-colors"
                            title="Remove file"
                        >
                            <span className="material-symbols-outlined text-sm">close</span>
                        </button>
                    </div>
                )}

                {/* Input Bar */}
                <div className="bg-white/50 dark:bg-white/5 border border-slate-200 dark:border-white/10 backdrop-blur-md rounded-xl p-1.5 flex items-center gap-2 shadow-xl dark:shadow-glass transition-all duration-300 focus-within:bg-white dark:focus-within:bg-white/10 focus-within:border-primary/50 dark:focus-within:border-white/20 group">

                    {/* Add Button */}
                    <button
                        type="button"
                        onClick={onUploadClick}
                        className="p-3 text-slate-400 hover:text-primary dark:text-slate-500 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/10 transition-all rounded-lg"
                        title="Add Document"
                    >
                        <span className="material-symbols-outlined text-2xl">add</span>
                    </button>

                    {/* Input */}
                    <form onSubmit={handleSubmit} className="flex-1 flex py-2">
                        <input
                            className="flex-1 bg-transparent border-none focus:ring-0 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 text-lg px-2 font-light focus:outline-none transition-colors"
                            placeholder="Ask anything..."
                            type="text"
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                            disabled={disabled}
                        />
                    </form>

                    {/* Send Button */}
                    <button
                        onClick={handleSubmit}
                        disabled={(!text.trim() && !attachedFile) || disabled}
                        className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all active:scale-95
                            ${(text.trim() || attachedFile) && !disabled
                                ? 'bg-slate-900 dark:bg-white text-white dark:text-midnight-bg'
                                : 'bg-slate-100 dark:bg-white/10 text-slate-300 dark:text-slate-600 cursor-not-allowed'
                            }`}
                    >
                        <span className="material-symbols-outlined">arrow_upward</span>
                    </button>
                </div>
            </div>

            <p className="mt-4 text-[10px] text-slate-500 dark:text-slate-600 font-medium uppercase tracking-widest">
                Limited Spots Available • Juriq Beta
            </p>
        </div>
    );
};
