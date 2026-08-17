// AskMike — butler chat. esbuild entry (see build/bundle.mjs): React is
// aliased to window.React (shared instance), so this bundle sets
// window.AskMikePanel and app.jsx renders <window.AskMikePanel/> in its tree.
import React, { useState } from 'react';
import { useChat } from '@ai-sdk/react';
import { DefaultChatTransport } from 'ai';

const SUGGESTIONS = [
  "What's Mike's strongest stack?",
  'Show me a project he’s proud of',
  'Would he fit a senior backend role?',
];

const textOf = (m) => (m.parts || []).filter((p) => p.type === 'text').map((p) => p.text).join('');

function AskMike() {
  const { messages, sendMessage, status } = useChat({
    transport: new DefaultChatTransport({ api: '/api/askmike' }),
  });
  const [draft, setDraft] = useState('');
  const busy = status === 'submitted' || status === 'streaming';

  const send = (text) => {
    const q = (text || '').trim();
    if (!q || busy) return;
    sendMessage({ text: q });
    setDraft('');
  };

  const stop = (e) => e.stopPropagation();

  return (
    <section className="askmike" onClick={stop}>
      <div className="askmike-top">
        <span className="askmike-dot" />
        <span className="askmike-label">ASK ABOUT MIKE</span>
      </div>

      {messages.length === 0 && (
        <h2 className="askmike-title">Chat with my portfolio.<br />Ask anything about the work.</h2>
      )}

      {messages.length > 0 && (
        <div className="askmike-log">
          {messages.map((m) => (
            <div key={m.id} className={'askmike-msg ' + m.role}>{textOf(m)}</div>
          ))}
          {status === 'submitted' && (
            <div className="askmike-msg assistant askmike-typing"><span /><span /><span /></div>
          )}
        </div>
      )}

      <form className="askmike-form" onSubmit={(e) => { e.preventDefault(); send(draft); }}>
        <input
          className="askmike-input"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder={messages.length ? 'Ask another…' : 'Ask me anything about Mike’s work…'}
          aria-label="Ask about Mike"
        />
        <button className="askmike-send" type="submit" disabled={busy || !draft.trim()} aria-label="Send">
          {busy ? '···' : '→'}
        </button>
      </form>

      {messages.length === 0 && (
        <div className="askmike-chips">
          {SUGGESTIONS.map((s) => (
            <button key={s} type="button" className="askmike-chip" onClick={() => send(s)}>{s}</button>
          ))}
        </div>
      )}
    </section>
  );
}

function AskMikePanel() {
  return (
    <article className="askmike-panel">
      <AskMike />
    </article>
  );
}

window.AskMike = AskMike;
window.AskMikePanel = AskMikePanel;
