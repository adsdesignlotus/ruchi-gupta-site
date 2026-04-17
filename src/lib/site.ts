export const site = {
  name: "Ruchi Gupta",
  tagline: "Bharatanatyam · Cultural Ambassador · Guru",
  instituteName: "Kirti Natya Niketan",
  instituteNameLegal: "KIRTI NATYA NIKETAN ®",
  instituteTagline: "CENTER FOR CLASSICAL ARTS",
  instituteAddress: "H-5/53, SECTOR 11, ROHINI",
  email: "kirtinatyaniketan@gmail.com",
  /** Digits only, country code + number (no +), for wa.me / WhatsApp Web links */
  whatsappPhoneE164: "919999600584",
  whatsappDisplay: "+91 9999600584",
  artisticDirectorTitle: "ARTISTIC DIRECTOR",
  /** Public profile — Instagram Graph feed links here when API is configured */
  instagramProfileUrl: "https://www.instagram.com/ruchi_dancer_gupta/",
  instagramHandle: "@ruchi_dancer_gupta",
} as const;

const WHATSAPP_PREFILL =
  "Hello, I would like to connect and get more details";

/** Visitor → WhatsApp Web/App with prefilled enquiry (digits only, no +). */
export function whatsAppEnquiryHref(): string {
  return `https://wa.me/${site.whatsappPhoneE164}?text=${encodeURIComponent(WHATSAPP_PREFILL)}`;
}

/** mailto with subject + body for institute enquiries. */
export function instituteEnquiryMailtoHref(): string {
  const subject = "Enquiry - Kirti Natya Niketan";
  const body = "Hello, I would like to know more about...\n";
  return `mailto:${site.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

export const navItems = [
  { href: "/about", label: "About" },
  { href: "/performances", label: "Performances" },
  { href: "/institute", label: "Institute" },
  { href: "/events", label: "Events Hub" },
  { href: "/contact", label: "Contact" },
] as const;
