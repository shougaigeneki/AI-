// src/services/gemini.js

export async function callGeminiResearch(apiKey, theme, onProgress) {
    // 安定版の v1 エンドポイントを使用
    const url = 'https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=' + apiKey;

    const prompt = `あなたは「物を買わない主義」の買い物図鑑の編集長です。
テーマ「${theme}」に合致する、Amazon.co.jpでの評価が極めて高く（星4.2以上）、かつ楽天市場やYahoo!ショッピングでも広く扱われている「一生モノ」のクオリティを持つ商品を 5〜10件 選定してください。

以下のプロセスを実行してください：
1. 知識ベースから一生モノの候補を特定する。
2. レビューやウェブ上の評判から、慎重な消費者が後悔しそうな欠点を抽出する。
3. 商品名に基づいて、Amazon、楽天市場、Yahoo!ショッピングへの検索URLを生成してください。

以下の情報をJSON形式で返してください。`;

    const payload = {
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
            responseMimeType: "application/json",
            responseSchema: {
                type: "OBJECT",
                properties: {
                    products: {
                        type: "ARRAY",
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
        console.error('Error:', e);
        throw new Error('分析に失敗しました。1分ほど待ってから再度お試しいただくか、APIキーをご確認ください。');
    }
}
