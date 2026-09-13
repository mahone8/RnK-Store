import React, { useState } from 'react';
import { WHATSAPP_CONTACTS, whatsappLink } from '../data/contacts';

const WhatsAppIcon = ({ className }) => (
  <svg viewBox="0 0 32 32" className={className} fill="currentColor" aria-hidden="true">
    <path d="M16.004 3C9.377 3 4 8.377 4 15.004c0 2.29.638 4.497 1.847 6.42L4 29l7.76-1.813a11.94 11.94 0 0 0 4.244.777h.004c6.627 0 12.004-5.377 12.004-12.004S22.63 3 16.004 3zm0 21.723h-.003a9.7 9.7 0 0 1-4.94-1.353l-.354-.21-4.605 1.076 1.09-4.49-.23-.366a9.68 9.68 0 0 1-1.49-5.376c0-5.354 4.358-9.712 9.716-9.712 2.596 0 5.036 1.012 6.87 2.848a9.65 9.65 0 0 1 2.844 6.868c0 5.354-4.358 9.715-9.898 9.715zm5.32-7.28c-.29-.146-1.722-.85-1.99-.947-.267-.098-.462-.146-.657.146-.194.292-.755.947-.926 1.14-.17.194-.34.219-.632.073-.291-.146-1.232-.454-2.347-1.448-.868-.774-1.454-1.73-1.625-2.022-.17-.292-.018-.45.128-.596.132-.13.291-.34.437-.51.146-.17.194-.292.291-.487.097-.194.048-.365-.024-.51-.073-.146-.657-1.583-.9-2.168-.237-.57-.478-.492-.657-.5l-.56-.01c-.194 0-.51.073-.777.365-.267.292-1.02.997-1.02 2.432 0 1.435 1.044 2.822 1.19 3.017.146.194 2.056 3.14 4.983 4.404.696.3 1.24.48 1.663.614.699.222 1.335.19 1.838.115.561-.084 1.722-.704 1.965-1.383.243-.68.243-1.262.17-1.383-.073-.122-.267-.194-.559-.34z"/>
  </svg>
);

export default function WhatsAppButton() {
  const [open, setOpen] = useState(false);

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col items-end gap-3">
      {open && (
        <div className="bg-white rounded-lg shadow-xl border border-gray-100 w-64 overflow-hidden">
          <div className="bg-[#25D366] text-white px-4 py-3 flex items-center justify-between">
            <span className="font-semibold text-sm">Chat with R&amp;K</span>
            <button onClick={() => setOpen(false)} aria-label="Close" className="text-white/90 hover:text-white">✕</button>
          </div>
          <div className="divide-y">
            {WHATSAPP_CONTACTS.map((c) => (
              <a
                key={c.number}
                href={whatsappLink(c.number)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition"
              >
                <WhatsAppIcon className="w-6 h-6 text-[#25D366] shrink-0" />
                <div>
                  <p className="text-sm font-medium text-brand">{c.label}</p>
                  <p className="text-xs text-gray-500">{c.display}</p>
                </div>
              </a>
            ))}
          </div>
        </div>
      )}

      <button
        onClick={() => setOpen((v) => !v)}
        aria-label="Chat with us on WhatsApp"
        className="bg-[#25D366] hover:bg-[#1ebe5b] text-white rounded-full w-14 h-14 flex items-center justify-center shadow-lg transition transform hover:scale-105"
      >
        <WhatsAppIcon className="w-8 h-8" />
      </button>
    </div>
  );
}
