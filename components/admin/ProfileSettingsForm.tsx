"use client";
import { updateProfileSettings } from "@/app/admin/actions";
import { useState } from "react";

const PRESET_COLORS = [
  { label: "🔵 Sapphire", value: "#2563EB" },
  { label: "🟢 Emerald", value: "#10B981" },
  { label: "🟣 Amethyst", value: "#8B5CF6" },
  { label: "🟡 Amber", value: "#F59E0B" },
  { label: "🔴 Crimson", value: "#E11D48" },
  { label: "⚫ Obsidian", value: "#0F172A" },
];

type AvailabilityStatus = "AVAILABLE" | "BUSY" | "OFFLINE";

type Profile = {
  theme_color?: string;
  full_name?: string;
  status?: AvailabilityStatus;
  bio?: string;
  avatar_url?: string;
  cover_image_url?: string;
  github_url?: string;
  x_url?: string;
  website_url?: string;
};

export default function ProfileSettingsForm({ profile }: { profile: Profile | null }) {
  const [color, setColor] = useState<string>(profile?.theme_color || "#2563EB");

  return (
    <section className="bg-white p-6 rounded-xl shadow-sm border space-y-4">
      <h2 className="text-xl font-bold text-gray-800">Public Profile Settings</h2>
      <form action={updateProfileSettings} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
            <input
              type="text"
              name="full_name"
              defaultValue={profile?.full_name || ""}
              required
              className="w-full border rounded-lg p-2 text-gray-900 bg-white border-gray-300"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Availability Status
            </label>
            <select
              name="status"
              defaultValue={profile?.status || "AVAILABLE"}
              className="w-full border rounded-lg p-2 text-gray-900 bg-white border-gray-300"
            >
              <option value="AVAILABLE">🟢 Available for Work</option>
              <option value="BUSY">🔴 Busy / Fully Booked</option>
              <option value="OFFLINE">⚪ Offline / On Vacation</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
          <textarea
            name="bio"
            defaultValue={profile?.bio || ""}
            rows={3}
            className="w-full border rounded p-2 text-gray-900"
            placeholder="Tell clients about your expertise..."
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Avatar Profile Photo URL
            </label>
            <input
              type="url"
              name="avatar_url"
              defaultValue={profile?.avatar_url || ""}
              placeholder="https://images.unsplash.com/..."
              className="w-full border rounded p-2 text-gray-900 text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Cover Banner Image URL
            </label>
            <input
              type="url"
              name="cover_image_url"
              defaultValue={profile?.cover_image_url || ""}
              placeholder="https://images.unsplash.com/..."
              className="w-full border rounded p-2 text-gray-900 text-sm"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">GitHub URL</label>
            <input
              type="url"
              name="github_url"
              defaultValue={profile?.github_url || ""}
              placeholder="https://github.com/..."
              className="w-full border rounded p-2 text-gray-900 text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">X/Twitter URL</label>
            <input
              type="url"
              name="x_url"
              defaultValue={profile?.x_url || ""}
              placeholder="https://x.com/..."
              className="w-full border rounded p-2 text-gray-900 text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Website URL</label>
            <input
              type="url"
              name="website_url"
              defaultValue={profile?.website_url || ""}
              placeholder="https://..."
              className="w-full border rounded p-2 text-gray-900 text-sm"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Public Accent Color
          </label>
          <div className="flex flex-wrap items-center gap-3">
            <input
              type="color"
              name="theme_color"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              className="h-10 w-16 cursor-pointer rounded border p-1"
            />
            <div className="flex flex-wrap gap-2">
              {PRESET_COLORS.map((preset) => (
                <button
                  key={preset.value}
                  type="button"
                  onClick={() => setColor(preset.value)}
                  className={`px-3 py-1 text-xs border rounded-full transition-all text-gray-700 ${
                    color === preset.value ? "ring-2 ring-blue-500 bg-gray-100" : "hover:bg-gray-50"
                  }`}
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="pt-2">
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded font-medium hover:bg-blue-700"
          >
            Save Profile Settings
          </button>
        </div>
      </form>
    </section>
  );
}
