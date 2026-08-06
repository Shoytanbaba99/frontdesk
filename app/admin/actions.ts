"use server";
import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

const profileUpdateSchema = z.object({
    status: z.enum(["AVAILABLE", "BUSY", "OFFLINE"]),
    theme_color: z.string().regex(/^#([0-9A-Fa-f]{6})$/, "Invalid hex color code"),
});

const blockSchema = z.object({
    title: z
        .string()
        .min(2, "Title must be at least 2 characters long")
        .max(50, "Title must be at most 50 characters long"),
    description: z.string().optional(),
    price_dollars: z.coerce.number().min(0, "Price must be a positive number"),
    category: z.string().min(1, "Category must be at least 1 character long"),
    image_url: z.string().url("Invalid URL").optional(),
});

export async function updateProfileSettings(formData: FormData) {
    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
        redirect("/login?error=You must be logged in to update your profile settings");
    }

    const result = profileUpdateSchema.safeParse({
        status: formData.get("status"),
        theme_color: formData.get("theme_color"),
    });

    if (!result.success) {
        redirect(`/admin?error=${encodeURIComponent(result.error.issues[0].message)}`);
    }

    const { error } = await supabase
        .from("profiles")
        .update({
            status: result.data.status,
            theme_color: result.data.theme_color,
            updated_at: new Date().toISOString(),
        })
        .eq("id", user.id);
    if (error) {
        redirect(`/admin?error=${encodeURIComponent(error.message)}`);
    }

    revalidatePath("/admin");
    revalidatePath("/[username]", "page");
    redirect("/admin?success=Profile settings updated successfully");
}

export async function createBlock(formData: FormData) {
    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
        redirect("/login?error=You must be logged in to create a block");
    }
    const result = blockSchema.safeParse({
        title: formData.get("title"),
        description: formData.get("description"),
        price_dollars: formData.get("price_dollars"),
        category: formData.get("category"),
        image_url: formData.get("image_url"),
    });

    if (!result.success) {
        redirect(`/admin?error=${encodeURIComponent(result.error.issues[0].message)}`);
    }

    const price_cents = Math.round(result.data.price_dollars * 100);

    const { error } = await supabase.from("blocks").insert({
        user_id: user.id,
        title: result.data.title,
        description: result.data.description,
        price_cents: price_cents,
        category: result.data.category,
        image_url: result.data.image_url,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
    });
    if (error) {
        redirect(`/admin?error=${encodeURIComponent(error.message)}`);
    }

    revalidatePath("/admin");
    redirect("/admin?success=Block created successfully");
}

export async function toggleBlockActive(blockId: string, currentStatus: boolean) {
    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
        redirect("/login?error=You must be logged in to update a block");
    }

    if (!user) redirect("/login");

    const { error } = await supabase
        .from("blocks")
        .update({ is_active: !currentStatus })
        .eq("id", blockId)
        .eq("user_id", user.id); // RLS + explicit user ownership double check

    if (error) {
        redirect(`/admin?error=${encodeURIComponent(error.message)}`);
    }

    revalidatePath("/admin");
}

export async function deleteBlock(blockId: string) {
    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) redirect("/login");

    const { error } = await supabase
        .from("blocks")
        .delete()
        .eq("id", blockId)
        .eq("user_id", user.id);

    if (error) {
        redirect(`/admin?error=${encodeURIComponent(error.message)}`);
    }

    revalidatePath("/admin");
}
