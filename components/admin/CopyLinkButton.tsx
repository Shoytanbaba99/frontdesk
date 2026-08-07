"use client";

import { useState } from "react";

export default function CopyLinkButton({ username }: { username: string }) {
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
        const link = `${window.location.origin}/${username}`;
        try {
            await navigator.clipboard.writeText(link);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error("Failed to copy link", err);
        }
    };

    return (
        <button
            onClick={handleCopy}
            className={`px-4 py-2 border rounded text-sm font-medium transition-all shadow-sm active:scale-95 ${
                copied
                    ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                    : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50 hover:border-gray-400"
            }`}
        >
            {copied ? "✓ Copied!" : "📋 Copy Public Profile Link"}
        </button>
    );
}
