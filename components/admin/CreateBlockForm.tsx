import { createBlock } from "@/app/admin/actions";

export default function CreateBlockForm() {
    return (
        <section className="bg-white p-6 rounded-lg shadow-sm border space-y-4">
            <h2 className="text-xl font-bold text-gray-800">Add Service Block</h2>
            <form action={createBlock} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Service Title</label>
                        <input name="title" required placeholder="e.g. 1-on-1 Consultation" className="w-full border rounded p-2 text-gray-900" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Price (USD)</label>
                        <input name="price_dollars" type="number" step="0.01" required placeholder="49.99" className="w-full border rounded p-2 text-gray-900" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                        <input name="category" required placeholder="Consulting" className="w-full border rounded p-2 text-gray-900" />
                    </div>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Optional Cover Image URL</label>
                    <input name="image_url" type="url" placeholder="https://example.com/cover.png" className="w-full border rounded p-2 text-gray-900" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <textarea name="description" rows={2} placeholder="What is included in this service?" className="w-full border rounded p-2 text-gray-900" />
                </div>
                <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded font-medium hover:bg-green-700">
                    + Add Service Block
                </button>
            </form>
        </section>
    );
}
