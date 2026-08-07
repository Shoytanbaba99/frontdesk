import BlockCard from "@/components/admin/BlockCard";
import CreateBlockForm from "@/components/admin/CreateBlockForm";
import ProfileSettingsForm from "@/components/admin/ProfileSettingsForm";
import CopyLinkButton from "@/components/admin/CopyLinkButton";
import { logout } from "@/app/login/actions";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function AdminPage({
    searchParams,
}: {
    searchParams: Promise<{ error?: string; success?: string }>;
}) {
    const { error, success } = await searchParams;
    const supabase = await createClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();
    if (!user) redirect("/login");

    const { data: profile } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

    const { data: blocks } = await supabase
        .from("blocks")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

    const { count: unreadCount } = await supabase
        .from("requests")
        .select("*", { count: "exact", head: true })
        .eq("provider_id", user.id)
        .eq("status", "PENDING");

    return (
        <main className="min-h-screen bg-gray-50 text-gray-900 p-6 md:p-12 max-w-5xl mx-auto space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b pb-6">
                <div>
                    <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900">Provider Dashboard</h1>
                    <p className="text-sm text-gray-500 mt-1">
                        Welcome back,{" "}
                        <span className="font-semibold text-gray-800">{profile?.full_name || user.email}</span> (@
                        {profile?.username})
                    </p>
                </div>
                <div className="flex flex-wrap items-center gap-2.5">
                    <Link
                        href="/admin/inbox"
                        className="inline-flex items-center gap-1.5 h-10 px-4 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 transition shadow-sm"
                    >
                        <span>📬 Inbox</span>
                        {unreadCount ? (
                            <span className="ml-1 inline-flex h-5 min-w-[20px] items-center justify-center rounded-full bg-red-500 px-1 text-[11px] font-bold text-white shadow-sm">
                                {unreadCount}
                            </span>
                        ) : null}
                    </Link>
                    {profile?.username && <CopyLinkButton username={profile.username} />}
                    <a
                        href={`/${profile?.username}`}
                        target="_blank"
                        className="inline-flex items-center h-10 px-4 bg-gray-900 text-white rounded-lg text-sm font-semibold hover:bg-gray-800 transition shadow-sm"
                    >
                        View Public Profile ↗
                    </a>
                    <form action={logout} className="inline-block">
                        <button
                            type="submit"
                            className="inline-flex items-center h-10 px-4 border border-gray-300 text-gray-700 rounded-lg text-sm font-semibold hover:bg-gray-100 transition"
                        >
                            Log Out
                        </button>
                    </form>
                </div>
            </div>

            {error && (
                <div className="p-4 bg-red-50 text-red-700 border border-red-200 rounded-lg">
                    {error}
                </div>
            )}
            {success && (
                <div className="p-4 bg-green-50 text-green-700 border border-green-200 rounded-lg">
                    {success}
                </div>
            )}

            <ProfileSettingsForm profile={profile} />
            <CreateBlockForm />

            <section className="bg-white p-6 rounded-xl shadow-sm border space-y-4">
                <h2 className="text-xl font-bold text-gray-800">
                    Your Services ({blocks?.length || 0})
                </h2>
                {blocks?.length === 0 ? (
                    <p className="text-gray-500 text-sm">
                        No service blocks created yet. Add your first service above!
                    </p>
                ) : (
                    <div className="space-y-3">
                        {blocks?.map((block) => (
                            <BlockCard key={block.id} block={block} />
                        ))}
                    </div>
                )}
            </section>
        </main>
    );
}
