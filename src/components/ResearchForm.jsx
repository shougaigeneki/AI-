// src/components/ResearchForm.jsx
import { useState } from 'react';
import { Search, Loader2 } from 'lucide-react';

export default function ResearchForm({ apiKey, isSearching, progressMsg, onSearch }) {
    const [theme, setTheme] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!theme.trim()) {
            alert('テーマを入力してください');
            return;
        }
        if (!apiKey) {
            alert('先にAPIキーを設定してください');
            return;
        }
        onSearch(theme.trim());
    };

    return (
        <>
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 mb-8">
                <form onSubmit={handleSubmit} className="space-y-4">
                    <label className="block text-sm font-medium text-gray-700">ターゲット・テーマを入力してください</label>
                    <div className="flex flex-col sm:flex-row gap-4">
                        <input
                            type="text"
                            value={theme}
                            onChange={(e) => setTheme(e.target.value)}
                            disabled={isSearching}
                            placeholder="例：30代ミニマリストがキッチンで使う一生モノ"
                            className="flex-1 px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none disabled:bg-gray-100 disabled:text-gray-500"
                        />
                        <button
                            type="submit"
                            disabled={isSearching || !apiKey}
                            className="px-8 py-3 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 transition-colors shadow-md disabled:bg-indigo-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {isSearching ? (
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                <Search className="w-5 h-5" />
                            )}
                            リサーチ開始
                        </button>
                    </div>
                    <p className="text-xs text-gray-400">※Google検索によるトレンド調査と、AIによる品質分析を一括で行います。</p>
                </form>
            </div>

            {/* Progress Overlay */}
            {isSearching && (
                <div className="bg-indigo-50 rounded-2xl p-8 mb-8 border border-indigo-100 animate-pulse flex flex-col items-center justify-center gap-3">
                    <div className="flex items-center justify-center">
                        <div className="w-8 h-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
                    </div>
                    <p className="text-indigo-800 font-medium text-center">
                        {progressMsg || 'AIがAmazonの海を調査中...'}
                    </p>
                </div>
            )}
        </>
    );
}
