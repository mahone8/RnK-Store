import React from 'react';
import { Link } from 'react-router-dom';
import { WHATSAPP_CONTACTS, whatsappLink } from '../data/contacts';

export default function Footer() {
  return (
    <footer className="bg-brand text-gray-300 mt-0">
      <div className="max-w-6xl mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-4 gap-10">
        <div>
          <img src="/logo-full.png" alt="R&K" className="h-24 w-auto object-contain mb-3 -ml-2" />
          <p className="text-sm">
            R&amp;K is a premium accessories brand, known for exceptional wallets, bracelets, caps
            and glasses, with a wide range of variety.
          </p>
          <div className="flex gap-4 mt-4 text-lg">
            <a href="#" aria-label="Facebook" className="hover:text-brand-gold transition">Facebook</a>
          </div>
        </div>

        <div>
          <h4 className="font-semibold text-white mb-3">Shop</h4>
          <ul className="text-sm space-y-2">
            <li><Link to="/shop?category=wallets" className="hover:text-brand-gold">Wallets</Link></li>
            <li><Link to="/shop?category=bracelets" className="hover:text-brand-gold">Bracelets</Link></li>
            <li><Link to="/shop?category=caps" className="hover:text-brand-gold">Caps</Link></li>
            <li><Link to="/shop?category=glasses" className="hover:text-brand-gold">Glasses</Link></li>
            <li><Link to="/shop" className="hover:text-brand-gold">All Products</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold text-white mb-3">About</h4>
          <ul className="text-sm space-y-2">
            <li><a href="#" className="hover:text-brand-gold">About Us</a></li>
            <li><a href="#" className="hover:text-brand-gold">Contact</a></li>
            <li><a href="#" className="hover:text-brand-gold">Refund Policy</a></li>
            <li><a href="#" className="hover:text-brand-gold">Store Locator</a></li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold text-white mb-3">Contact Us</h4>
          <ul className="text-sm space-y-2">
            <li>📍 Faisalabad, Punjab, Pakistan</li>
            {WHATSAPP_CONTACTS.map((c) => (
              <li key={c.number}>
                💬{' '}
                <a href={whatsappLink(c.number)} target="_blank" rel="noopener noreferrer" className="hover:text-brand-gold">
                  {c.label}: {c.display}
                </a>
              </li>
            ))}
            <li>✉️ support@rnk.com</li>
          </ul>
          <p className="text-xs text-gray-500 mt-4">Payment methods: Cash on Delivery, Card</p>
        </div>
      </div>

      <div className="border-t border-gray-700 text-center text-xs py-4">
        © {new Date().getFullYear()} R&amp;K. All rights reserved. &nbsp;|&nbsp; Powered by{' '}
        <a
          href="https://levelose.tech"
          target="_blank"
          rel="noopener noreferrer"
          className="text-brand-gold font-medium hover:underline"
        >
          levelose.tech
        </a>
      </div>
    </footer>
  );
}
