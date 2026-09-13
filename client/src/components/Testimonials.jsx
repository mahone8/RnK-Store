import React from 'react';
import { TESTIMONIALS } from '../data/images';

export default function Testimonials() {
  return (
    <section className="max-w-6xl mx-auto px-4 py-14">
      <h2 className="text-2xl md:text-3xl font-bold text-center mb-10">What Our Customers Say</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5">
        {TESTIMONIALS.map((t) => (
          <div key={t.name} className="bg-white border border-gray-100 rounded-lg shadow-sm p-5">
            <div className="text-brand-gold mb-2">★★★★★</div>
            <p className="text-sm text-gray-600 mb-4">"{t.text}"</p>
            <p className="font-semibold text-sm">{t.name}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
