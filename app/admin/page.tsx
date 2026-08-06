import BlockCard from "@/components/admin/BlockCard";
import CreateBlockForm from "@/components/admin/CreateBlockForm";
import ProfileSettingsForm from "@/components/admin/ProfileSettingsForm";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

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

    return (
        <main className="min-h-screen bg-gray-50 p-6 md:p-12 max-w-5xl mx-auto space-y-8">
            <div className="flex justify-between items-center border-b pb-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Provider Dashboard</h1>
                    <p className="text-sm text-gray-500">
                        Welcome back,{" "}
                        <span className="font-semibold">{profile?.full_name || user.email}</span> (@
                        {profile?.username})
                    </p>
                </div>
                <a
                    href={`/${profile?.username}`}
                    target="_blank"
                    className="px-4 py-2 bg-gray-900 text-white rounded text-sm font-medium hover:bg-gray-800"
                >
                    View Public Profile ↗
                </a>
            </div>

            {error && (
                <div className="p-4 bg-red-50 text-red-700 border border-red-200 rounded">
                    {error}
                </div>
            )}
            {success && (
                <div className="p-4 bg-green-50 text-green-700 border border-green-200 rounded">
                    {success}
                </div>
            )}

            <ProfileSettingsForm status={profile?.status} themeColor={profile?.theme_color} />
            <CreateBlockForm />

            <section className="bg-white p-6 rounded-lg shadow-sm border space-y-4">
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
