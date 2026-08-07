"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

const statusSchema = z.object({
    requestId: z.string().uuid(),
    status: z.enum(["PENDING", "CONTACTED", "DECLINED"]),
});

export async function updateRequestStatus(formData: FormData) {
    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        redirect("/login?error=You must be logged in to manage requests");
    }

    const result = statusSchema.safeParse({
        requestId: formData.get("requestId"),
        status: formData.get("status"),
    });

    if (!result.success) {
        redirect(`/admin/inbox?error=${encodeURIComponent(result.error.issues[0].message)}`);
    }

    const { error } = await supabase
        .from("requests")
        .update({ status: result.data.status })
        .eq("id", result.data.requestId)
        .eq("provider_id", user.id);

    if (error) {
        redirect(`/admin/inbox?error=${encodeURIComponent(error.message)}`);
    }

    revalidatePath("/admin/inbox");
    redirect("/admin/inbox?success=Request status updated");
}

export async function deleteRequest(requestId: string) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) redirect("/login");

    const { error } = await supabase
        .from("requests")
        .delete()
        .eq("id", requestId)
        .eq("provider_id", user.id);

    if (error) {
        redirect(`/admin/inbox?error=${encodeURIComponent(error.message)}`);
    }

    revalidatePath("/admin/inbox");
    redirect("/admin/inbox?success=Request deleted");
}
