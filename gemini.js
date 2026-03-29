// src/services/gemini.js

export async function callGeminiResearch(apiKey, theme, onProgress) {
    // 1.5-flash と v1beta を組み合わせ、かつ変数は安全に結合します
    const url = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=' + apiKey;

    const prompt = `あなたは「物を買わない主義」の買い物図鑑の編集長です。
テーマ「${theme}」に合致する、Amazon.co.jpでの評価が極めて高く、かつ楽天市場やYahoo!ショッピングでも広く扱われている「一生モノ」のクオリティを持つ商品を 5〜10件 選定してください。

【出力ルール】
1. Amazon、楽天市場、Yahoo!ショッピングでそれぞれ検索できるURLを作成してください。
2. 判定理由は詳しく書いてください。
3. JSON形式で出力してください。`;

    const payload = {
        contents: [{ parts: [{ text: prompt }] }],
        // ★ツール（Google検索）は一切含めません。これがエラー回避の鍵です。
        generationConfig: {
            responseMimeType: "application/json",
            responseSchema: {
                type: "OBJECT",
                properties: {
                    products: {
                        type: "ARRAY",
                        description: "リサーチした商品のリスト（5〜10件）",
                        items: {
                            type: "OBJECT",
                            properties: {
                                name: { type: "STRING", description: "商品名" },
                                rating: { type: "STRING", description: "評価（例: 4.5）" },
                                judgment: { type: "STRING", description: "採用 または 不採用" },
                                reason: { type: "STRING", description: "その判定を下した理由" },
                                pros: { type: "STRING", description: "一生モノとしての強み" },
                                fatal_flaws: { type: "STRING", description: "致命的な欠陥やデメリット" },
                                long_term_concerns: { type: "STRING", description: "長期使用における懸念点" },
                                fake_review_risk: { type: "STRING", description: "サクラレビューのリスク度合い" },
                                amazon_url: { type: "STRING", description: "Amazonの検索URL" },
                                rakuten_url: { type: "STRING", description: "楽天市場の検索URL" },
                                yahoo_url: { type: "STRING", description: "Yahoo!ショッピングの検索URL" },
                                is_multi_platform: { type: "BOOLEAN", description: "3大モール全てで確認できたか" }
                            },
                            required: [
                                "name", "rating", "judgment", "reason", "pros",
                                "fatal_flaws", "long_term_concerns", "fake_review_risk", 
                                "amazon_url", "rakuten_url", "yahoo_url", "is_multi_platform"
                            ]
                        }
                    }
                }
            }
        }
    };

    onProgress('3大モールを横断リサーチ中...');

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            const errData = await response.json();
            throw new Error(errData.error?.message || 'API Request Failed');
        }

        const data = await response.json();
        const textResponse = data.candidates[0].content.parts[0].text;
        return JSON.parse(textResponse).products;

    } catch (e) {
        console.error('Gemini Error:', e);
        throw new Error('分析に失敗しました。1分ほど待ってから再度お試しいただくか、APIキーをご確認ください。');
    }
}
