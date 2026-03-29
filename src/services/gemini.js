// src/services/gemini.js

export async function callGeminiResearch(apiKey, theme, onProgress) {
    // 確実に認識される「pro-latest」に戻します
    const url = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro-latest:generateContent?key=' + apiKey;

    const prompt = `あなたは「物を買わない主義」の買い物図鑑の編集長です。
テーマ「${theme}」に合致する、Amazon.co.jpでの評価が極めて高く、かつ楽天市場やYahoo!ショッピングでも扱われている「一生モノ」の商品を 5〜10件 選定してください。

【出力ルール】
1. Amazon、楽天市場、Yahoo!ショッピングでそれぞれ検索できるURL（または商品URL）を作成してください。
2. JSON形式で出力してください。`;

    const payload = {
        contents: [{ parts: [{ text: prompt }] }],
        // ★ツール（検索機能）は含めません。これが429エラーを回避し、動作を軽くする鍵です。
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
                                name: { type: "STRING" },
                                rating: { type: "STRING" },
                                judgment: { type: "STRING" },
                                reason: { type: "STRING" },
                                pros: { type: "STRING" },
                                fatal_flaws: { type: "STRING" },
                                long_term_concerns: { type: "STRING" },
                                fake_review_risk: { type: "STRING" },
                                amazon_url: { type: "STRING" },
                                rakuten_url: { type: "STRING" },
                                yahoo_url: { type: "STRING" },
                                is_multi_platform: { type: "BOOLEAN" }
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
