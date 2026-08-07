"use server";
import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

const requestSchema = z.object({
    provider_id: z.string().uuid("Invalid provider ID"),
    provider_username: z.string().optional(),
    block_id: z.string().uuid("Invalid block ID").optional().or(z.literal("")),
    client_name: z.string().min(1, "Client name is required"),
    client_email: z.string().email("Invalid email address"),
    message: z.string().min(5, "Message must be at least 5 characters long"),
});

export async function submitRequest(formData: FormData) {
    const supabase = await createClient();
    const providerUsername = formData.get("provider_username") as string;
    const redirectPath = providerUsername ? `/${providerUsername}` : "/";

    const rawData = {
        provider_id: formData.get("provider_id"),
        provider_username: providerUsername,
        block_id: formData.get("block_id"),
        client_name: formData.get("client_name"),
        client_email: formData.get("client_email"),
        message: formData.get("message"),
    };

    const result = requestSchema.safeParse(rawData);
    if (!result.success) {
        const firstError = result.error.issues[0].message;
        redirect(`${redirectPath}?error=${encodeURIComponent(firstError)}`);
    }

    const blockId = result.data.block_id?.trim() || null;
    const { error } = await supabase.from("requests").insert({
        provider_id: result.data.provider_id,
        block_id: blockId,
        client_name: result.data.client_name,
        client_email: result.data.client_email,
        message: result.data.message,
        status: "PENDING",
    });

    if (error) {
        redirect(`${redirectPath}?error=${encodeURIComponent(error.message)}`);
    }

    revalidatePath("/admin/inbox");
    redirect(`${redirectPath}?success=Service request submitted successfully!`);
}
