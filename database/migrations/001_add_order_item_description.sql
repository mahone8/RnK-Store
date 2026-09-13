-- Run this if you already created the database before product descriptions
-- were added to order history. Safe to run once; skip if you're setting up
-- the database fresh from schema.sql (it already includes this column).
ALTER TABLE order_items ADD COLUMN IF NOT EXISTS product_description TEXT;
