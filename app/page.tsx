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
        <main className="flex-1 flex flex-col items-center justify-center p-6 text-center bg-gradient-to-b from-white to-gray-100">
            <div className="max-w-2xl space-y-6">
                <span className="px-3 py-1 bg-blue-50 text-blue-700 border border-blue-200 rounded-full text-xs font-bold tracking-wide uppercase">
                    Solo Provider Platform
                </span>

                <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 tracking-tight">
                    Manage your services & bookings with{" "}
                    <span className="text-blue-600">FrontDesk</span>
                </h1>

                <p className="text-lg text-gray-600 leading-relaxed">
                    Share your real-time availability, showcase service offerings, and capture
                    structured booking requests into a unified provider inbox.
                </p>

                <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
                    {user ? (
                        <>
                            <Link
                                href="/admin"
                                className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow hover:bg-blue-700 transition"
                            >
                                Go to Dashboard ↗
                            </Link>
                            {profile?.username && (
                                <Link
                                    href={`/${profile.username}`}
                                    className="px-6 py-3 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition"
                                >
                                    View Your Public Profile
                                </Link>
                            )}
                        </>
                    ) : (
                        <>
                            <Link
                                href="/login"
                                className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow hover:bg-blue-700 transition"
                            >
                                Get Started / Sign Up
                            </Link>
                            <Link
                                href="/login"
                                className="px-6 py-3 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition"
                            >
                                Provider Login
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </main>
    );
}
