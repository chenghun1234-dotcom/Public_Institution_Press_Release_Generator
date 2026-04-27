/**
 * Cloudflare Worker for Public Institution Press Release Generation
 * Uses Workers AI (@cf/meta/llama-3-8b-instruct)
 */

export default {
  async fetch(request, env) {
    // Enable CORS
    const corsHeaders = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    };

    if (request.method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders });
    }

    if (request.method !== "POST") {
      return new Response("Method Not Allowed", { status: 405 });
    }

    try {
      const { topic, date, department, details } = await request.json();

      const systemPrompt = `
당신은 대한민국 공공기관의 베테랑 홍보 담당자입니다. 
다음 정보를 바탕으로 대한민국 보도자료 배포 형식에 맞게 '개조식'과 '서술식'을 적절히 혼용하여 작성하세요.

[작성 지침]
1. 문체: '~합니다', '~계획입니다' 등 정중한 어조를 사용하되, 본문은 명확한 개조식(□, -, 1.)을 주로 사용합니다.
2. 수식어: 지나치게 화려하거나 감성적인 수식어는 피하고 객관적 사실 위주로 작성하세요.
3. 필수 항목: 추진 배경, 주요 내용, 세부 계획, 향후 계획, 기대 효과를 포함하세요.
4. 언어: 한국어로 작성하세요.
5. 제목: 간결하지만 임팩트 있는 제목을 만드세요.
      `;

      const userPrompt = `
주제: ${topic}
날짜: ${date}
담당부서: ${department}
세부내용: ${details}
      `;

      // Cloudflare Workers AI call
      const response = await env.AI.run("@cf/meta/llama-3-8b-instruct", {
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
      });

      return new Response(JSON.stringify({ content: response.response }), {
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });

    } catch (error) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }
  },
};
