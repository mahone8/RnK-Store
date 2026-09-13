// WhatsApp contact numbers for the store (country code + number, no + or spaces)
export const WHATSAPP_CONTACTS = [
  { label: 'Sales', number: '923480165169', display: '+92 348 0165169' },
  { label: 'Support', number: '923017989770', display: '+92 301 7989770' },
];

export const DEFAULT_WHATSAPP_MESSAGE = "Hi R&K! I'd like to ask about your products.";

export function whatsappLink(number, message = DEFAULT_WHATSAPP_MESSAGE) {
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}
