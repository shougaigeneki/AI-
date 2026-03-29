// src/services/gemini.js (完全・確実・Flash版)
export async function callGeminiResearch(apiKey, theme, onProgress) {
    // 【重要】回数制限に悩まされない Flash モデルを指定。書き方もエラーが出ない形式に修正しました。
    const url = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=' + apiKey;
    
    const prompt = `あなたは買い物リサーチの専門家です。テーマ「${theme}」に合致する、Amazon・楽天・Yahooで高評価かつ「一生モノ」と言える高品質な商品を 5件 リサーチしてください。必ず【純粋なJSON形式のみ】で出力してください。

JSONの構造：
{
  "products": [
    {
      "name": "商品名",
      "rating": "評価点",
      "judgment": "採用/不採用",
      "reason": "詳細な理由",
      "pros": "強み",
      "fatal_flaws": "欠点",
      "long_term_concerns": "懸念",
      "fake_review_risk": "サクラ度",
      "amazon_url": "Amazon検索URL",
      "rakuten_url": "楽天検索URL",
      "yahoo_url": "Yahoo検索URL",
      "is_multi_platform": true
    }
  ]
}`;

    onProgress('3大モールを横断リサーチ中（高速モード）...');

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
        });

        if (!response.ok) {
            const errData = await response.json();
            throw new Error(errData.error?.message || 'API Request Failed');
        }

        const data = await response.json();
        let textResponse = data.candidates[0].content.parts[0].text;
        
        // ゴミ取り（Markdown装飾の削除）
        textResponse = textResponse.replace(/```json/g, '').replace(/```/g, '').trim();
        
        return JSON.parse(textResponse).products;

    } catch (e) {
        console.error('Gemini Error:', e);
        throw new Error('分析に失敗しました。1分ほど待ってから再度お試しいただくか、新しいAPIキーをご確認ください。');
    }
}
