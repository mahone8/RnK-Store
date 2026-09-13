import React from 'react';
import { Link } from 'react-router-dom';
import { CATEGORY_BANNERS } from '../data/images';

export default function CategoryBanners() {
  return (
    <section className="max-w-6xl mx-auto px-4 py-14">
      <h2 className="text-2xl md:text-3xl font-bold text-center mb-8">Shop Our Collections</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {CATEGORY_BANNERS.map((cat) => (
          <Link
            key={cat.slug}
            to={`/shop?category=${cat.slug}`}
            className="relative rounded-xl overflow-hidden group h-64 md:h-72 block"
          >
            <img
              src={cat.image}
              alt={cat.name}
              className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
            <div className="absolute bottom-0 left-0 p-6">
              <h3 className="text-white text-2xl font-bold mb-2">{cat.name}</h3>
              <span className="inline-block bg-white text-brand text-sm font-semibold px-4 py-2 rounded group-hover:bg-brand-gold transition">
                Shop now
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
