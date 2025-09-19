"use client";

import { Dialog } from "@headlessui/react";
import { X } from "lucide-react";

interface TrailerModalProps {
  isOpen: boolean;
  onClose: () => void;
  trailerKey: string;
}

export function TrailerModal({ isOpen, onClose, trailerKey }: TrailerModalProps) {
  return (
    <Dialog open={isOpen} onClose={onClose} className="fixed inset-0 z-50">
      <div className="fixed inset-0 bg-black/70" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="w-full max-w-3xl aspect-video bg-black relative">
          <button
            onClick={onClose}
            className="absolute top-2 right-2 text-white p-1 z-10"
          >
            <X />
          </button>
          <iframe
            width="100%"
            height="100%"
            src={`https://www.youtube.com/embed/${trailerKey}?autoplay=1`}
            title="Trailer"
            frameBorder="0"
            allow="autoplay; fullscreen"
            allowFullScreen
          />
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}
