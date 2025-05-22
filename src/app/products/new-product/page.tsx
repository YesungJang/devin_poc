import React from 'react';
import TranslateButton from '@/widgets/translateButton';

export default async function NewProductPage() {
  const productData = {
    id: 'new-product',
    name: '新しい製品',
    description: `これは新しい製品のダミーテキストです。この製品は非常に革新的で、多くの問題を解決します。詳細については、後日発表します。

この製品は、最新のテクノロジーを使用して構築されており、ユーザーフレンドリーなインターフェースを備えています。市場に革命をもたらすこと間違いありません。

私たちのチームは、この製品の開発に数え切れないほどの時間を費やしてきました。皆様にご利用いただけるようになることを楽しみにしています。`,
    price: '$100/月',
    features: [
      '機能A',
      '機能B',
      '機能C'
    ]
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">{productData.name}</h1>
        <p className="text-xl text-blue-600 mb-4">{productData.price}</p>
        
        {/* 翻訳+TTS+要約ボタンウィジェット */}
        <div className="mb-6">
          <TranslateButton text={productData.description} />
        </div>
      </div>
      
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Product Description</h2>
        <div className="prose max-w-none">
          {productData.description.split('\n\n').map((paragraph, idx) => (
            <p key={idx} className="mb-4">{paragraph}</p>
          ))}
        </div>
      </div>
      
      <div>
        <h2 className="text-2xl font-semibold mb-4">Key Features</h2>
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {productData.features.map((feature, idx) => (
            <li key={idx} className="flex items-start">
              <svg 
                className="h-5 w-5 text-green-500 mr-2 mt-0.5" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M5 13l4 4L19 7" 
                />
              </svg>
              {feature}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
