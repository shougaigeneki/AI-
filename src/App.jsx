import { useState } from 'react';
import APIKeySetup from './components/APIKeySetup';
import ResearchForm from './components/ResearchForm';
import ProductCard from './components/ProductCard';
import { callGeminiResearch } from './services/gemini';
import { ShoppingBag } from 'lucide-react';

function App() {
  console.log("App Component Rendering...");
  const [apiKey, setApiKey] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [progressMsg, setProgressMsg] = useState('');
  const [results, setResults] = useState([]);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSearch = async (theme) => {
    setIsSearching(true);
    setResults([]);
    setErrorMsg('');
    setProgressMsg('3大モールを横断リサーチ中...');

    try {
      const products = await callGeminiResearch(apiKey, theme, setProgressMsg);
      setResults(products);
    } catch (error) {
      console.error(error);
      setErrorMsg(error.message);
    } finally {
      setIsSearching(false);
      setProgressMsg('');
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen text-gray-800 font-sans w-full" translate="no">
      <div className="max-w-5xl mx-auto px-4 py-12 w-full">
        {/* Header */}
        <header className="mb-12 text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-indigo-600 p-3 rounded-2xl shadow-lg">
              <ShoppingBag className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3 tracking-tight">ショッピングAIリサーチ</h1>
          <p className="text-gray-600 text-lg">Amazon・楽天・Yahooを横断して「一生モノ」を一括検品</p>
        </header>

        <APIKeySetup onKeySaved={setApiKey} />

        <ResearchForm
          apiKey={apiKey}
          isSearching={isSearching}
          progressMsg={progressMsg}
          onSearch={handleSearch}
        />

        {/* Error Message */}
        {errorMsg && (
          <div className="bg-red-50 text-red-700 p-4 rounded-xl border border-red-200 mb-8 font-medium text-center">
            {errorMsg}
          </div>
        )}

        {/* Results Section */}
        {results.length > 0 && (
          <div className="space-y-8">
            <div className="flex items-center justify-between pb-4 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900">AI検品結果</h2>
              <span className="bg-indigo-100 text-indigo-800 font-bold px-3 py-1 rounded-full text-sm">
                全 {results.length} 件
              </span>
            </div>
            <div className="space-y-6">
              {results.map((product, index) => (
                <ProductCard key={index} product={product} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
