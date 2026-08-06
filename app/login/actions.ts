"use server";
import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

const loginSchema = z.object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters long"),
});

const signupSchema = loginSchema.extend({
    username: z
        .string()
        .min(3, "Username must be at least 3 characters")
        .max(20, "Username must be at most 20 characters")
        .regex(/^[a-zA-Z0-9_]+$/, "Username can only contain letters, numbers, and underscores"),
});

export async function login(formData: FormData) {
    const rawData = {
        email: formData.get("email"),
        password: formData.get("password"),
    };

    const result = loginSchema.safeParse(rawData);

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
        username: formData.get("username"),
    };
    const result = signupSchema.safeParse(rawData);

    if (!result.success) {
        const firstError = result.error.issues[0].message;
        redirect(`/login?error=${encodeURIComponent(firstError)}`);
    }
    const supabase = await createClient();
    const { error } = await supabase.auth.signUp({
        email: result.data.email,
        password: result.data.password,
        options: {
            data: {
                username: result.data.username,
            },
        },
    });
    if (error) {
        redirect(`/login?error=${encodeURIComponent(error.message)}`);
    }
    revalidatePath("/", "layout");
    redirect(
        "/login?success=Account created successfully. Please check your email to verify your account.",
    );
}
