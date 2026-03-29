import React, { useState, useEffect } from 'react';
import { callGeminiResearch } from './services/gemini';
import ProductCard from './components/ProductCard';

function App() {
  const [apiKey, setApiKey] = useState(localStorage.getItem('gemini_api_key') || '');
  const [theme, setTheme] = useState('');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [progress, setProgress] = useState('');
  const [showSettings, setShowSettings] = useState(!apiKey);

  const handleResearch = async (e) => {
    e.preventDefault();
    if (!apiKey) {
      setError('APIキーを設定してください。');
      setShowSettings(true);
      return;
    }
    if (!theme) {
      setError('リサーチするテーマを入力してください。');
      return;
    }

    setLoading(true);
    setError(null);
    setProducts([]);
    setProgress('リサーチを開始しています...');

    try {
      const results = await callGeminiResearch(apiKey, theme, setProgress);
      setProducts(results);
      setProgress('リサーチが完了しました！');
    } catch (err) {
      setError(err.message);
      setProgress('エラーが発生しました。');
    } finally {
      setLoading(false);
    }
  };

  const saveApiKey = (e) => {
    e.preventDefault();
    localStorage.setItem('gemini_api_key', apiKey);
    setShowSettings(false);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-[#050510] relative overflow-hidden text-gray-100 font-sans">
      <div className="mesh-gradient absolute inset-0 opacity-40 z-0"></div>
      
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 py-12">
        <header className="text-center mb-16 animate-fade-in">
          <h1 className="text-6xl md:text-8xl font-black mb-4 tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500">
            購物図鑑
          </h1>
          <p className="text-xl md:text-2xl text-gray-400 font-medium max-w-3xl mx-auto leading-relaxed">
            AIがAmazonから「一生モノ」の逸品をリサーチします。
          </p>
        </header>

        <section className="max-w-4xl mx-auto mb-16">
          <div className="glass-card p-1">
            <form onSubmit={handleResearch} className="flex flex-col md:flex-row gap-2">
              <input
                type="text"
                value={theme}
                onChange={(e) => setTheme(e.target.value)}
                placeholder="何をリサーチしますか？（例: 一生モノの革財布）"
                className="flex-grow bg-white/5 border-none rounded-xl px-6 py-4 text-lg focus:ring-2 focus:ring-purple-500 outline-none transition-all placeholder:text-gray-600"
              />
              <button
                type="submit"
                disabled={loading}
                className="bg-gradient-to-r from-purple-600 to-blue-600 px-8 py-4 rounded-xl font-bold text-lg hover:from-purple-500 hover:to-blue-500 active:scale-95 transition-all shadow-xl"
              >
                {loading ? '分析中...' : 'リサーチ開始'}
              </button>
            </form>
          </div>

          <div className="mt-4 flex justify-between items-center text-sm font-medium">
            <button 
              onClick={() => setShowSettings(!showSettings)}
              className="text-gray-500 hover:text-purple-400 transition-colors"
            >
              APIキーの設定を開く
            </button>
            <div className={`transition-all duration-500 ${loading ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}`}>
              <span className="flex items-center gap-2 text-purple-400">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-500"></span>
                </span>
                {progress}
              </span>
            </div>
          </div>
        </section>

        {showSettings && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
            <div className="glass-card p-8 max-w-md w-full relative">
              <button 
                onClick={() => setShowSettings(false)}
                className="absolute top-4 right-4 text-gray-500 hover:text-white"
              >
                ✕
              </button>
              <h2 className="text-2xl font-bold mb-6 text-white tracking-tight">APIキー設定</h2>
              <form onSubmit={saveApiKey}>
                <p className="text-xs text-gray-400 mb-4">
                  ※新しく作成したプロジェクトのAPIキーを使用してください。
                </p>
                <input
                  type="password"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="Gemini API Key を入力"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 mb-6 focus:ring-2 focus:ring-purple-500 outline-none transition-all"
                />
                <button
                  type="submit"
                  className="w-full py-4 bg-white text-black font-black rounded-xl hover:bg-gray-200 transition-all font-sans uppercase tracking-widest text-xs"
                >
                  設定を保存する
                </button>
              </form>
            </div>
          </div>
        )}

        {error && (
          <div className="max-w-4xl mx-auto mb-12 p-6 glass-card border border-red-500/20 bg-red-500/5 text-red-200 rounded-2xl animate-shake">
            <h3 className="font-bold mb-1">エラーが発生しました</h3>
            <p className="text-sm opacity-80">{error}</p>
          </div>
        )}

        {products.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-fade-in-up">
            {products.map((product, index) => (
              <ProductCard key={index} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
