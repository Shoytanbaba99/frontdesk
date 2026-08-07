"use client";
import RequestModal from "@/components/public/RequestModal";
import Image from "next/image";
import { useMemo, useState } from "react";

type ServiceBlock = {
  id: string;
  title: string;
  description?: string | null;
  category: string;
  image_url?: string | null;
  price_cents: number;
};

export default function ServicesList({
  blocks,
  profileId,
  providerUsername,
  themeColor,
}: {
  blocks: ServiceBlock[];
  profileId: string;
  providerUsername?: string;
  themeColor: string;
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const categories = useMemo(() => {
    const cats = new Set(blocks.map((b) => b.category));
    return ["All", ...Array.from(cats)];
  }, [blocks]);

  const filteredBlocks = useMemo(() => {
    return blocks.filter((block) => {
      const matchesSearch =
        block.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (block.description && block.description.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesCategory = selectedCategory === "All" || block.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [blocks, searchQuery, selectedCategory]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-all shadow-sm ${
                selectedCategory === cat
                  ? "text-white"
                  : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-200"
              }`}
              style={
                selectedCategory === cat
                  ? { backgroundColor: themeColor, borderColor: themeColor }
                  : {}
              }
            >
              {cat}
            </button>
          ))}
        </div>
        <div className="w-full md:w-64 relative">
          <input
            type="text"
            placeholder="Search services..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:border-transparent transition-all"
            style={{ outlineColor: themeColor }}
          />
          <svg
            className="absolute left-3 top-2.5 h-4 w-4 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
      </div>

      {filteredBlocks.length === 0 ? (
        <div className="bg-white rounded-xl p-8 text-center text-gray-500 border shadow-sm">
          No active services match your search.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredBlocks.map((block) => (
            <div
              key={block.id}
              className="bg-white rounded-xl p-6 border shadow-sm hover:shadow-md transition flex flex-col justify-between space-y-4 relative group overflow-hidden"
            >
              <div className="space-y-2">
                {block.image_url && (
                  <div className="relative w-full h-40 rounded-lg overflow-hidden bg-gray-100 mb-3">
                    <Image
                      src={block.image_url}
                      alt={block.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 50vw"
                      className="object-cover transition-transform group-hover:scale-105"
                    />
                  </div>
                )}

                <div className="flex justify-between items-start">
                  <h3 className="font-bold text-lg text-gray-900">{block.title}</h3>
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-gray-100 text-gray-600 border border-gray-200">
                    {block.category}
                  </span>
                </div>

                {block.description && (
                  <p className="text-sm text-gray-600 line-clamp-3">{block.description}</p>
                )}
              </div>

              <div className="flex justify-between items-center border-t pt-4">
                <span className="text-xl font-extrabold text-gray-900">
                  ${(block.price_cents / 100).toFixed(2)}
                </span>

                <RequestModal
                  providerId={profileId}
                  providerUsername={providerUsername}
                  blockId={block.id}
                  blockTitle={block.title}
                  themeColor={themeColor}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
