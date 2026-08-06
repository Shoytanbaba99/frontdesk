import { login, signup } from "./actions";

export default async function LoginPage({
    searchParams,
}: {
    searchParams: Promise<{ error?: string; success?: string }>;
}) {
    const { error, success } = await searchParams;

    return (
        <main className="flex min-h-screen items-center justify-center bg-gray-100 p-4">
            <form className="w-full max-w-sm space-y-4 rounded-lg bg-white p-6 shadow-md">
                <h1 className="text-2xl font-bold text-center text-gray-800">FrontDesk Auth</h1>

                {error && (
                    <div className="rounded border border-red-400 bg-red-50 p-3 text-sm text-red-700">
                        {error}
                    </div>
                )}

                {success && (
                    <div className="rounded border border-green-400 bg-green-50 p-3 text-sm text-green-700">
                        {success}
                    </div>
                )}

                <div>
                    <label
                        htmlFor="username"
                        className="mb-1 block text-sm font-medium text-gray-700"
                    >
                        Username (for signup)
                    </label>
                    <input
                        id="username"
                        name="username"
                        type="text"
                        className="w-full rounded border border-gray-300 px-3 py-2 text-gray-900 focus:outline-none focus:ring-2
  focus:ring-blue-500"
                        placeholder="alex_photo"
                    />
                </div>

                <div>
                    <label htmlFor="email" className="mb-1 block text-sm font-medium text-gray-700">
                        Email
                    </label>
                    <input
                        id="email"
                        name="email"
                        type="email"
                        required
                        className="w-full rounded border border-gray-300 px-3 py-2 text-gray-900 focus:outline-none focus:ring-2
  focus:ring-blue-500"
                        placeholder="provider@example.com"
                    />
                </div>

                <div>
                    <label
                        htmlFor="password"
                        className="mb-1 block text-sm font-medium text-gray-700"
                    >
                        Password
                    </label>
                    <input
                        id="password"
                        name="password"
                        type="password"
                        required
                        className="w-full rounded border border-gray-300 px-3 py-2 text-gray-900 focus:outline-none focus:ring-2
  focus:ring-blue-500"
                        placeholder="••••••••"
                    />
                </div>

                <div className="flex gap-2 pt-2">
                    <button
                        formAction={login}
                        className="flex-1 rounded bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700 transition"
                    >
                        Log In
                    </button>

                    <button
                        formAction={signup}
                        className="flex-1 rounded bg-green-600 px-4 py-2 font-medium text-white hover:bg-green-700 transition"
                    >
                        Sign Up
                    </button>
                </div>
            </form>
        </main>
    );
}
