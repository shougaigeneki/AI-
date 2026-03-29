import React from 'react';

const ProductCard = ({ product }) => {
  return (
    <div className="glass-card p-6 product-card hover-glow h-full flex flex-col">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-xl font-bold text-white">{product.name}</h3>
        <span className="px-3 py-1 bg-white/10 rounded-full text-blue-300 text-sm font-semibold">
          ★ {product.rating}
        </span>
      </div>

      <div className="mb-4">
        <span className={`inline-block px-3 py-1 rounded text-sm font-bold ${
          product.judgment === '採用' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
        }`}>
          {product.judgment}
        </span>
      </div>

      <div className="space-y-4 flex-grow text-sm text-gray-300">
        <div>
          <p className="font-bold text-white mb-1 opacity-80">判定理由:</p>
          <p>{product.reason}</p>
        </div>
        
        <div>
          <p className="font-bold text-green-400 mb-1 opacity-80">メリット:</p>
          <p>{product.pros}</p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="font-bold text-red-400 mb-1 opacity-80">致命的な欠陥:</p>
            <p className="text-xs">{product.fatal_flaws}</p>
          </div>
          <div>
            <p className="font-bold text-orange-400 mb-1 opacity-80">サクラ度:</p>
            <p className="text-xs">{product.fake_review_risk}</p>
          </div>
        </div>
      </div>

      <div className="mt-6">
        <a
          href={product.amazon_url}
          target="_blank"
          rel="noopener noreferrer"
          className="block w-full text-center py-3 bg-gradient-to-r from-orange-500 to-yellow-600 text-white font-bold rounded-lg hover:from-orange-600 hover:to-yellow-700 transition-all shadow-lg"
        >
          Amazonでチェックする
        </a>
      </div>
    </div>
  );
};

export default ProductCard;
