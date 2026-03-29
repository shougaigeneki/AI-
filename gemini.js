// src/services/gemini.js (Pro・超安定版)
export async function callGeminiResearch(apiKey, theme, onProgress) {
    // あなたのアカウントで唯一「404」が出ないことが確認されている Pro モデルを使用
    const url = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro-latest:generateContent?key=' + apiKey;
    
    const prompt = `あなたは買い物リサーチの専門家です。テーマ「${theme}」に合致する、Amazon・楽天・Yahooで高評価かつ「一生モノ」の高品質な商品を 5件 リサーチしてください。必ず【純粋なJSON形式のみ】で出力してください。

JSONの構造：
{
  "products": [
    {
      "name": "商品名",
      "rating": "星の数",
      "judgment": "採用/不採用",
      "reason": "詳細な理由",
      "pros": "メリット",
      "fatal_flaws": "欠点",
      "long_term_concerns": "長期使用の懸念",
      "fake_review_risk": "サクラ度",
      "amazon_url": "Amazon検索URL",
      "rakuten_url": "楽天検索URL",
      "yahoo_url": "Yahoo検索URL",
      "is_multi_platform": true
    }
  ]
}`;

    onProgress('3大モールを横断リサーチ中（確実モード）...');

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
        textResponse = textResponse.replace(/```json/g, '').replace(/```/g, '').trim();
        return JSON.parse(textResponse).products;

    } catch (e) {
        console.error('Gemini Error:', e);
        throw new Error('分析に失敗しました。1分ほど待ってから再度お試しいただくか、APIキーをご確認ください。');
    }
}
