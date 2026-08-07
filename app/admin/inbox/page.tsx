import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { updateRequestStatus, deleteRequest } from "./actions";

export default async function ProviderInboxPage({
    searchParams,
}: {
    searchParams: Promise<{ error?: string; success?: string; filter?: string }>;
}) {
    const { error, success, filter } = await searchParams;
    const supabase = await createClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();
    if (!user) redirect("/login");

    let query = supabase
        .from("requests")
        .select("*, blocks(title)")
        .eq("provider_id", user.id)
        .order("created_at", { ascending: false });

    if (filter && ["PENDING", "CONTACTED", "DECLINED"].includes(filter)) {
        query = query.eq("status", filter);
    }

    const { data: requests } = await query;

    const statusBadge = {
        PENDING: "bg-yellow-100 text-yellow-800 border-yellow-200",
        CONTACTED: "bg-green-100 text-green-800 border-green-200",
        DECLINED: "bg-gray-100 text-gray-700 border-gray-200",
    };

    return (
        <main className="min-h-screen bg-gray-50 p-6 md:p-12 max-w-5xl mx-auto space-y-8">
            <div className="flex justify-between items-center border-b pb-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Client Booking Inbox</h1>
                    <p className="text-sm text-gray-500">
                        Manage incoming service requests from potential clients
                    </p>
                </div>
                <Link
                    href="/admin"
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded text-sm font-medium hover:bg-gray-100"
                >
                    ← Back to Dashboard
                </Link>
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

            {/* Filter Tabs */}
            <div className="flex gap-2 border-b pb-2">
                {["ALL", "PENDING", "CONTACTED", "DECLINED"].map((item) => {
                    const active = (item === "ALL" && !filter) || filter === item;
                    const href = item === "ALL" ? "/admin/inbox" : `/admin/inbox?filter=${item}`;
                    return (
                        <Link
                            key={item}
                            href={href}
                            className={`px-3 py-1.5 rounded text-xs font-bold transition ${
                                active
                                    ? "bg-gray-900 text-white"
                                    : "bg-white text-gray-600 border hover:bg-gray-50"
                            }`}
                        >
                            {item}
                        </Link>
                    );
                })}
            </div>

            {/* Requests List */}
            <section className="space-y-4">
                {requests?.length === 0 ? (
                    <div className="bg-white p-8 rounded-lg border text-center text-gray-500">
                        No requests found for this filter.
                    </div>
                ) : (
                    requests?.map((req) => (
                        <div
                            key={req.id}
                            className="bg-white p-6 rounded-lg border shadow-sm space-y-4"
                        >
                            <div className="flex justify-between items-start">
                                <div>
                                    <div className="flex items-center gap-2">
                                        <h3 className="font-bold text-lg text-gray-900">
                                            {req.client_name}
                                        </h3>
                                        <span
                                            className={`text-xs px-2.5 py-0.5 rounded-full border font-semibold ${statusBadge[req.status as keyof typeof statusBadge]}`}
                                        >
                                            {req.status}
                                        </span>
                                    </div>
                                    <a
                                        href={`mailto:${req.client_email}`}
                                        className="text-sm text-blue-600 hover:underline font-medium"
                                    >
                                        {req.client_email}
                                    </a>
                                </div>
                                <span className="text-xs text-gray-400 font-mono">
                                    {new Date(req.created_at).toLocaleDateString()}
                                </span>
                            </div>

                            {req.blocks?.title && (
                                <div className="text-xs font-semibold text-gray-500 bg-gray-50 p-2 rounded border inline-block">
                                    Requested Service:{" "}
                                    <span className="text-gray-900">{req.blocks.title}</span>
                                </div>
                            )}

                            <p className="text-sm text-gray-700 leading-relaxed bg-gray-50 p-3 rounded border">
                                &quot;{req.message}&quot;
                            </p>

                            <div className="flex justify-end gap-2 border-t pt-3">
                                <form action={updateRequestStatus}>
                                    <input type="hidden" name="requestId" value={req.id} />
                                    <input type="hidden" name="status" value="CONTACTED" />
                                    <button
                                        type="submit"
                                        disabled={req.status === "CONTACTED"}
                                        className="px-3 py-1.5 text-xs bg-green-600 text-white rounded font-medium hover:bg-green-700 disabled:opacity-50"
                                    >
                                        Mark Contacted
                                    </button>
                                </form>

                                <form action={updateRequestStatus}>
                                    <input type="hidden" name="requestId" value={req.id} />
                                    <input type="hidden" name="status" value="DECLINED" />
                                    <button
                                        type="submit"
                                        disabled={req.status === "DECLINED"}
                                        className="px-3 py-1.5 text-xs border border-gray-300 text-gray-700 rounded font-medium hover:bg-gray-100 disabled:opacity-50"
                                    >
                                        Mark Declined
                                    </button>
                                </form>

                                <form action={deleteRequest.bind(null, req.id)}>
                                    <button
                                        type="submit"
                                        className="px-3 py-1.5 text-xs bg-red-50 text-red-600 border border-red-200 rounded font-medium hover:bg-red-100"
                                    >
                                        Delete
                                    </button>
                                </form>
                            </div>
                        </div>
                    ))
                )}
            </section>
        </main>
    );
}
