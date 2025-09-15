import Head from 'next/head'
import ProductDescriptionCreator from '../components/ProductDescriptionCreator'

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Head>
        <title>Product Page Description Creator | AI-Powered Content Generation</title>
        <meta name="description" content="Generate professional product descriptions with AI. Extract data from URLs and create SEO-optimized content automatically." />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Product Page Description Creator
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Generate professional, SEO-optimized product descriptions from any URL.
              Powered by advanced AI to create compelling content that converts.
            </p>
          </div>

          <ProductDescriptionCreator />
        </div>
      </main>
    </div>
  )
}