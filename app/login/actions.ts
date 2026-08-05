"use server";
import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

const authSchema = z.object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters long"),
});

export async function login(formData: FormData) {
    const rawData = {
        email: formData.get("email"),
        password: formData.get("password"),
    };

    const result = authSchema.safeParse(rawData);

    if (!result.success) {
        redirect("/login?error=Invalid email or password");
    }
    const supabase = await createClient();
    const { error } = await supabase.auth.signInWithPassword(result.data);
    if (error) {
        redirect("/login?error=Invalid email or password");
    }
    revalidatePath("/", "layout");
    redirect("/admin");
}

export async function signup(formData: FormData) {
    const rawData = {
        email: formData.get("email"),
        password: formData.get("password"),
    };
    const result = authSchema.safeParse(rawData);

    if (!result.success) {
        redirect("/login?error=Invalid email or password");
    }
    const supabase = await createClient();
    const { error } = await supabase.auth.signUp(result.data);
    if (error) {
        redirect(`/login?error=${encodeURIComponent(error.message)}`);
    }
    revalidatePath("/", "layout");
    redirect(
        "/login?success=Account created successfully. Please check your email to verify your account.",
    );
}
