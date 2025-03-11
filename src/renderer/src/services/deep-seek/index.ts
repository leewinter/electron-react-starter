export interface DeepSeekResponse {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: Array<{
    message: { role: string; content: string };
    index: number;
    finish_reason: string;
  }>;
  usage: { prompt_tokens: number; completion_tokens: number; total_tokens: number };
}

export const getSqlBasePrompt = (queryDescription) => `
-- Generate only a valid SQL query without explanation, using ANSI SQL syntax.
-- Ensure it joins the necessary tables and includes proper WHERE conditions.
-- Return only the SQL code snippet.

-- Description: ${queryDescription}
`;

export class DeepSeekApi {
  private apiKey: string;
  private baseUrl: string = 'https://api.deepseek.com/v1/chat/completions';

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async generateSQL(queryDescription: string, model: string = 'deepseek-chat') {
    const response = await fetch(this.baseUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify({
        model,
        messages: [{ role: 'user', content: queryDescription }],
      }),
    });

    if (!response.ok) {
      throw new Error(`DeepSeek API error: ${response.status} ${response.statusText}`);
    }

    const data = (await response.json()) as DeepSeekResponse;

    // Extract only the SQL code from the response
    const sqlSnippet = data.choices?.[0]?.message?.content?.trim() || 'No SQL generated';

    return sqlSnippet;
  }
}
