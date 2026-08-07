import { createClient } from "@/utils/supabase/server";
import Link from "next/link";

export default async function HomePage() {
    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    let profile = null;
    if (user) {
        const { data } = await supabase
            .from("profiles")
            .select("username")
            .eq("id", user.id)
            .single();
        profile = data;
    }

    return (
        <main className="min-h-screen bg-gray-50 flex flex-col justify-between font-sans">
            {/* Navigation Header */}
            <header className="border-b bg-white/80 backdrop-blur-md sticky top-0 z-50 px-6 py-4 flex justify-between items-center max-w-7xl mx-auto w-full">
                <div className="flex items-center gap-2">
                    <span className="h-8 w-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-extrabold text-lg">
                        F
                    </span>
                    <span className="text-xl font-extrabold text-gray-900 tracking-tight">FrontDesk</span>
                </div>
                <div>
                    {user ? (
                        <Link
                            href="/admin"
                            className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-sm hover:bg-blue-700 transition text-sm"
                        >
                            Go to Dashboard ↗
                        </Link>
                    ) : (
                        <Link
                            href="/login"
                            className="px-4 py-2 bg-gray-900 text-white font-semibold rounded-lg shadow-sm hover:bg-gray-800 transition text-sm"
                        >
                            Sign In / Get Started
                        </Link>
                    )}
                </div>
            </header>

            {/* Hero Section */}
            <section className="flex-1 flex flex-col items-center justify-center p-6 md:p-12 text-center max-w-4xl mx-auto space-y-8">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-blue-50 text-blue-700 border border-blue-200/80 rounded-full text-xs font-bold tracking-wide uppercase shadow-sm">
                    ✨ Built for Solo Service Providers & Freelancers
                </div>

                <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 tracking-tight leading-tight">
                    Showcase services & capture client bookings with <span className="text-blue-600">FrontDesk</span>
                </h1>

                <p className="text-lg md:text-xl text-gray-600 leading-relaxed max-w-2xl">
                    Share your real-time availability, display structured service offerings, and capture client booking requests straight into a private owner inbox.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center w-full max-w-md pt-2">
                    {user ? (
                        <>
                            <Link
                                href="/admin"
                                className="px-6 py-3.5 bg-blue-600 text-white font-semibold rounded-xl shadow-md hover:bg-blue-700 transition-all hover:-translate-y-0.5"
                            >
                                Open Dashboard ↗
                            </Link>
                            {profile?.username && (
                                <Link
                                    href={`/${profile.username}`}
                                    className="px-6 py-3.5 bg-white border border-gray-300 text-gray-800 font-semibold rounded-xl shadow-sm hover:bg-gray-100 transition-all hover:-translate-y-0.5"
                                >
                                    View Your Public Profile
                                </Link>
                            )}
                        </>
                    ) : (
                        <>
                            <Link
                                href="/login"
                                className="px-6 py-3.5 bg-blue-600 text-white font-semibold rounded-xl shadow-md hover:bg-blue-700 transition-all hover:-translate-y-0.5"
                            >
                                Start Free / Create Profile
                            </Link>
                            <Link
                                href="/login"
                                className="px-6 py-3.5 bg-white border border-gray-300 text-gray-800 font-semibold rounded-xl shadow-sm hover:bg-gray-100 transition-all hover:-translate-y-0.5"
                            >
                                Provider Login
                            </Link>
                        </>
                    )}
                </div>

                {/* Feature Highlights Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-12 text-left w-full">
                    <div className="bg-white p-6 rounded-2xl border shadow-sm space-y-2">
                        <div className="text-2xl">🔴</div>
                        <h3 className="font-bold text-gray-900 text-base">Real-Time Status</h3>
                        <p className="text-sm text-gray-600">
                            Set your live availability (Available, Busy, Offline) to manage client expectations instantly.
                        </p>
                    </div>

                    <div className="bg-white p-6 rounded-2xl border shadow-sm space-y-2">
                        <div className="text-2xl">📦</div>
                        <h3 className="font-bold text-gray-900 text-base">Service Catalog Blocks</h3>
                        <p className="text-sm text-gray-600">
                            Display offerings with descriptions, categories, image covers, and fixed prices.
                        </p>
                    </div>

                    <div className="bg-white p-6 rounded-2xl border shadow-sm space-y-2">
                        <div className="text-2xl">📬</div>
                        <h3 className="font-bold text-gray-900 text-base">Structured Client Inbox</h3>
                        <p className="text-sm text-gray-600">
                            Receive booking requests in your private dashboard and track status from Pending to Contacted.
                        </p>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="border-t bg-white py-6 text-center text-xs text-gray-500 font-medium">
                © {new Date().getFullYear()} FrontDesk. All rights reserved.
            </footer>
        </main>
    );
}
