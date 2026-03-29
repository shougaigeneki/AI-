// src/components/APIKeySetup.jsx
import { useState, useEffect } from 'react';
import { Key } from 'lucide-react';

export default function APIKeySetup({ onKeySaved }) {
    const [apiKey, setApiKey] = useState('');
    const [isSaved, setIsSaved] = useState(false);

    useEffect(() => {
        const savedKey = localStorage.getItem('gemini_api_key');
        if (savedKey) {
            setApiKey(savedKey);
            setIsSaved(true);
            onKeySaved(savedKey);
        }
    }, [onKeySaved]);

    const handleSave = () => {
        if (!apiKey.trim()) return;
        localStorage.setItem('gemini_api_key', apiKey.trim());
        setIsSaved(true);
        onKeySaved(apiKey.trim());
    };

    const handleClear = () => {
        localStorage.removeItem('gemini_api_key');
        setApiKey('');
        setIsSaved(false);
        onKeySaved('');
    };

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-8">
            <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Key className="w-5 h-5 text-indigo-600" />
                Gemini APIキー設定
            </h2>
            <div className="flex flex-col sm:flex-row gap-4">
                <input
                    type="password"
                    value={apiKey}
                    onChange={(e) => {
                        setApiKey(e.target.value);
                        if (isSaved) setIsSaved(false);
                    }}
                    placeholder="AI Studioから取得したAPIキーを入力"
                    className="flex-1 px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none"
                />
                {!isSaved ? (
                    <button
                        onClick={handleSave}
                        className="px-8 py-3 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 transition-colors shadow-md"
                    >
                        保存する
                    </button>
                ) : (
                    <button
                        onClick={handleClear}
                        className="px-8 py-3 bg-gray-600 text-white font-semibold rounded-xl hover:bg-gray-700 transition-colors shadow-md"
                    >
                        クリア
                    </button>
                )}
            </div>
            <p className="text-xs text-gray-400 mt-3">
                ※キーはお使いのブラウザ内(localStorage)のみに安全に保存されます。
            </p>
        </div>
    );
}
