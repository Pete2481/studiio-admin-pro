"use client"

import Link from "next/link";
import { motion } from "framer-motion";
import { AlertTriangle } from "lucide-react";
import { FC } from "react";

const NotFoundPage: FC = () => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-900">
            <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45 }}
                className="max-w-4xl w-full mx-6 rounded-2xl bg-white/70 backdrop-blur-md shadow-2xl border border-gray-100 dark:bg-gray-dark/60 dark:border-gray-800 p-10"
            >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                    <div className="flex flex-col gap-6">
                        <div className="inline-flex items-center gap-3 px-3 py-2 rounded-lg bg-red-50/80 border border-red-100 dark:bg-red-900/20">
                            <AlertTriangle className="w-6 h-6 text-red-600 dark:text-red-400" />
                            <span className="text-sm font-medium text-red-700 dark:text-red-300">Page not found</span>
                        </div>

                        <h1 className="text-5xl md:text-6xl font-extrabold leading-tight">404 — We can’t find that page.</h1>

                        <p className="text-lg text-gray-600 dark:text-gray-300 max-w-xl">The page you’re looking for might have been removed, had its name changed, or is temporarily unavailable. Try returning home or checking the URL.</p>

                        <div className="flex gap-3">
                            <Link href="/">
                                <span className="inline-flex items-center gap-2 rounded-xl px-5 py-3 bg-black/90 text-white text-sm font-semibold shadow-lg hover:brightness-105 transition cursor-pointer">Go to homepage</span>
                            </Link>

                            <Link href="#" replace>
                                <span className="inline-flex items-center gap-2 rounded-xl px-4 py-3 border border-gray-200 text-sm font-medium hover:bg-gray-50 transition dark:border-gray-700 cursor-pointer">Contact support</span>
                            </Link>
                        </div>

                        <div className="mt-4 text-xs text-gray-400">Tip: Press <kbd className="px-2 py-0.5 rounded bg-gray-100 border">Esc</kbd> to close overlays, or check your URL for typos.</div>
                    </div>

                    <div className="flex items-center justify-center">
                        <div className="w-full max-w-md p-6 bg-gradient-to-b from-gray-50 to-white rounded-2xl border border-gray-100 shadow-sm dark:from-gray-800 dark:to-gray-900 dark:border-gray-700">
                            <motion.div
                                initial={{ scale: 0.95, rotate: -2 }}
                                animate={{ scale: 1, rotate: 0 }}
                                transition={{ duration: 0.6, ease: "easeOut" }}
                                className="w-full h-56 flex items-center justify-center"
                            >
                                <svg viewBox="0 0 320 200" className="w-full h-full" preserveAspectRatio="xMidYMid meet">
                                    <defs>
                                        <linearGradient id="g" x1="0" x2="1">
                                            <stop offset="0%" stopColor="#fef3c7" />
                                            <stop offset="100%" stopColor="#ffd7a8" />
                                        </linearGradient>
                                    </defs>

                                    <rect x="6" y="20" width="308" height="160" rx="16" fill="url(#g)" stroke="#f3f4f6" strokeWidth="2" />

                                    <g transform="translate(36,40)">
                                        <circle cx="90" cy="50" r="32" fill="#fff" stroke="#fde68a" strokeWidth="3" />
                                        <rect x="10" y="12" width="120" height="28" rx="8" fill="#fff" stroke="#fbcfe8" strokeWidth="2" opacity="0.9" />
                                        <text x="36" y="60" fontSize="40" fontWeight="700" fill="#111827">404</text>
                                        <text x="10" y="110" fontSize="12" fill="#374151">This page doesn't exist — yet.</text>
                                    </g>
                                </svg>
                            </motion.div>
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default NotFoundPage;
