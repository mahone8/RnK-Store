import React from 'react';
import { Link } from 'react-router-dom';
import { formatPKR } from '../utils/currency';
import { resolveImage } from '../utils/image';
import { truncate } from '../utils/text';

export default function ProductCard({ product }) {
  const onSale = !!product.compare_at_price && Number(product.compare_at_price) > Number(product.price);

  return (
    <Link to={`/product/${product.slug}`} className="group block bg-white rounded-lg shadow hover:shadow-lg transition overflow-hidden">
      <div className="relative aspect-square bg-gray-100 overflow-hidden">
        {onSale && (
          <span className="absolute top-2 left-2 z-10 bg-red-600 text-white text-[10px] font-bold px-2 py-1 rounded">
            SALE
          </span>
        )}
        {product.image_url ? (
          <img
            src={resolveImage(product.image_url)}
            alt={product.name}
            loading="lazy"
            className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">No image</div>
        )}
      </div>
      <div className="p-3">
        <p className="text-xs uppercase text-gray-400">{product.category_name}</p>
        <h3 className="font-medium text-brand truncate">{product.name}</h3>
        {product.description && (
          <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">{truncate(product.description, 70)}</p>
        )}
        <div className="flex items-center gap-2 mt-1">
          <span className="font-bold text-brand-gold">{formatPKR(product.price)}</span>
          {onSale && (
            <span className="text-xs text-gray-400 line-through">{formatPKR(product.compare_at_price)}</span>
          )}
        </div>
      </div>
    </Link>
  );
}
