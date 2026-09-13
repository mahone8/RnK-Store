-- R&K Seed Data
-- Developer: levelose.tech
-- Prices are in PKR (Pakistani Rupees)

-- Default admin user
-- Email: admin@rnk.com | Password: Admin@123
-- (password_hash below is a placeholder — regenerate it, see README "Important: Fix the Admin Password Hash")
INSERT INTO users (name, email, password_hash, role)
VALUES ('R&K Admin', 'admin@rnk.com', '$2b$10$k1V5Q2wq0m1v8s6E8gQeCePzY0GdVYVYVQe0Z1i8XlY0m9m5U8v2K', 'admin');

-- Categories
INSERT INTO categories (name, slug, description) VALUES
('Wallets', 'wallets', 'Premium leather and fabric wallets for everyday carry'),
('Bracelets', 'bracelets', 'Handcrafted bracelets in leather, beads and metal'),
('Caps', 'caps', 'Trendy caps and snapbacks for every style'),
('Glasses', 'glasses', 'Sunglasses and eyewear for men and women');

-- Products (real product photography via Unsplash, prices in PKR)
INSERT INTO products (category_id, name, slug, description, price, compare_at_price, stock, sku, image_url, is_featured) VALUES
(1, 'Classic Leather Bifold Wallet', 'classic-leather-bifold-wallet', 'A genuine leather bifold wallet with six card slots, a clear ID window and a coin pocket. Hand-stitched edges and a slim profile make it comfortable in any pocket, while the full-grain leather develops a rich patina over time.', 2499, 3499, 50, 'RK-WAL-001', 'https://images.unsplash.com/photo-1579014134953-1580d7f123f3?auto=format&fit=crop&w=800&q=80', TRUE),
(1, 'Slim Grey Leather Wallet', 'slim-grey-leather-wallet', 'An ultra-slim, RFID-blocking wallet made from premium grey leather. Holds up to 8 cards plus cash, without adding bulk to your pocket — built for the everyday minimalist.', 2999, NULL, 40, 'RK-WAL-002', 'https://images.unsplash.com/photo-1570431118100-c24a54fdeab0?auto=format&fit=crop&w=800&q=80', FALSE),
(2, 'Braided Leather Bracelet', 'braided-leather-bracelet', 'A handmade braided leather bracelet finished with a brushed steel clasp. Adjustable fit, water-resistant leather, and a versatile look that pairs with both casual and formal outfits.', 899, NULL, 80, 'RK-BRC-001', 'https://images.unsplash.com/photo-1534976618208-4833d5b57d08?auto=format&fit=crop&w=800&q=80', TRUE),
(2, 'Beaded Charm Bracelet', 'beaded-charm-bracelet', 'A natural stone beaded bracelet with a decorative charm accent. Lightweight, stretch-fit design that comfortably suits most wrist sizes.', 749, 999, 60, 'RK-BRC-002', 'https://images.unsplash.com/photo-1602527428055-a2526fabdc9f?auto=format&fit=crop&w=800&q=80', FALSE),
(3, 'Classic Grey Snapback Cap', 'classic-grey-snapback-cap', 'An adjustable snapback cap in soft, brushed cotton with a structured crown and flat brim. A wardrobe staple that goes with everything.', 1499, NULL, 70, 'RK-CAP-001', 'https://images.unsplash.com/photo-1521369909029-2afed882baee?auto=format&fit=crop&w=800&q=80', TRUE),
(3, 'White Sport Cap', 'white-sport-cap', 'A low-profile white cotton cap with a curved brim and breathable eyelets. One size fits most, with a rear strap for adjustment.', 1299, NULL, 55, 'RK-CAP-002', 'https://images.unsplash.com/photo-1691256676359-20e5c6d4bc92?auto=format&fit=crop&w=800&q=80', FALSE),
(4, 'Classic Black Sunglasses', 'classic-black-sunglasses', 'Polarized sunglasses with UV400 protection and a matte black frame. Reduces glare while keeping a clean, understated look that works for everyday wear.', 1799, 2299, 45, 'RK-GLS-001', 'https://images.unsplash.com/photo-1523884156331-22cc4f5df98d?auto=format&fit=crop&w=800&q=80', TRUE),
(4, 'Gold Aviator Sunglasses', 'gold-aviator-sunglasses', 'Vintage-inspired aviator sunglasses with a gold-tone frame and gradient lenses. A timeless silhouette with full UV protection.', 1599, NULL, 35, 'RK-GLS-002', 'https://images.unsplash.com/photo-1470526446583-d0fe2363d8cb?auto=format&fit=crop&w=800&q=80', FALSE);
