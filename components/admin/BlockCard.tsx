import { deleteBlock, toggleBlockStatus } from "@/app/admin/actions";
import Image from "next/image";

export interface BlockProps {
    id: string;
    title: string;
    description: string | null;
    price_cents: number;
    category: string;
    image_url?: string | null;
    is_active: boolean;
}

export default function BlockCard({ block }: { block: BlockProps }) {
    return (
        <div className="flex justify-between items-center border p-4 rounded-lg hover:border-gray-300 bg-white shadow-sm">
            <div className="flex items-center gap-4">
                {block.image_url && (
                    <div className="relative w-14 h-14 rounded-lg overflow-hidden border shrink-0 bg-gray-100">
                        <Image
                            src={block.image_url}
                            alt={block.title}
                            fill
                            className="object-cover"
                        />
                    </div>
                )}
                <div>
                    <div className="flex items-center gap-2">
                        <h3 className="font-bold text-lg text-gray-900">{block.title}</h3>
                        <span className="text-xs bg-gray-100 px-2.5 py-0.5 rounded-full font-medium text-gray-600">
                            {block.category}
                        </span>
                        {!block.is_active ? (
                            <span className="text-xs bg-yellow-100 text-yellow-800 border border-yellow-200 px-2 py-0.5 rounded font-semibold">
                                ⏸️ Paused (Hidden)
                            </span>
                        ) : (
                            <span className="text-xs bg-emerald-100 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded font-semibold">
                                Live
                            </span>
                        )}
                    </div>
                    {block.description && (
                        <p className="text-sm text-gray-600 mt-1 line-clamp-2">{block.description}</p>
                    )}
                    <p className="text-sm font-extrabold text-blue-600 mt-1">
                        ${(block.price_cents / 100).toFixed(2)}
                    </p>
                </div>
            </div>
            <div className="flex gap-2">
                <form action={toggleBlockStatus}>
                    <input type="hidden" name="block_id" value={block.id} />
                    <input type="hidden" name="current_status" value={String(block.is_active)} />
                    <button
                        type="submit"
                        className={`px-3 py-1.5 text-xs border rounded font-semibold transition ${
                            block.is_active
                                ? "border-gray-300 text-gray-700 hover:bg-gray-100"
                                : "border-green-300 text-green-700 bg-green-50 hover:bg-green-100"
                        }`}
                    >
                        {block.is_active ? "Pause Offering" : "Activate Offering"}
                    </button>
                </form>

                <form action={deleteBlock}>
                    <input type="hidden" name="block_id" value={block.id} />
                    <button
                        type="submit"
                        className="px-3 py-1.5 text-xs bg-red-50 text-red-600 border border-red-200 rounded font-semibold hover:bg-red-100 transition"
                    >
                        Delete
                    </button>
                </form>
            </div>
        </div>
    );
}
