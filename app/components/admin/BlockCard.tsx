import { deleteBlock, toggleBlockActive } from "@/app/admin/actions";

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
        <div className="flex justify-between items-center border p-4 rounded hover:border-gray-300 bg-white">
            <div className="flex items-center gap-4">
                {block.image_url && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                        src={block.image_url}
                        alt={block.title}
                        className="w-12 h-12 rounded object-cover border"
                    />
                )}
                <div>
                    <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-lg text-gray-900">{block.title}</h3>
                        <span className="text-xs bg-gray-100 px-2 py-0.5 rounded text-gray-600">
                            {block.category}
                        </span>
                        {!block.is_active && (
                            <span
                                className="text-xs bg-yellow-100 text-yellow-800 px-2 py-0.5
  rounded"
                            >
                                Hidden
                            </span>
                        )}
                    </div>
                    {block.description && (
                        <p className="text-sm text-gray-600 mt-1">{block.description}</p>
                    )}
                    <p className="text-sm font-bold text-blue-600 mt-1">
                        ${(block.price_cents / 100).toFixed(2)}
                    </p>
                </div>
            </div>
            <div className="flex gap-2">
                <form action={toggleBlockActive.bind(null, block.id, block.is_active)}>
                    <button
                        type="submit"
                        className="px-3 py-1 text-xs border rounded text-gray-700 hover:bg-gray-50"
                    >
                        {block.is_active ? "Hide" : "Show"}
                    </button>
                </form>
                <form action={deleteBlock.bind(null, block.id)}>
                    <button
                        type="submit"
                        className="px-3 py-1 text-xs bg-red-50 text-red-600 border border-red-200 rounded
  hover:bg-red-100"
                    >
                        Delete
                    </button>
                </form>
            </div>
        </div>
    );
}
