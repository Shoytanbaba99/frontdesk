"use client";

import { submitRequest } from "@/app/[username]/actions";
import { useState } from "react";

interface RequestModalProps {
  providerId: string;
  providerUsername?: string;
  blockId?: string;
  blockTitle?: string;
  themeColor?: string;
}

export default function RequestModal({
  providerId,
  providerUsername,
  blockId,
  blockTitle,
  themeColor,
}: RequestModalProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="px-4 py-2 text-white text-sm font-semibold rounded-lg shadow-sm transition hover:opacity-90"
        style={{ backgroundColor: themeColor }}
      >
        Request Service
      </button>

      {isOpen && (
        /* Modal Overlay & ESC Key Container */
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-md transition-all">
          <div className="bg-white rounded-xl max-w-lg w-full p-6 shadow-2xl relative space-y-4 animate-in zoom-in-95 duration-200 ease-out">
            <div className="flex justify-between items-center border-b pb-3">
              <h3 className="text-xl font-bold text-gray-900">
                Request: {blockTitle || "General Service"}
              </h3>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-gray-900 bg-gray-50 hover:bg-gray-100 h-8 w-8 rounded-full flex items-center justify-center transition-colors"
                aria-label="Close"
              >
                ✕
              </button>
            </div>

            <form action={submitRequest} className="space-y-4">
              <input type="hidden" name="provider_id" value={providerId} />
              {providerUsername && <input type="hidden" name="provider_username" value={providerUsername} />}
              {blockId && <input type="hidden" name="block_id" value={blockId} />}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Your Name</label>
                <input
                  name="client_name"
                  required
                  placeholder="Jane Doe"
                  className="w-full border rounded p-2 text-gray-900"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Your Email</label>
                <input
                  name="client_email"
                  type="email"
                  required
                  placeholder="jane@example.com"
                  className="w-full border rounded p-2 text-gray-900"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Project Details / Message
                </label>
                <textarea
                  name="message"
                  rows={3}
                  required
                  placeholder="Describe your request..."
                  className="w-full border rounded p-2 text-gray-900"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="px-4 py-2 border rounded text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-white font-medium rounded transition hover:opacity-90"
                  style={{ backgroundColor: themeColor }}
                >
                  Submit Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
