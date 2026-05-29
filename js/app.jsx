// App — tab switching, sheet state, four pages.
const { useState: useStateApp, useEffect: useEffectApp } = React;

function todayKicker() {
  const now = new Date();
  const day = now.toLocaleDateString('en-US', { weekday: 'long' }).toUpperCase();
  const mon = now.toLocaleDateString('en-US', { month: 'long' }).toUpperCase();
  const date = now.getDate();
  return `${day} · ${mon} ${date}`;
}

// Rotate weekly pick by ISO week number — deterministic, no hardcode.
const WEEKLY_PICK_POOL = [
  'brownie', 'matcha', 'eco-cycle', 'deadstock', 'hoopcam',
  'lynk', 'fina', 'hot-spot', 'booster',
];

function weeklyPickId() {
  const now = new Date();
  const jan4 = new Date(now.getFullYear(), 0, 4);
  const week = Math.ceil(((now - jan4) / 86400000 + jan4.getDay() + 1) / 7);
  return WEEKLY_PICK_POOL[week % WEEKLY_PICK_POOL.length];
}

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "theme": "light",
  "density": "cozy",
  "accent": "blue",
  "layout": "auto"
}/*EDITMODE-END*/;

const ACCENTS = {
  blue:    { c: '#0A84FF', label: 'Blue'     },
  graphite:{ c: '#3A3A3C', label: 'Graphite' },
  rose:    { c: '#FF375F', label: 'Rose'     },
  citron:  { c: '#FFB938', label: 'Citron'   },
};

function TodayPage({ onOpen, onAbout }) {
  return (
    <div className="page today-page">
      <PageHeader kicker={todayKicker()} title="Today" />
      <div className="today-page-grid">
        <TodayHero roles={window.ROLES} onPick={onAbout} />
      </div>

      <FeaturedCard
        project={window.PROJECTS.find((p) => p.id === 'mr-carson')}
        eyebrow="AI DRIVEN"
        onOpen={onOpen}
      />

      <FeaturedCard
        project={window.PROJECTS.find((p) => p.id === weeklyPickId())}
        eyebrow="OUR PICK OF THE WEEK"
        onOpen={onOpen}
      />

      <SectionHeader kicker="FROM MIKE" title="A handful of side quests" />
      <div className="mid-row">
        {window.PROJECTS.slice(0, 5).map((p, i) => (
          <MidCard key={p.id} project={p} rank={i + 1} onOpen={onOpen} />
        ))}
      </div>

      <FeaturedCard
        project={window.PROJECTS.find((p) => p.id === 'filmate')}
        eyebrow="WE LOVE"
        onOpen={onOpen}
      />

      <SectionHeader kicker="HONG KONG MADE" title="Local apps, local love" />
      <div className="row-list responsive-grid">
        {['eco-cycle', 'deadstock', 'filmate'].map((id, i, arr) => {
          const p = window.PROJECTS.find((x) => x.id === id);
          return <AppRow key={id} project={p} onOpen={onOpen} divider={i < arr.length - 1} />;
        })}
      </div>
      <FooterNote />
    </div>
  );
}

function AppsPage({ onOpen }) {
  const [filter, setFilter] = useStateApp('All');
  const cats = ['All', ...new Set(window.PROJECTS.map((p) => p.category))];
  const list = filter === 'All' ? window.PROJECTS : window.PROJECTS.filter((p) => p.category === filter);
  return (
    <div className="page apps-page">
      <PageHeader kicker="ALL" title="Apps" />
      <div className="chip-row">
        {cats.map((c) => (
          <button key={c} className={'chip' + (filter === c ? ' on' : '')} onClick={() => setFilter(c)}>
            {c}
          </button>
        ))}
      </div>
      <SectionHeader kicker="TOP CHARTS" title="Free" action="See All" />
      <div className="mid-row">
        {list.slice(0, 5).map((p, i) => (
          <MidCard key={p.id} project={p} rank={i + 1} onOpen={onOpen} />
        ))}
      </div>
      <SectionHeader kicker={`${list.length} APPS`} title="All work, no boilerplate" />
      <div className="row-list responsive-grid big">
        {list.map((p, i) => (
          <AppRow key={p.id} project={p} onOpen={onOpen} divider={i < list.length - 1} />
        ))}
      </div>
      <FooterNote />
    </div>
  );
}

function HacksPage({ onOpen }) {
  const hacks = window.PROJECTS.filter((p) => ['hot-spot', 'booster', 'fina', 'matcha', 'brownie'].includes(p.id));
  return (
    <div className="page hacks-page">
      <PageHeader kicker="HACKATHONS · EXPERIMENTS" title="Hacks" />
      <article className="hacks-hero">
        <div className="hacks-hero-eyebrow">FROM THE LAB</div>
        <h2 className="hacks-hero-title">
          Sixth-sense superpowers,<br />budgets that smile,<br />and a movie search you'll <em>actually</em> use.
        </h2>
        <p className="hacks-hero-sub">Weekend builds, hackathon entries, and small joys.</p>
      </article>
      <SectionHeader kicker="THERMAL VISION" title="The FLIR weekend" />
      <div className="mid-row">
        {['hot-spot', 'booster'].map((id) => {
          const p = window.PROJECTS.find((x) => x.id === id);
          return <MidCard key={id} project={p} onOpen={onOpen} />;
        })}
      </div>
      <SectionHeader kicker="MORE TO PLAY WITH" title="Other tinkerings" />
      <div className="row-list responsive-grid">
        {hacks.filter((p) => !['hot-spot', 'booster'].includes(p.id)).map((p, i, arr) => (
          <AppRow key={p.id} project={p} onOpen={onOpen} divider={i < arr.length - 1} />
        ))}
      </div>
      <FooterNote />
    </div>
  );
}

function AboutPage() {
  const site = window.SITE || {};
  return (
    <div className="page about-page">
      <PageHeader kicker="THE MAKER" title="About Mike" />
      <article className="about-card">
        <div className="about-avatar" aria-hidden="true">
          <div className="about-avatar-inner"><span>MW</span></div>
        </div>
        <div>
          <h2 className="about-name">{site.name || 'Mike Wong'}</h2>
          <p className="about-role">{site.role || 'Software engineer · Hong Kong'}</p>
          <p className="about-quote">"{site.quote}"</p>
          <div className="about-status">
            <span className="status-dot" /> {site.status}
          </div>
        </div>
      </article>

      <div className="about-grid">
        <div className="about-tile">
          <div className="about-tile-num">{site.yearsBuilding}</div>
          <div className="about-tile-label">Years building</div>
        </div>
        <div className="about-tile">
          <div className="about-tile-num">{window.PROJECTS.length}</div>
          <div className="about-tile-label">Shipped &amp; shipping</div>
        </div>
        <div className="about-tile">
          <div className="about-tile-num">2</div>
          <div className="about-tile-label">Languages of love</div>
          <div className="about-tile-sub">{site.languages}</div>
        </div>
        <div className="about-tile">
          <div className="about-tile-num">∞</div>
          <div className="about-tile-label">Side quests</div>
        </div>
      </div>

      <SectionHeader kicker="WHAT I DO" title="A short stack" />
      <div className="stack-grid">
        {(site.stack || []).map((row) => (
          <div key={row.k} className="stack-row">
            <div className="stack-k">{row.k}</div>
            <div className="stack-v">{row.v}</div>
          </div>
        ))}
      </div>

      <SectionHeader kicker="SAY HI" title="Let's talk" />
      <div className="contact-row">
        <a className="contact-tile" href={`mailto:${site.email}`}>
          <div className="contact-icon">✉</div>
          <div className="contact-k">Email</div>
          <div className="contact-v">{site.email}</div>
        </a>
        <a className="contact-tile" href={site.github} target="_blank" rel="noopener noreferrer">
          <div className="contact-icon">◐</div>
          <div className="contact-k">GitHub</div>
          <div className="contact-v">@{site.handle}</div>
        </a>
        <a className="contact-tile" href={site.resume}>
          <div className="contact-icon">⌘</div>
          <div className="contact-k">Resume</div>
          <div className="contact-v">PDF, fresh</div>
        </a>
        <a className="contact-tile" href="/pitch.html" target="_blank" rel="noopener noreferrer">
          <div className="contact-icon">▶</div>
          <div className="contact-k">Pitch Deck</div>
          <div className="contact-v">Interactive slides</div>
        </a>
      </div>
      <FooterNote />
    </div>
  );
}

function PageHeader({ kicker, title }) {
  return (
    <header className="page-header">
      <div className="page-kicker">{kicker}</div>
      <h1 className="page-title">{title}</h1>
    </header>
  );
}

function FooterNote() {
  return (
    <footer className="footer-note">
      <div>© 2026 Mike Wong</div>
      <div>Refactored with love · namike.me</div>
    </footer>
  );
}

function App() {
  const [tab, setTab] = useStateApp('today');
  const [open, setOpen] = useStateApp(null);
  const [tweaks, setTweak] = window.useTweaks(TWEAK_DEFAULTS);

  useEffectApp(() => {
    const root = document.documentElement;
    root.dataset.theme   = tweaks.theme;
    root.dataset.density = tweaks.density;
    root.dataset.layout  = tweaks.layout || 'auto';
    root.style.setProperty('--accent', ACCENTS[tweaks.accent]?.c || ACCENTS.blue.c);
  }, [tweaks]);

  return (
    <div className="shell">
      <main className="content" key={tab}>
        {tab === 'today'  && <TodayPage onOpen={setOpen} onAbout={() => setTab('about')} />}
        {tab === 'apps'   && <AppsPage  onOpen={setOpen} />}
        {tab === 'arcade' && <HacksPage onOpen={setOpen} />}
        {tab === 'about'  && <AboutPage />}
      </main>
      <TabBar active={tab} onChange={setTab} />
      <DetailSheet project={open} onClose={() => setOpen(null)} />

      <window.TweaksPanel title="Tweaks">
        <window.TweakSection label="Appearance">
          <window.TweakRadio
            label="Theme" value={tweaks.theme}
            options={[{ value: 'light', label: 'Light' }, { value: 'dark', label: 'Dark' }]}
            onChange={(v) => setTweak('theme', v)}
          />
          <window.TweakRadio
            label="Density" value={tweaks.density}
            options={[{ value: 'cozy', label: 'Cozy' }, { value: 'compact', label: 'Compact' }]}
            onChange={(v) => setTweak('density', v)}
          />
          <window.TweakSelect
            label="Accent" value={tweaks.accent}
            options={Object.entries(ACCENTS).map(([k, v]) => ({ value: k, label: v.label }))}
            onChange={(v) => setTweak('accent', v)}
          />
          <window.TweakRadio
            label="Layout" value={tweaks.layout || 'auto'}
            options={[
              { value: 'auto',    label: 'Auto'    },
              { value: 'mobile',  label: 'Mobile'  },
              { value: 'desktop', label: 'Desktop' },
            ]}
            onChange={(v) => setTweak('layout', v)}
          />
        </window.TweakSection>
      </window.TweaksPanel>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
