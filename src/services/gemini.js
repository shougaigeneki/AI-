// src/services/gemini.js

export async function callGeminiResearch(apiKey, theme, onProgress) {
    // 【重要】あなたのプロジェクトで確実に動くモデル名「gemini-3-flash-preview」を最優先にします。
    const models = ['gemini-3-flash-preview', 'gemini-1.5-flash', 'gemini-pro-latest'];

    const prompt = `あなたは「物を買わない主義」の買い物図鑑の編集長です。
テーマ「${theme}」に合致する、Amazon.co.jpでの評価が極めて高く、ミニマリストや専門家に評価されている「一生モノ」の商品を 5〜10件 選定してください。

以下の情報をJSON形式で出力してください。amazon_urlはAmazonの検索結果URLを生成してください。

JSON構造：
{
  "products": [
    {
      "name": "商品名",
      "rating": "数",
      "judgment": "採用 または 不採用",
      "reason": "理由",
      "pros": "メリット",
      "fatal_flaws": "欠点",
      "long_term_concerns": "懸念",
      "fake_review_risk": "サクラ度",
      "amazon_url": "AmazonのURL"
    }
  ]
}`;

    for (const model of models) {
        onProgress(`${model} でリサーチ中...`);
        // AI Studioで動くことを確認した v1beta エンドポイントを使用
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=` + apiKey;

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [{ parts: [{ text: prompt }] }],
                    generationConfig: {
                        responseMimeType: "application/json"
                    }
                })
            });

            if (response.status === 404) {
                console.warn(`${model} is not found. Trying next...`);
                continue;
            }

            if (!response.ok) {
                const errData = await response.json();
                throw new Error(errData.error?.message || 'API Request Failed');
            }

            const data = await response.json();
            let textResponse = data.candidates[0].content.parts[0].text;
            textResponse = textResponse.replace(/```json/g, '').replace(/```/g, '').trim();
            
            return JSON.parse(textResponse).products;

        } catch (e) {
            console.error(`${model} Error:`, e);
            if (model === models[models.length - 1]) {
                throw new Error('分析に失敗しました。1分ほど待ってから再度お試しください。');
            }
            if (e.message.includes('429')) {
                onProgress(`${model} の上限に達しました。予備モデルで試します...`);
                continue;
            }
            throw e;
        }
    }
}
