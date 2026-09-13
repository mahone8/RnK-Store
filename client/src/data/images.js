// Real product photography (Unsplash) used across the storefront
// for hero banners and category tiles.
export const IMAGES = {
  wallet1: 'https://images.unsplash.com/photo-1579014134953-1580d7f123f3?auto=format&fit=crop&w=1200&q=80',
  wallet2: 'https://images.unsplash.com/photo-1570431118100-c24a54fdeab0?auto=format&fit=crop&w=1200&q=80',
  bracelet1: 'https://images.unsplash.com/photo-1534976618208-4833d5b57d08?auto=format&fit=crop&w=1200&q=80',
  bracelet2: 'https://images.unsplash.com/photo-1602527428055-a2526fabdc9f?auto=format&fit=crop&w=1200&q=80',
  cap1: 'https://images.unsplash.com/photo-1521369909029-2afed882baee?auto=format&fit=crop&w=1200&q=80',
  cap2: 'https://images.unsplash.com/photo-1691256676359-20e5c6d4bc92?auto=format&fit=crop&w=1200&q=80',
  glasses1: 'https://images.unsplash.com/photo-1523884156331-22cc4f5df98d?auto=format&fit=crop&w=1200&q=80',
  glasses2: 'https://images.unsplash.com/photo-1470526446583-d0fe2363d8cb?auto=format&fit=crop&w=1200&q=80',
};

export const HERO_SLIDES = [
  {
    image: IMAGES.cap1,
    title: 'New Season, New Style',
    subtitle: 'Premium caps, wallets, bracelets & glasses',
  },
  {
    image: IMAGES.wallet2,
    title: 'Everyday Carry, Elevated',
    subtitle: 'Genuine leather wallets built to last',
  },
  {
    image: IMAGES.glasses2,
    title: 'Shades That Turn Heads',
    subtitle: 'Aviators, classics & everything in between',
  },
];

export const CATEGORY_BANNERS = [
  { name: 'Wallets', slug: 'wallets', image: IMAGES.wallet1 },
  { name: 'Bracelets', slug: 'bracelets', image: IMAGES.bracelet2 },
  { name: 'Caps', slug: 'caps', image: IMAGES.cap2 },
  { name: 'Glasses', slug: 'glasses', image: IMAGES.glasses1 },
];

export const TESTIMONIALS = [
  { name: 'Ayesha Malik', text: 'The leather wallet quality is amazing! Feels premium and the stitching is perfect.' },
  { name: 'Bilal Ahmed', text: 'Ordered a cap and sunglasses together — fast delivery and exactly as pictured.' },
  { name: 'Sara Khan', text: 'Best bracelets I have bought online. Great price for the quality you get.' },
  { name: 'Hamza Tariq', text: 'Customer service was super responsive and the packaging was really nice.' },
];
