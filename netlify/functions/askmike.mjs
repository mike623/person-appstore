// Netlify Function (v2) — thin wrapper over the pure handler in lib/askmike.mjs.
// Creates the real OpenRouter model with an automatic free-model fallback.
import { createOpenRouter } from '@openrouter/ai-sdk-provider';
import { handleAskMike } from '../../lib/askmike.mjs';
import { CORPUS } from '../../lib/corpus.generated.mjs';

// Both verified live on OpenRouter at build; swap if deprecated. The `models`
// array lets OpenRouter fail over automatically when the primary is rate-limited.
const PRIMARY = 'google/gemma-4-31b-it:free';
const FALLBACK = 'nvidia/nemotron-3-super-120b-a12b:free';

// Corpus is generated into a module at build (build/bundle.mjs) so it bundles
// into the lambda — no runtime fs.
const corpus = CORPUS;

export default async (request) => {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    return new Response(JSON.stringify({ error: 'chat unavailable' }), {
      status: 503,
      headers: { 'content-type': 'application/json' },
    });
  }
  const openrouter = createOpenRouter({ apiKey });
  const model = openrouter.chat(PRIMARY, { extraBody: { models: [PRIMARY, FALLBACK] } });
  return handleAskMike({ request, model, corpus });
};

export const config = { path: '/api/askmike' };
