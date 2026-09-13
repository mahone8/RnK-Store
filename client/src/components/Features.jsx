import React from 'react';

const features = [
  { icon: '✨', title: 'Premium Quality', text: 'All our products are made with premium materials and finished to perfection.' },
  { icon: '🚚', title: 'Fast & Reliable Delivery', text: 'We offer quick, tracked delivery on every order, nationwide.' },
  { icon: '⭐', title: 'Thousands of Happy Customers', text: 'Loved by thousands of customers for our quality and service.' },
  { icon: '💰', title: 'Fair, Honest Pricing', text: 'Premium accessories at prices that make sense — no gimmicks.' },
];

export default function Features() {
  return (
    <section className="bg-gray-50 py-14">
      <div className="max-w-6xl mx-auto px-4">
        <p className="text-center text-sm uppercase tracking-widest text-brand-gold font-semibold mb-2">What is R&amp;K</p>
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-10">Bringing Premium Accessories To You</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {features.map((f) => (
            <div key={f.title} className="text-center">
              <div className="text-4xl mb-3">{f.icon}</div>
              <h3 className="font-semibold mb-1">{f.title}</h3>
              <p className="text-sm text-gray-500">{f.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
