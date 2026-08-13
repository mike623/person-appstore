// Netlify Function (v2) — thin wrapper over the pure handler in lib/askmike.mjs.
// Creates the real OpenRouter model with an automatic free-model fallback.
import { createOpenRouter } from '@openrouter/ai-sdk-provider';
import { handleAskMike } from '../../lib/askmike.mjs';
import { CORPUS } from '../../lib/corpus.generated.mjs';

// Both verified live on OpenRouter at build; swap if deprecated. The `models`
// array lets OpenRouter fail over automatically when the primary is rate-limited.
const PRIMARY = 'meta-llama/llama-3.3-70b-instruct:free';
const FALLBACK = 'qwen/qwen-2.5-72b-instruct:free';

// Corpus is generated into a module at build (build/bundle.mjs) so it bundles
// into the lambda — no runtime fs.
const corpus = CORPUS;

export default async (request) => {
  const openrouter = createOpenRouter({ apiKey: process.env.OPENROUTER_API_KEY });
  const model = openrouter.chat(PRIMARY, { extraBody: { models: [PRIMARY, FALLBACK] } });
  return handleAskMike({ request, model, corpus });
};

export const config = { path: '/api/askmike' };
