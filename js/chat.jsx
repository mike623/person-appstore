// AskMike — hero chat that answers questions about Mike's profile via Claude.
const { useState: useStateChat, useRef: useRefChat, useEffect: useEffectChat } = React;

const SUGGESTIONS = [
  "What's Mike's strongest stack?",
  'Show me a project you’re proud of',
  'Would he fit a mobile role?',
];

function buildProfileContext() {
  const site = window.SITE || {};
  const projects = (window.PROJECTS || [])
    .map((p) => `- ${p.name} (${p.category}, ${p.platform}, started ${p.started}): ${p.tagline}. ${p.blurb} Stack: ${p.stack}.`)
    .join('\n');
  return `You are the portfolio assistant on Mike Wong's personal site (namike.me). You answer visitors' questions about Mike in a warm, concise, matter-of-fact voice — 2-4 sentences, no bullet lists unless asked, never invent facts.

ABOUT MIKE
${site.name || 'Mike Wong'} — ${site.role || 'software engineer'} based in Hong Kong. ${site.yearsBuilding || '12+'} years building. Open to new roles in 2026. Speaks English and Chinese.
Favourite line: "Software and cathedrals are much the same — first we build them, then we pray."
Mobile: React Native, native iOS, native Android.
Web: React, Svelte, TypeScript, Tailwind.
Backend: Node, APIs, Postgres.
Leadership: agile teams, requirement gathering, solution design.
Contact: ${site.email || 'hello@namike.me'}, GitHub @${site.handle || 'mike623'}.

PROJECTS
${projects}

If a question falls outside this material, say you're not sure and point them to ${site.email || 'hello@namike.me'}.

Write plain prose only: no markdown, no asterisks, no bullet points, no headings.`;
}

function AskMike() {
  const [msgs, setMsgs] = useStateChat([]);
  const [draft, setDraft] = useStateChat('');
  const [busy, setBusy] = useStateChat(false);
  const scrollRef = useRefChat(null);

  useEffectChat(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [msgs, busy]);

  async function send(text) {
    const q = (text || '').trim();
    if (!q || busy) return;
    const next = [...msgs, { role: 'user', content: q }];
    setMsgs(next);
    setDraft('');
    setBusy(true);
    try {
      // ponytail: needs window.claude.complete (claude.ai artifact host). On the
      // static Netlify build this is undefined → the catch shows a fallback. Wire
      // a Netlify function proxying the Anthropic API if live chat is wanted.
      if (!window.claude || !window.claude.complete) throw new Error('no host');
      const reply = await window.claude.complete({
        system: buildProfileContext(),
        max_tokens: 500,
        messages: next.map((m) => ({ role: m.role, content: m.content })),
      });
      setMsgs([...next, { role: 'assistant', content: reply }]);
    } catch (e) {
      setMsgs([...next, { role: 'assistant', content: 'Sorry — I couldn’t reach my notes just now. Try again, or email hello@namike.me.' }]);
    } finally {
      setBusy(false);
    }
  }

  const stop = (e) => e.stopPropagation();

  return (
    <section className="askmike" onClick={stop}>
      <div className="askmike-top">
        <span className="askmike-dot" />
        <span className="askmike-label">ASK ABOUT MIKE</span>
      </div>
      {msgs.length === 0 && (
        <h2 className="askmike-title">Chat with my portfolio.<br />Ask anything about the work.</h2>
      )}
      {msgs.length > 0 && (
        <div className="askmike-log" ref={scrollRef}>
          {msgs.map((m, i) => (
            <div key={i} className={'askmike-msg ' + m.role}>{m.content}</div>
          ))}
          {busy && (
            <div className="askmike-msg assistant askmike-typing">
              <span /><span /><span />
            </div>
          )}
        </div>
      )}
      <form
        className="askmike-form"
        onSubmit={(e) => { e.preventDefault(); send(draft); }}
      >
        <input
          className="askmike-input"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder={msgs.length ? 'Ask another…' : 'Ask me anything about Mike’s work…'}
          aria-label="Ask about Mike"
        />
        <button className="askmike-send" type="submit" disabled={busy || !draft.trim()} aria-label="Send">
          {busy ? '···' : '→'}
        </button>
      </form>
      {msgs.length === 0 && (
        <div className="askmike-chips">
          {SUGGESTIONS.map((s) => (
            <button key={s} type="button" className="askmike-chip" onClick={() => send(s)}>{s}</button>
          ))}
        </div>
      )}
    </section>
  );
}

// Card version that sits beside the hero in the Today grid.
function AskMikePanel() {
  return (
    <article className="askmike-panel">
      <AskMike />
    </article>
  );
}

Object.assign(window, { AskMike, AskMikePanel });
