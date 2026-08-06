import { updateProfileSettings } from "@/app/admin/actions";

export default function ProfileSettingsForm({
    status,
    themeColor,
}: {
    status?: string;
    themeColor?: string;
}) {
    return (
        <section className="bg-white p-6 rounded-lg shadow-sm border space-y-4">
            <h2 className="text-xl font-bold text-gray-800">Status & Brand Color</h2>
            <form
                action={updateProfileSettings}
                className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end"
            >
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Availability Status
                    </label>
                    <select
                        name="status"
                        defaultValue={status || "AVAILABLE"}
                        className="w-full border rounded p-2 text-gray-900"
                    >
                        <option value="AVAILABLE">🟢 Available for Work</option>
                        <option value="BUSY">🔴 Busy / Fully Booked</option>
                        <option value="OFFLINE">⚪ Offline / On Vacation</option>
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Public Accent Color
                    </label>
                    <div className="flex items-center gap-2">
                        <input
                            type="color"
                            name="theme_color"
                            defaultValue={themeColor || "#3B82F6"}
                            className="h-10 w-16 cursor-pointer rounded border p-1"
                        />
                        <span className="text-xs text-gray-500 font-mono">
                            {themeColor || "#3B82F6"}
                        </span>
                    </div>
                </div>

                <button
                    type="submit"
                    className="bg-blue-600 text-white px-4 py-2 rounded font-medium hover:bg-blue-700"
                >
                    Save Profile Settings
                </button>
            </form>
        </section>
    );
}
