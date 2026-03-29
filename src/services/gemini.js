// src/services/gemini.js

export async function callGeminiResearch(apiKey, theme, onProgress) {
    // どんな地域・アカウントでも認識される「標準版 v1」のURLを使います
    const url = 'https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=' + apiKey;

    const prompt = `あなたは買い物リサーチの専門家です。テーマ「${theme}」に合致する、Amazon・楽天・Yahooで高評価かつ「一生モノ」と言える高品質な商品を 5件 リサーチしてください。

以下の情報を、必ず【純粋なJSON形式のみ】で出力してください。Markdownの装飾（\`\`\`jsonなど）は不要です。

JSONの構造：
{
  "products": [
    {
      "name": "商品名",
      "rating": "星の数",
      "judgment": "採用 または 不採用",
      "reason": "判定理由",
      "pros": "メリット",
      "fatal_flaws": "欠点",
      "long_term_concerns": "長期使用の懸念",
      "fake_review_risk": "サクラリスク",
      "amazon_url": "Amazonの検索URL",
      "rakuten_url": "楽天の検索URL",
      "yahoo_url": "Yahooの検索URL",
      "is_multi_platform": true
    }
  ]
}`;

    onProgress('3大モールを横断リサーチ中（安定モード）...');

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: prompt }] }]
            })
        });

        if (!response.ok) {
            const errData = await response.json();
            throw new Error(errData.error?.message || 'API Request Failed');
        }

        const data = await response.json();
        let textResponse = data.candidates[0].content.parts[0].text;
        
        // AIがMarkdown（```json ... ```）で返してきた場合のゴミ取り
        textResponse = textResponse.replace(/```json/g, '').replace(/```/g, '').trim();
        
        return JSON.parse(textResponse).products;

    } catch (e) {
        console.error('Gemini Error:', e);
        throw new Error('分析に失敗しました。1分ほど待ってから再度お試しいただくか、新しいAPIキーをご確認ください。');
    }
}
