import React, { useState } from 'react';

export default function Newsletter() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setEmail('');
  };

  return (
    <section className="bg-brand text-white py-14">
      <div className="max-w-xl mx-auto px-4 text-center">
        <h2 className="text-2xl font-bold mb-2">Subscribe to Our Emails</h2>
        <p className="text-gray-300 text-sm mb-6">Be the first to know about new collections and exclusive offers.</p>
        {submitted ? (
          <p className="text-brand-gold font-medium">Thanks for subscribing!</p>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 justify-center">
            <input
              type="email"
              required
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="px-4 py-3 rounded text-black w-full sm:w-72"
            />
            <button className="bg-brand-gold text-black px-6 py-3 rounded font-semibold hover:opacity-90">
              Subscribe
            </button>
          </form>
        )}
      </div>
    </section>
  );
}
