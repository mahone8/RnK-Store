import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../api/axios';
import ProductCard from '../components/ProductCard';

const categories = [
  { name: 'All', slug: '' },
  { name: 'Wallets', slug: 'wallets' },
  { name: 'Bracelets', slug: 'bracelets' },
  { name: 'Caps', slug: 'caps' },
  { name: 'Glasses', slug: 'glasses' },
];

export default function Shop() {
  const [searchParams, setSearchParams] = useSearchParams();
  const category = searchParams.get('category') || '';
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const limit = 12;

  useEffect(() => {
    const params = { page, limit };
    if (category) params.category = category;
    if (search) params.search = search;
    api.get('/products', { params }).then(({ data }) => {
      setProducts(data.products);
      setTotal(data.total);
    });
  }, [category, search, page]);

  const totalPages = Math.ceil(total / limit) || 1;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-4 justify-between mb-6">
        <div className="flex gap-2 flex-wrap">
          {categories.map((c) => (
            <button
              key={c.slug}
              onClick={() => { setSearchParams(c.slug ? { category: c.slug } : {}); setPage(1); }}
              className={`px-4 py-1.5 rounded-full text-sm border ${
                category === c.slug ? 'bg-brand text-white border-brand' : 'border-gray-300 hover:bg-gray-100'
              }`}
            >
              {c.name}
            </button>
          ))}
        </div>
        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          className="border border-gray-300 rounded px-3 py-1.5 text-sm w-full md:w-64"
        />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
        {products.map((p) => <ProductCard key={p.id} product={p} />)}
      </div>
      {products.length === 0 && <p className="text-center text-gray-400 mt-10">No products found.</p>}

      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-8">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              onClick={() => setPage(p)}
              className={`w-8 h-8 rounded ${page === p ? 'bg-brand text-white' : 'bg-gray-100 hover:bg-gray-200'}`}
            >
              {p}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
