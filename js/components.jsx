// Components — App Store-flavored cards, tiles, sheet.
const { useState, useEffect, useRef } = React;

function ProjectTile({ project, size = 56, radius }) {
  const r = radius ?? Math.round(size * 0.225);
  const fontSize = Math.round(size * 0.42);
  return (
    <div style={{
      width: size, height: size, borderRadius: r,
      background: `linear-gradient(135deg, ${project.tint.from}, ${project.tint.to})`,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      color: '#fff', fontWeight: 700, fontSize, letterSpacing: '-0.02em',
      boxShadow: 'inset 0 0 0 0.5px rgba(255,255,255,0.18), inset 0 1px 0 rgba(255,255,255,0.28)',
      flexShrink: 0,
      fontFamily: '"SF Pro Rounded", "SF Pro Display", -apple-system, system-ui, sans-serif',
      textShadow: '0 1px 2px rgba(0,0,0,0.18)', userSelect: 'none',
    }}>
      {project.monogram}
    </div>
  );
}

function GetButton({ label = 'GET', onClick, dark }) {
  return (
    <button className="appstore-get" onClick={onClick} data-dark={dark ? '1' : '0'}>
      {label}
    </button>
  );
}

function Funniness({ value, max = 5 }) {
  return (
    <div className="funniness" title={`Funniness ${value}/${max}`}>
      {Array.from({ length: max }).map((_, i) => (
        <span key={i} className={'fdot' + (i < value ? ' on' : '')} />
      ))}
    </div>
  );
}

function TabBar({ active, onChange }) {
  const tabs = [
    { id: 'today',  label: 'Today', icon: '◐' },
    { id: 'apps',   label: 'Apps',  icon: '▦' },
    { id: 'arcade', label: 'Hacks', icon: '◇' },
    { id: 'about',  label: 'About', icon: '☻' },
  ];
  return (
    <nav className="tabbar" aria-label="Sections">
      {tabs.map((t) => (
        <button key={t.id} className={'tab' + (active === t.id ? ' on' : '')} onClick={() => onChange(t.id)}>
          <span className="tab-icon">{t.icon}</span>
          <span className="tab-label">{t.label}</span>
        </button>
      ))}
    </nav>
  );
}

function TodayHero({ roles, onPick }) {
  const [idx, setIdx] = useState(0);
  const [typed, setTyped] = useState('');
  const [phase, setPhase] = useState('typing');

  useEffect(() => {
    const word = roles[idx % roles.length];
    let timer;
    if (phase === 'typing') {
      if (typed.length < word.length) {
        timer = setTimeout(() => setTyped(word.slice(0, typed.length + 1)), 65);
      } else {
        timer = setTimeout(() => setPhase('hold'), 1100);
      }
    } else if (phase === 'hold') {
      timer = setTimeout(() => setPhase('deleting'), 600);
    } else if (phase === 'deleting') {
      if (typed.length > 0) {
        timer = setTimeout(() => setTyped(word.slice(0, typed.length - 1)), 30);
      } else {
        setIdx((i) => i + 1);
        setPhase('typing');
      }
    }
    return () => clearTimeout(timer);
  }, [typed, phase, idx, roles]);

  return (
    <article className="today-hero" onClick={onPick}>
      <div className="today-portrait" aria-hidden="true">
        <MikeFace size={88} />
      </div>
      <div className="today-meta">
        <span className="today-eyebrow">{"TODAY · " + new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric' }).toUpperCase()}</span>
        <span className="today-kicker">A PORTFOLIO IN PROGRESS</span>
      </div>
      <div className="today-h1-wrap">
        <span className="code-tag code-tag-open">&lt;h1&gt;</span>
        <h1 className="today-h1">
          Hi, I'm Mike,<br />
          <span className="typed-line">a <span className="typed">{typed}<span className="caret" /></span></span>
        </h1>
        <span className="code-tag code-tag-close">&lt;/h1&gt;</span>
      </div>
      <p className="today-sub">
        "Software and cathedrals are much the same — first we build them, then we pray."
      </p>
      <div className="today-foot">
        <div className="today-foot-text">
          <div className="today-name">Mike Wong</div>
          <div className="today-loc">Hong Kong · Open to new roles</div>
        </div>
        <button className="today-cta" onClick={(e) => { e.stopPropagation(); onPick(); }}>
          See Story
        </button>
      </div>
    </article>
  );
}

function MikeFace({ size = 44 }) {
  return (
    <img
      className="mike-face"
      src="/assets/mike-portrait.png"
      width={size}
      height={Math.round(size * 74 / 58)}
      alt="Mike Wong"
      draggable={false}
    />
  );
}

function FeaturedCard({ project, eyebrow, onOpen }) {
  return (
    <article
      className="featured-card"
      style={{ background: `linear-gradient(140deg, ${project.tint.from} 0%, ${project.tint.to} 100%)` }}
      onClick={() => onOpen(project)}
    >
      <div className="featured-top">
        <span className="featured-eyebrow">{eyebrow}</span>
        <span className="featured-cat">{project.category}</span>
      </div>
      <div className="featured-mid">
        <h2 className="featured-title">{project.name}</h2>
        <p className="featured-tag">{project.tagline}</p>
      </div>
      <div className="featured-foot">
        <ProjectTile project={project} size={56} />
        <div className="featured-foot-text">
          <div className="featured-name">{project.name}</div>
          <div className="featured-sub">{project.summary}</div>
        </div>
        <GetButton dark onClick={(e) => { e.stopPropagation(); onOpen(project); }} />
      </div>
    </article>
  );
}

function AppRow({ project, onOpen, divider }) {
  return (
    <div
      role="button" tabIndex={0}
      className={'app-row' + (divider ? ' with-divider' : '')}
      onClick={() => onOpen(project)}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onOpen(project); } }}
    >
      <ProjectTile project={project} size={60} />
      <div className="app-row-text">
        <div className="app-row-title">{project.name}</div>
        <div className="app-row-tag">{project.tagline}</div>
        <div className="app-row-meta">{project.category}</div>
      </div>
      <GetButton onClick={(e) => { e.stopPropagation(); onOpen(project); }} />
    </div>
  );
}

function SectionHeader({ kicker, title, action, onAction }) {
  return (
    <header className="section-header">
      <div className="section-text">
        {kicker && <div className="section-kicker">{kicker}</div>}
        <h3 className="section-title">{title}</h3>
      </div>
      {action && (
        <button className="section-action" onClick={onAction}>
          {action} <span aria-hidden="true">›</span>
        </button>
      )}
    </header>
  );
}

function MidCard({ project, rank, onOpen }) {
  return (
    <div
      role="button" tabIndex={0} className="mid-card"
      onClick={() => onOpen(project)}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onOpen(project); } }}
    >
      {rank != null && <div className="mid-rank">{rank}</div>}
      <ProjectTile project={project} size={84} radius={20} />
      <div className="mid-text">
        <div className="mid-title">{project.name}</div>
        <div className="mid-tag">{project.category}</div>
        <div className="mid-funniness"><Funniness value={project.funniness} /></div>
      </div>
      <GetButton onClick={(e) => { e.stopPropagation(); onOpen(project); }} />
    </div>
  );
}

function DetailSheet({ project, onClose }) {
  useEffect(() => {
    if (!project) return;
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [project, onClose]);

  if (!project) return null;

  return (
    <div className="sheet-backdrop" onClick={onClose}>
      <div className="sheet" onClick={(e) => e.stopPropagation()}>
        <button className="sheet-close" onClick={onClose} aria-label="Close"><span>✕</span></button>

        <div className="sheet-hero"
             style={{ background: `linear-gradient(160deg, ${project.tint.from}, ${project.tint.to})` }}>
          <ProjectTile project={project} size={128} radius={28} />
          <div className="sheet-hero-text">
            <div className="sheet-cat">{project.category.toUpperCase()}</div>
            <h2 className="sheet-title">{project.name}</h2>
            <p className="sheet-tag">{project.tagline}</p>
            <div className="sheet-cta-row">
              <a className="sheet-get" href={project.url} target="_blank" rel="noopener noreferrer"
                 onClick={(e) => { if (project.url === '#') e.preventDefault(); }}>
                {project.url === '#' ? 'CONCEPT' : 'GET'}
              </a>
              <span className="sheet-fineprint">In-Browser Purchases · Free</span>
            </div>
          </div>
        </div>

        <div className="sheet-stats">
          <div className="stat">
            <div className="stat-num">{project.funniness}<span className="stat-of">/5</span></div>
            <div className="stat-label">Funniness</div>
            <Funniness value={project.funniness} />
          </div>
          <div className="stat">
            <div className="stat-num">{project.platform.split(' · ').length}</div>
            <div className="stat-label">Platforms</div>
            <div className="stat-sub">{project.platform}</div>
          </div>
          <div className="stat">
            <div className="stat-num">{project.language}</div>
            <div className="stat-label">Language</div>
            <div className="stat-sub">&nbsp;</div>
          </div>
          <div className="stat">
            <div className="stat-num">{project.started.split(' ')[1]}</div>
            <div className="stat-label">{project.started.split(' ')[0]}</div>
            <div className="stat-sub">started</div>
          </div>
        </div>

        <section className="sheet-section">
          <h3 className="sheet-section-title">What is it</h3>
          <p className="sheet-body">{project.blurb}</p>
        </section>

        <section className="sheet-section">
          <h3 className="sheet-section-title">Preview</h3>
          <div className="sheet-screens">
            {[0, 1, 2].map((i) => (
              <div key={i} className="screen-frame">
                <div className="screen-fill"
                     style={{ background: `linear-gradient(${140 + i * 30}deg, ${project.tint.from}, ${project.tint.to})` }}>
                  <div className="screen-mono">{project.monogram}</div>
                  <div className="screen-cap">{i === 0 ? 'Home' : i === 1 ? 'Detail' : 'Action'}</div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="sheet-section">
          <h3 className="sheet-section-title">Information</h3>
          <dl className="info-grid">
            <div><dt>Maker</dt><dd>Mike Wong</dd></div>
            <div><dt>Category</dt><dd>{project.category}</dd></div>
            <div><dt>Platform</dt><dd>{project.platform}</dd></div>
            {project.stack && <div className="info-wide"><dt>Stack</dt><dd>{project.stack}</dd></div>}
            <div><dt>Language</dt><dd>{project.language}</dd></div>
            <div><dt>Started</dt><dd>{project.started}</dd></div>
            <div><dt>Funniness</dt><dd>{project.funniness} of 5</dd></div>
          </dl>
        </section>
      </div>
    </div>
  );
}

Object.assign(window, {
  ProjectTile, GetButton, Funniness, TabBar,
  TodayHero, FeaturedCard, AppRow, SectionHeader, MidCard, DetailSheet,
  MikeFace,
});
