import RequestModal from "@/components/public/RequestModal";
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

            <div
                className="h-32 w-full transition-colors"
                style={{ backgroundColor: themeColor }}
            />

            <div className="max-w-4xl mx-auto px-4 -mt-12 space-y-8">
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
                <div className="bg-white rounded-xl shadow-sm border p-6 md:p-8 space-y-4">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div>
                            <h1 className="text-3xl font-extrabold text-gray-900">
                                {profile.full_name}
                            </h1>
                            <p className="text-sm font-medium text-gray-500">@{profile.username}</p>
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

                            <RequestModal providerId={profile.id} themeColor={themeColor} />
                        </div>
                    </div>

                    {profile.bio && (
                        <p className="text-gray-700 text-base leading-relaxed border-t pt-4">
                            {profile.bio}
                        </p>
                    )}
                </div>

                <div className="space-y-4">
                    <h2 className="text-xl font-bold text-gray-900">Services & Offerings</h2>

                    {blocks?.length === 0 ? (
                        <div className="bg-white rounded-xl p-8 text-center text-gray-500 border">
                            No active services currently listed. Check back soon!
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {blocks?.map((block) => (
                                <div
                                    key={block.id}
                                    className="bg-white rounded-xl p-6 border shadow-sm hover:shadow-md transition flex flex-col justify-between space-y-4"
                                >
                                    <div className="space-y-2">
                                        {block.image_url && (
                                            <div className="relative w-full h-40 rounded-lg overflow-hidden bg-gray-100 mb-3">
                                                <Image
                                                    src={block.image_url}
                                                    alt={block.title}
                                                    fill
                                                    sizes="(max-width: 768px) 100vw, 50vw"
                                                    className="object-cover"
                                                />
                                            </div>
                                        )}

                                        <div className="flex justify-between items-start">
                                            <h3 className="font-bold text-lg text-gray-900">
                                                {block.title}
                                            </h3>
                                            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-gray-100 text-gray-600">
                                                {block.category}
                                            </span>
                                        </div>

                                        {block.description && (
                                            <p className="text-sm text-gray-600 line-clamp-3">
                                                {block.description}
                                            </p>
                                        )}
                                    </div>

                                    <div className="flex justify-between items-center border-t pt-4">
                                        <span className="text-xl font-extrabold text-gray-900">
                                            ${(block.price_cents / 100).toFixed(2)}
                                        </span>

                                        <RequestModal
                                            providerId={profile.id}
                                            blockId={block.id}
                                            blockTitle={block.title}
                                            themeColor={themeColor}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </main>
    );
}
