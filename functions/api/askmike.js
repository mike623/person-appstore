// Cloudflare Pages Function → route /api/askmike.
// Thin wrapper over the runtime-agnostic handler in lib/askmike.mjs; the only
// platform-specific bit is creating the model from the Workers AI binding.
// Workers await the model call as I/O (not CPU), so there is no 10s cap.
import { createWorkersAI } from 'workers-ai-provider';
import { handleAskMike } from '../../lib/askmike.mjs';
import { CORPUS } from '../../lib/corpus.generated.mjs';

// Llama 3.3 70B, fp8 fast — non-reasoning, grounds well, ~3-4s per answer.
const MODEL = '@cf/meta/llama-3.3-70b-instruct-fp8-fast';

export async function onRequestPost(context) {
  const workersai = createWorkersAI({ binding: context.env.AI });
  const model = workersai(MODEL);
  return handleAskMike({ request: context.request, model, corpus: CORPUS });
}
