import TranslateButton from '@/widgets/translateButton';

export default async function ProductPage({ 
  params 
}: { 
  params: Promise<{ id: string }> 
}) {
  const { id } = await params;
  const productData = {
    id,
    name: 'Enterprise Cloud Platform',
    description: `Our Enterprise Cloud Platform is a comprehensive SaaS solution designed for modern businesses looking to scale their operations efficiently. The platform offers a wide range of features including automated workflow management, real-time analytics dashboard, and secure API integrations with your existing tools.

With our subscription-based model, you can access all premium features such as advanced data visualization, custom reporting, and dedicated customer support. Our cloud computing infrastructure ensures 99.9% uptime and robust security measures to protect your sensitive data.

The platform's intuitive dashboard allows you to monitor key performance indicators at a glance and make data-driven decisions. API documentation is comprehensive and regularly updated, making integration with third-party services seamless.

Many Fortune 500 companies have already implemented our Enterprise Cloud Platform, resulting in significant operational cost savings and productivity improvements. Our dedicated customer success team is available 24/7 to help you maximize the value of your subscription.`,
    price: '$1,299/month',
    features: [
      'Automated workflow management',
      'Real-time analytics dashboard',
      'Secure API integrations',
      'Advanced data visualization',
      'Custom reporting',
      'Dedicated customer support',
      '99.9% uptime guarantee',
      'Comprehensive documentation'
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
