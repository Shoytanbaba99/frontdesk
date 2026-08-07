import RequestModal from "@/components/public/RequestModal";
import ServicesList from "@/components/public/ServicesList";
import { createClient } from "@/utils/supabase/server";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

interface PublicProfileProp {
    params: Promise<{ username: string }>;
    searchParams: Promise<{ error?: string; success?: string }>;
}

export default async function PublicProfile({ params, searchParams }: PublicProfileProp) {
    const { username } = await params;
    const { error, success } = await searchParams;
    const supabase = await createClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();

    const { data: profile } = await supabase
        .from("profiles")
        .select("*")
        .eq("username", username.toLowerCase())
        .single();

    if (!profile) {
        notFound();
    }

    const isOwner = user?.id === profile.id;

    const { data: blocks } = await supabase
        .from("blocks")
        .select("*")
        .eq("user_id", profile.id)
        .eq("is_active", true)
        .order("created_at", { ascending: false });

    const statusConfig = {
        AVAILABLE: {
            label: "Available for Work",
            color: "bg-emerald-500",
            text: "text-emerald-700",
            bg: "bg-emerald-50",
        },
        BUSY: {
            label: "Busy / Fully Booked",
            color: "bg-rose-500",
            text: "text-rose-700",
            bg: "bg-rose-50",
        },
        OFFLINE: {
            label: "Offline",
            color: "bg-gray-400",
            text: "text-gray-700",
            bg: "bg-gray-100",
        },
    };

    const currentStatus =
        statusConfig[profile.status as keyof typeof statusConfig] || statusConfig.AVAILABLE;

    const themeColor = profile.theme_color || "#3B82F6";

    return (
        <main className="min-h-screen bg-gray-50 pb-16">
            {/* Owner Navigation Bar */}
            {isOwner && (
                <div className="bg-gray-900 text-white text-xs py-2 px-4 flex justify-between items-center font-medium">
                    <span>Previewing your public profile (@{profile.username})</span>
                    <Link
                        href="/admin"
                        className="bg-blue-600 px-3 py-1 rounded text-white hover:bg-blue-700 font-semibold"
                    >
                        ← Back to Admin Dashboard
                    </Link>
                </div>
            )}

            {/* Cover Banner */}
            <div className="relative h-48 md:h-64 w-full bg-gray-900 overflow-hidden">
                {profile.cover_image_url ? (
                    <Image
                        src={profile.cover_image_url}
                        alt="Cover Banner"
                        fill
                        priority
                        className="object-cover opacity-90"
                    />
                ) : (
                    <div
                        className="w-full h-full transition-colors"
                        style={{ backgroundColor: themeColor }}
                    />
                )}
            </div>

            <div className="max-w-4xl mx-auto px-4 -mt-16 relative z-10 space-y-8">
                {/* Alert Banners */}
                {error && (
                    <div className="p-4 bg-red-50 text-red-700 border border-red-200 rounded-lg shadow-sm">
                        {error}
                    </div>
                )}
                {success && (
                    <div className="p-4 bg-green-50 text-green-700 border border-green-200 rounded-lg shadow-sm">
                        {success}
                    </div>
                )}
                <div className="bg-white rounded-xl shadow-sm border p-6 md:p-8 space-y-6">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b pb-6">
                        <div className="flex items-end gap-4">
                            {/* Avatar Profile Picture */}
                            <div className="relative w-24 h-24 md:w-28 md:h-28 rounded-full border-4 border-white shadow-md overflow-hidden bg-gray-100 flex-shrink-0 -mt-16 md:-mt-20">
                                {profile.avatar_url ? (
                                    <Image
                                        src={profile.avatar_url}
                                        alt={profile.full_name || profile.username}
                                        fill
                                        className="object-cover"
                                    />
                                ) : (
                                    <div
                                        className="w-full h-full flex items-center justify-center text-3xl font-bold text-white uppercase"
                                        style={{ backgroundColor: themeColor }}
                                    >
                                        {(profile.full_name || profile.username).slice(0, 2)}
                                    </div>
                                )}
                            </div>

                            <div>
                                <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900">
                                    {profile.full_name}
                                </h1>
                                <p className="text-sm font-medium text-gray-500">@{profile.username}</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <div
                                className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold
      ${currentStatus.bg} ${currentStatus.text} border border-current/20`}
                            >
                                <span
                                    className={`h-2.5 w-2.5 rounded-full ${currentStatus.color} animate-pulse`}
                                />
                                {currentStatus.label}
                            </div>

                            <RequestModal providerId={profile.id} providerUsername={profile.username} themeColor={themeColor} />
                        </div>
                    </div>

                    {profile.bio && (
                        <p className="text-gray-700 text-base leading-relaxed border-t pt-4">
                            {profile.bio}
                        </p>
                    )}

                    {(profile.github_url || profile.x_url || profile.website_url) && (
                        <div className="flex gap-2 pt-2">
                            {profile.github_url && (
                                <a href={profile.github_url} target="_blank" rel="noopener noreferrer" className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-full text-xs font-semibold hover:bg-gray-200 transition">
                                    GitHub ↗
                                </a>
                            )}
                            {profile.x_url && (
                                <a href={profile.x_url} target="_blank" rel="noopener noreferrer" className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-full text-xs font-semibold hover:bg-gray-200 transition">
                                    X / Twitter ↗
                                </a>
                            )}
                            {profile.website_url && (
                                <a href={profile.website_url} target="_blank" rel="noopener noreferrer" className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-full text-xs font-semibold hover:bg-gray-200 transition">
                                    Website ↗
                                </a>
                            )}
                        </div>
                    )}
                </div>

                <div className="space-y-4">
                    <h2 className="text-xl font-bold text-gray-900">Services & Offerings</h2>
                    <ServicesList blocks={blocks || []} profileId={profile.id} providerUsername={profile.username} themeColor={themeColor} />
                </div>
            </div>
        </main>
    );
}
