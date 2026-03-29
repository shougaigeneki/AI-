// src/services/gemini.js

export async function callGeminiResearch(apiKey, theme, onProgress) {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

    const prompt = `あなたは「物を買わない主義」の買い物図鑑の編集長です。
テーマ「${theme}」に合致する、Amazon.co.jpでの評価が高く、かつ楽天市場やYahoo!ショッピングでも販売されている「一生モノ」のクオリティを持つ商品を 5〜10件 リサーチしてください。

以下のプロセスを自動実行してください：
1. Google検索でAmazon内の高評価（星4.2以上）かつミニマリストや専門家に評価されている商品を5〜10件特定する。
2. 特定した商品が「楽天市場」や「Yahoo!ショッピング」でも販売されているかを確認する。
3. 各商品のレビューやウェブ上の評判を分析し、サクラレビューの可能性や、慎重な消費者が後悔しそうな欠点を抽出する。
4. 「一生モノ」として採用できるか総合判定（採用 or 不採用）を下す。特に、複数の主要プラットフォームで安定して流通していることは信頼性の証として考慮してください。

以下の情報をJSON形式で返してください。amazon_url, rakuten_url, yahoo_urlは実在するURLを特定または検索結果URLを生成してください（見つからない場合はnull）。`;

    const payload = {
        contents: [{ parts: [{ text: prompt }] }],
        tools: [{ "google_search": {} }],
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
                                reason: { type: "STRING", description: "その判定を下した理由を詳しく" },
                                pros: { type: "STRING", description: "一生モノとしての強み" },
                                fatal_flaws: { type: "STRING", description: "致命的な欠陥やデメリット" },
                                long_term_concerns: { type: "STRING", description: "長期使用における懸念点" },
                                fake_review_risk: { type: "STRING", description: "サクラレビューのリスク度合い（例: 低、高、等）" },
                                amazon_url: { type: "STRING", description: "AmazonのURL" },
                                rakuten_url: { type: "STRING", description: "楽天市場のURL（なければnull）" },
                                yahoo_url: { type: "STRING", description: "Yahoo!ショッピングのURL（なければnull）" },
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

    onProgress('Google検索でトレンドとURLを特定中...');

    let delay = 1000;
    for (let i = 0; i < 3; i++) {
        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                const errData = await response.json();
                console.error('Gemini API Error details:', errData);
                if (response.status === 429) {
                    throw new Error('APIの利用制限（1分あたりの回数制限）に達しました。1分ほど待ってから再度お試しください。');
                }
                throw new Error(errData.error?.message || 'API Request Failed');
            }

            const data = await response.json();

            if (!data.candidates || !data.candidates[0].content.parts[0].text) {
                throw new Error('APIからの応答が不正です。');
            }

            const textResponse = data.candidates[0].content.parts[0].text;
            return JSON.parse(textResponse).products;

        } catch (e) {
            console.warn(`Retry ${i + 1} failed:`, e);
            if (i === 2) throw new Error('分析に失敗しました。時間をおいて再度お試しいただくか、APIキーをご確認ください。');
            onProgress(`エラーが発生しました。再試行中... (${i + 1}/3)`);
            await new Promise(resolve => setTimeout(resolve, delay));
            delay *= 2;
        }
    }
}
