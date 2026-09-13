import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import ProductCard from '../components/ProductCard';
import HeroSlideshow from '../components/HeroSlideshow';
import CategoryBanners from '../components/CategoryBanners';
import Features from '../components/Features';
import Testimonials from '../components/Testimonials';
import Newsletter from '../components/Newsletter';

export default function Home() {
  const [featured, setFeatured] = useState([]);

  useEffect(() => {
    api.get('/products?featured=true&limit=8').then(({ data }) => setFeatured(data.products));
  }, []);

  return (
    <div>
      <HeroSlideshow />

      <section className="max-w-6xl mx-auto px-4 py-14">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-8">Best Sellers</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
          {featured.map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
        {featured.length === 0 && (
          <p className="text-center text-gray-400">No featured products yet — check back soon.</p>
        )}
      </section>

      <CategoryBanners />
      <Features />
      <Testimonials />
      <Newsletter />
    </div>
  );
}
