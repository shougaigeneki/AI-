// src/components/ProductCard.jsx
import { ExternalLink, CheckCircle2, XCircle, AlertTriangle, ShieldCheck } from 'lucide-react';

export default function ProductCard({ product }) {
    const isApproved = product.judgment === '採用';
    const isHighRisk = product.fake_review_risk.includes('高') || product.fake_review_risk.includes('High');

    return (
        <div className={`rounded-2xl shadow-sm border overflow-hidden transition-all duration-300 hover:shadow-md 
            ${isApproved ? 'bg-white border-gray-200' : 'bg-gray-50 border-gray-300 opacity-90'}`}>
            <div className="p-6">
                <div className="flex flex-col md:flex-row justify-between items-start mb-4 gap-4">
                    <h2 className="text-xl font-bold text-gray-900 flex-1 leading-tight">{product.name}</h2>
                    <div className="flex items-center gap-2 shrink-0">
                        {product.is_multi_platform && (
                            <span className="bg-green-100 text-green-800 text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1">
                                <ShieldCheck className="w-3.5 h-3.5" /> 3大サイト対応
                            </span>
                        )}
                        <span className="bg-amber-100 text-amber-800 text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1">
                            ★ {product.rating}
                        </span>
                        <span className={`text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1
                            ${isApproved ? 'bg-indigo-100 text-indigo-700' : 'bg-gray-200 text-gray-700'}`}>
                            {isApproved ? <CheckCircle2 className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                            {product.judgment}
                        </span>
                    </div>
                </div>

                <p className="text-gray-700 text-sm mb-6 leading-relaxed bg-blue-50/50 p-4 rounded-xl border border-blue-100">
                    <span className="font-bold text-indigo-600 block mb-1">【判定理由】</span>
                    {product.reason}
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div className="bg-green-50/80 p-4 rounded-xl border border-green-100 text-sm">
                        <h3 className="font-bold text-green-800 mb-2 flex items-center gap-1.5">
                            <CheckCircle2 className="w-4 h-4" /> 一生モノとしての強み
                        </h3>
                        <p className="text-green-700 leading-relaxed">{product.pros}</p>
                    </div>
                    <div className="bg-orange-50/80 p-4 rounded-xl border border-orange-100 text-sm">
                        <h3 className="font-bold text-orange-800 mb-2 flex items-center gap-1.5">
                            <AlertTriangle className="w-4 h-4" /> 長期使用の懸念点
                        </h3>
                        <p className="text-orange-700 leading-relaxed">{product.long_term_concerns}</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div className="bg-red-50/80 p-4 rounded-xl border border-red-100 text-sm">
                        <h3 className="font-bold text-red-800 mb-2 flex items-center gap-1.5">
                            <XCircle className="w-4 h-4" /> 致命的な欠陥
                        </h3>
                        <p className="text-red-700 leading-relaxed">{product.fatal_flaws}</p>
                    </div>
                    <div className={`p-4 rounded-xl border text-sm ${isHighRisk ? 'bg-red-100 border-red-200' : 'bg-yellow-50/80 border-yellow-100'}`}>
                        <h3 className={`font-bold mb-2 flex items-center gap-1.5 ${isHighRisk ? 'text-red-800' : 'text-yellow-800'}`}>
                            <ShieldCheck className="w-4 h-4" /> サクラ度・レビューリスク
                        </h3>
                        <p className={isHighRisk ? 'text-red-700' : 'text-yellow-700'}>{product.fake_review_risk}</p>
                    </div>
                </div>

                <div className="flex flex-wrap gap-3">
                    <a href={product.amazon_url} target="_blank" rel="noopener noreferrer"
                        className="flex-1 min-w-[140px] text-center py-3 text-white font-semibold rounded-xl bg-[#232f3e] hover:bg-black transition-all flex items-center justify-center gap-2 shadow-sm">
                        Amazon
                        <ExternalLink className="w-4 h-4" />
                    </a>
                    {product.rakuten_url && (
                        <a href={product.rakuten_url} target="_blank" rel="noopener noreferrer"
                            className="flex-1 min-w-[140px] text-center py-3 text-white font-semibold rounded-xl bg-[#bf0000] hover:bg-[#a00000] transition-all flex items-center justify-center gap-2 shadow-sm">
                            楽天市場
                            <ExternalLink className="w-4 h-4" />
                        </a>
                    )}
                    {product.yahoo_url && (
                        <a href={product.yahoo_url} target="_blank" rel="noopener noreferrer"
                            className="flex-1 min-w-[140px] text-center py-3 text-white font-semibold rounded-xl bg-[#ff0033] hover:bg-[#e6002e] transition-all flex items-center justify-center gap-2 shadow-sm">
                            Yahoo!
                            <ExternalLink className="w-4 h-4" />
                        </a>
                    )}
                </div>
            </div>
        </div>
    );
}
