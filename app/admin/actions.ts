"use server";
import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

const profileUpdateSchema = z.object({
    full_name: z.string().min(1, "Name is required").optional().or(z.literal("")),
    status: z.enum(["AVAILABLE", "BUSY", "OFFLINE"]),
    theme_color: z.string().regex(/^#([0-9A-Fa-f]{6})$/, "Invalid hex color code"),
    bio: z.string().optional(),
    avatar_url: z.string().url().optional().or(z.literal("")),
    cover_image_url: z.string().url().optional().or(z.literal("")),
    github_url: z.string().url().optional().or(z.literal("")),
    x_url: z.string().url().optional().or(z.literal("")),
    website_url: z.string().url().optional().or(z.literal("")),
});

const blockSchema = z.object({
    title: z
        .string()
        .min(2, "Title must be at least 2 characters long")
        .max(50, "Title must be at most 50 characters long"),
    description: z.string().optional(),
    price_dollars: z.coerce.number().min(0, "Price must be a positive number"),
    category: z.string().min(1, "Category must be at least 1 character long"),
    image_url: z.string().url("Invalid image URL").optional().or(z.literal("")),
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
        full_name: formData.get("full_name") || "",
        bio: formData.get("bio") || "",
        avatar_url: formData.get("avatar_url") || "",
        cover_image_url: formData.get("cover_image_url") || "",
        github_url: formData.get("github_url") || "",
        x_url: formData.get("x_url") || "",
        website_url: formData.get("website_url") || "",
        status: formData.get("status"),
        theme_color: formData.get("theme_color"),
    });

    if (!result.success) {
        redirect(`/admin?error=${encodeURIComponent(result.error.issues[0].message)}`);
    }

    const { error } = await supabase
        .from("profiles")
        .update({
            full_name: result.data.full_name,
            bio: result.data.bio || null,
            avatar_url: result.data.avatar_url || null,
            cover_image_url: result.data.cover_image_url || null,
            github_url: result.data.github_url || null,
            x_url: result.data.x_url || null,
            website_url: result.data.website_url || null,
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
    const imageUrl = result.data.image_url && result.data.image_url.trim() !== "" ? result.data.image_url : null;

    const { error } = await supabase.from("blocks").insert({
        user_id: user.id,
        title: result.data.title,
        description: result.data.description || null,
        price_cents: price_cents,
        category: result.data.category,
        image_url: imageUrl,
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

export async function deleteBlock(blockIdOrFormData: string | FormData) {
    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        redirect("/login?error=You must be logged in to delete blocks");
    }

    const blockId = typeof blockIdOrFormData === "string"
        ? blockIdOrFormData
        : (blockIdOrFormData.get("block_id") as string);

    const { error } = await supabase
        .from("blocks")
        .delete()
        .eq("id", blockId)
        .eq("user_id", user.id);

    if (error) {
        redirect(`/admin?error=${encodeURIComponent(error.message)}`);
    }

    revalidatePath("/admin");
    redirect("/admin?success=Block deleted successfully");
}

export async function toggleBlockStatus(formData: FormData) {
    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) redirect("/login");

    const blockId = formData.get("block_id") as string;
    const currentStatus = formData.get("current_status") === "true";

    const { error } = await supabase
        .from("blocks")
        .update({ is_active: !currentStatus, updated_at: new Date().toISOString() })
        .eq("id", blockId)
        .eq("user_id", user.id);

    if (error) {
        redirect(`/admin?error=${encodeURIComponent(error.message)}`);
    }

    revalidatePath("/admin");
    redirect("/admin?success=Block status updated");
}
