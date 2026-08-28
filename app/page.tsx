'use client';

import { useCallback, useState } from 'react';
import FieldMount from './components/FieldMount';
import InstrumentRail from './components/InstrumentRail';
import RagMount from './components/RagMount';
import AttentionMount from './components/AttentionMount';
import { Topbar, Reveal, TiltCard, Lift, Sheet } from './components/ui';
import { Split, Magnet, Count, Wipe } from './components/motion';
import {
  awards,
  capabilities,
  contact,
  domainColour,
  education,
  experience,
  expertise,
  pipeline,
  principles,
  projects,
  research,
  stackGroups,
  type Project,
} from './data';

export default function Home() {
  const [open, setOpen] = useState<Project | null>(null);
  const close = useCallback(() => setOpen(null), []);

  return (
    <>
      <Topbar />

      <main id="top">
        <InstrumentRail />
        {/* ------------------------------ hero ------------------------------ */}
        <section className="hero">
          <FieldMount />
          <div className="field-veil" />

          <div className="shell hero-inner">
            <Reveal>
              {/* Each credential is its own element on purpose: as bare text
                  nodes they collapse into one anonymous flex item the moment
                  the separators are hidden, and run together on narrow
                  screens. */}
              <p className="hero-kicker mono">
                <span>B.Sc. Computer Science &amp; Engineering</span>
                <span className="dot" aria-hidden="true" />
                <span>Dhaka, Bangladesh</span>
                <span className="dot" aria-hidden="true" />
                <span className="live">
                  <span className="live-dot" aria-hidden="true" />
                  AI/ML Engineer at upay
                </span>
              </p>
            </Reveal>

            <Reveal delay={90}>
              {/* One continuous letter sequence across three segments: the
                  offsets chain so it reads as a single assembly, not three. */}
              <h1
                className="display hero-title"
                aria-label="I build systems that turn data into decisions."
              >
                <Split text="I build systems that" by="char" />
                <br />
                <Split text="turn data into" by="char" offset={380} />{' '}
                {/* Not split: background-clip:text cannot clip across the
                    inline-block spans a split produces, which renders the
                    word invisible. It arrives as one unit instead, which
                    also lands the payload word harder. */}
                <em className="hero-em">decisions.</em>
              </h1>
            </Reveal>

            <Reveal delay={180}>
              <p className="prose hero-lede">
                Retrieval, risk, vision, and low-resource language — shipped as production
                software, not notebooks. Each node in the field marks a domain I work in;
                open one to see the work behind it.
              </p>
            </Reveal>

            <Reveal delay={260}>
              <div className="hero-actions">
                <Magnet>
                  <a href="#work" className="glass-btn glass-btn--hot">
                    See the work
                  </a>
                </Magnet>
                <Magnet>
                  <a href={`mailto:${contact.email}`} className="glass-btn">
                    Start a conversation
                  </a>
                </Magnet>
              </div>
            </Reveal>
          </div>
        </section>

        {/* ------------------------------ about ------------------------------ */}
        <section id="about" className="band band--md">
          <div className="shell">
            <Reveal>
              <p className="eyebrow">About</p>
            </Reveal>

            <div className="about-grid">
              <Reveal delay={80}>
                <h2 className="display h2" aria-label="A computer science graduate who ships production intelligence.">
                <Split text="A computer science graduate who ships production intelligence." />
              </h2>
                <div className="about-copy">
                  <p className="prose">
                    I&apos;m a Computer Science graduate and AI/ML engineer focused on building
                    solutions that are practical, scalable, and commercially useful.
                  </p>
                  <p className="prose">
                    My work blends machine learning, automation, product thinking, and data
                    intelligence to solve real operational problems and improve decision-making.
                  </p>
                </div>
              </Reveal>

              <Reveal delay={160}>
                <ul className="cap-list">
                  {capabilities.map((c) => (
                    <li key={c.k} className="cap-item panel panel-sm">
                      <span className="mono cap-key">{c.k}</span>
                      <span className="cap-val">{c.v}</span>
                    </li>
                  ))}
                </ul>
              </Reveal>
            </div>
          </div>
        </section>


        {/* ---------------------------- education ---------------------------- */}
        <section id="education" className="band band--joined">
          <div className="shell">
            <Reveal>
              <p className="eyebrow">Education</p>
            </Reveal>

            <div className="edu-grid">
              <Reveal delay={80}>
                <div className="panel panel-lg edu-card">
                  <p className="mono edu-years">{education.years}</p>
                  <h2 className="display edu-degree" aria-label={education.degree}>
                    <Split text={education.degree} />
                  </h2>
                  <p className="edu-school">{education.school}</p>

                  <div className="edu-prior">
                    {education.prior.map((pr) => (
                      <div key={pr.school} className="edu-prior-row">
                        <span className="edu-prior-award">{pr.award}</span>
                        <span className="edu-prior-school">{pr.school}</span>
                        <span className="mono edu-prior-meta">
                          {pr.gpa} &middot; {pr.years}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </Reveal>

              <Reveal delay={160}>
                <div className="edu-course">
                  <p className="mono edu-course-head">Relevant coursework</p>
                  {/* Thirteen courses read as a transcript in a single
                      column. On the same tile wall the stack uses, they read
                      as coverage — which is what a reader is actually
                      scanning for. Wider tiles: course names are long. */}
                  <ul className="tile-wall edu-course-list">
                    {education.coursework.map((c) => (
                      <li key={c} className="tile">
                        {c}
                      </li>
                    ))}
                  </ul>

                  <ul className="awards">
                    {awards.map((a) => (
                      <li key={a.event} className="award panel panel-sm">
                        <span className="mono award-place">{a.place}</span>
                        <span className="award-event">
                          {a.event} &middot; {a.category}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            </div>
          </div>
        </section>

        {/* ---------------------------- expertise ---------------------------- */}
        <section id="expertise" className="band band--md">
          <div className="shell">
            <Reveal>
              <p className="eyebrow">Expertise</p>
            </Reveal>
            <Reveal delay={80}>
              <h2 className="display h2" aria-label="Every system below is the same four steps.">
                <Split text="Every system below is the same four steps." />
              </h2>
              <p className="prose expertise-lede">
                Signal in, decision out. What changes between a dialect classifier, a fraud
                monitor, and a banking assistant is what fills each layer.
              </p>
            </Reveal>

            <div className="expertise-grid">
              {expertise.map((e, i) => (
                <Reveal key={e.area} delay={i * 90}>
                  <TiltCard className="expertise-card-root" max={6}>
                    <article className="rowglass expertise-card lit">
                      <h3 className="expertise-area">{e.area}</h3>
                      <p className="prose expertise-detail">{e.detail}</p>
                      <ul className="chip-row">
                        {e.tools.map((t) => (
                          <li key={t} className="chip">
                            {t}
                          </li>
                        ))}
                      </ul>
                    </article>
                  </TiltCard>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ------------------------------ stack ------------------------------ */}
        <section id="stack" className="band band--joined">
          <div className="shell">
            <Reveal>
              <p className="eyebrow">Stack</p>
            </Reveal>
            <Reveal delay={80}>
              <h2 className="display h2 band-title" aria-label="What I build with">
                <Split text="What I build with" />
              </h2>
            </Reveal>

            {/* A wall per group. Forty-eight tools read as inventory, not as
                prose, so they get a grid of equal tiles — the group heading
                carries the count and the tiles carry nothing but the name.
                (Not a <dl>: the previous markup put Reveal's <div> directly
                inside one, which is invalid, and the term/definition pairing
                was never doing any work.) */}
            <div className="stack-index">
              {stackGroups.map((g, i) => (
                <Reveal as="section" key={g.group} delay={i * 70} className="stack-group">
                  <h3 className="mono stack-group-head">
                    {g.group}
                    <span className="stack-count">{g.items.length}</span>
                  </h3>
                  <ul className="tile-wall">
                    {g.items.map((it) => (
                      <li key={it} className="tile">
                        {it}
                      </li>
                    ))}
                  </ul>
                </Reveal>
              ))}
            </div>

            <Reveal delay={200}>
              <div className="principles">
                {principles.map((p) => (
                  <div key={p.title} className="principle">
                    <h3 className="principle-title">{p.title}</h3>
                    <p className="prose principle-text">{p.text}</p>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </section>

        {/* --------------------------- experience --------------------------- */}
        <section id="experience" className="band band--lg">
          <div className="shell">
            <Reveal>
              <p className="eyebrow">Experience</p>
            </Reveal>
            <Reveal delay={80}>
              <h2 className="display h2 band-title" aria-label="From learning to building">
                <Split text="From learning to building" />
              </h2>
            </Reveal>

            <ol className="timeline">
              {experience.map((job, i) => (
                <Reveal as="li" key={job.title} delay={i * 90} className="timeline-item">
                  <div className="timeline-rail" aria-hidden="true">
                    <span className="timeline-dot" data-current={job.current} />
                  </div>

                  <div className="rowglass timeline-card">
                    <div className="timeline-head">
                      <p className="mono timeline-period">
                        {job.period}
                        {job.current && <span className="badge-now">Now</span>}
                      </p>
                      <h3 className="timeline-title">{job.title}</h3>
                      <p className="timeline-company">{job.company}</p>
                    </div>

                    <ul className="timeline-details">
                      {job.details.map((d) => (
                        <li key={d} className="prose">
                          {d}
                        </li>
                      ))}
                    </ul>
                  </div>
                </Reveal>
              ))}
            </ol>
          </div>
        </section>

        {/* ----------------------------- method ----------------------------- */}
        <section id="method" className="band band--lg">
          <div className="shell">
            <Reveal>
              <p className="eyebrow">Method</p>
            </Reveal>
            <Reveal delay={80}>
              <h2 className="display h2 band-title" aria-label="Two loops, and only one of them is glamorous">
                <Split text="Two loops, and only one" />
                <br />
                <Split text="of them is glamorous" offset={340} />
              </h2>
            </Reveal>

            <div className="method-grid">
              {/* A genuine ordered sequence, so the steps are genuinely numbered. */}
              <Reveal delay={140}>
                <div className="method-col">
                  <h3 className="method-head">
                    <span className="mono method-head-tag">Build</span>
                    Data to decision
                  </h3>
                  <ol className="pipeline">
                    {pipeline.map((step, i) => (
                      <li key={step} className="pipeline-step">
                        <span className="mono pipeline-index">
                          {String(i + 1).padStart(2, '0')}
                        </span>
                        <span className="pipeline-label">{step}</span>
                        <span
                          className="pipeline-heat"
                          style={{ '--t': i / (pipeline.length - 1) } as React.CSSProperties}
                          aria-hidden="true"
                        />
                      </li>
                    ))}
                  </ol>
                </div>
              </Reveal>

            </div>
          </div>
        </section>

        {/* ------------------------------- work ------------------------------- */}
        <section id="work" className="band band--lg">
          <div className="shell">
            <Reveal>
              <p className="eyebrow">Selected work</p>
            </Reveal>
            <Reveal delay={80}>
              <h2 className="display h2 band-title" aria-label="Systems I've built">
                <Split text="Systems I've built" />
              </h2>
            </Reveal>

            {/* The retrieval stack, rendered rather than described: the
                shape most of this work shares, before the cases themselves.
                Inline rather than in the rail — the wall below it needs the
                full measure, so this section never narrows. */}
            <Reveal delay={140}>
              <RagMount />
            </Reveal>

            <div className="work-grid">
              {projects.map((p, i) => (
                <Reveal key={p.title} delay={(i % 3) * 90}>
                  <TiltCard className="work-card-root">
                    <article
                      className="panel work-card"
                      style={{ '--dom': domainColour(p.category) } as React.CSSProperties}
                    >
                      <Lift z={26}>
                        <p className="mono work-cat">
                          <span className="work-cat-dot" aria-hidden="true" />
                          {p.category}
                        </p>
                        <h3 className="display work-title">{p.title}</h3>
                      </Lift>

                      <Lift z={16}>
                        <p className="prose work-desc">{p.description}</p>
                      </Lift>

                      {p.metrics && (
                        <Lift z={20}>
                          <dl className="work-metrics">
                            {p.metrics.map((m) => (
                              <div key={m.label}>
                                <dt className="mono work-metric-v">
                                  <Count value={m.value} />
                                </dt>
                                <dd className="work-metric-l">{m.label}</dd>
                              </div>
                            ))}
                          </dl>
                        </Lift>
                      )}

                      <Lift z={10}>
                        <ul className="chip-row">
                          {p.stack.map((t) => (
                            <li key={t} className="chip">
                              {t}
                            </li>
                          ))}
                        </ul>
                      </Lift>

                      <Lift z={30}>
                        <button
                          type="button"
                          className="glass-btn work-cta"
                          onClick={() => setOpen(p)}
                        >
                          Read the case study
                          <span aria-hidden="true">&rarr;</span>
                        </button>
                      </Lift>
                    </article>
                  </TiltCard>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ----------------------------- research ----------------------------- */}
        <section id="research" className="band band--joined">
          <div className="shell">
            <Reveal>
              <p className="eyebrow">Research</p>
            </Reveal>
            <Reveal delay={80}>
              <h2 className="display h2 band-title" aria-label="Working at the edge of language">
                <Split text="Working at the edge of language" />
              </h2>
            </Reveal>

            <p className="prose research-lede">
              Most of it is low-resource work: languages and datasets that the
              pretrained models were never really built for. The map is one
              Banglish query read four ways &mdash; the same mechanism every
              system on this page runs on.
            </p>

            <div className="research-layout">
              <Reveal delay={120}>
                <div className="research-figure">
                  <AttentionMount />
                </div>
              </Reveal>

              {/* One card per paper — four papers are a collection, and as rows the
                  last one read as a footnote to the third. */}
              <ol className="research-list">
                {research.map((r, i) => (
                  <Reveal as="li" key={r.title} delay={i * 70} className="research-entry">
                    <p className="mono research-sub">{r.subtitle}</p>
                    <h3 className="display research-title">{r.title}</h3>
                    <p className="prose research-detail">{r.detail}</p>
                    <p className="research-result mono" data-done={r.done}>
                      {r.result}
                    </p>
                  </Reveal>
                ))}
              </ol>
            </div>
          </div>
        </section>



        {/* ----------------------------- contact ----------------------------- */}
        <section id="contact" className="band band-contact">
          <div className="shell">
            <Reveal>
              <div className="panel panel-lg contact-card">
                <p className="eyebrow">Contact</p>
                <h2
                  className="display contact-title"
                  aria-label="Let's build the next intelligent system."
                >
                  <Split text="Let's build the next intelligent system." />
                </h2>
                <p className="prose contact-lede">
                  If you are solving a meaningful problem, building a smarter product, or
                  exploring AI for real-world impact, let&apos;s talk.
                </p>

                <div className="contact-actions">
                  <a href={`mailto:${contact.email}`} className="glass-btn glass-btn--hot">
                    Email me
                  </a>
                  <a
                    href={contact.github}
                    target="_blank"
                    rel="noreferrer"
                    className="glass-btn"
                  >
                    GitHub
                  </a>
                  <a
                    href={contact.linkedin}
                    target="_blank"
                    rel="noreferrer"
                    className="glass-btn"
                  >
                    LinkedIn
                  </a>
                  <a href={contact.cv} download className="glass-btn">
                    <svg
                      className="btn-icon"
                      viewBox="0 0 16 16"
                      aria-hidden="true"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M8 1.75v8.5" />
                      <path d="M4.75 7 8 10.25 11.25 7" />
                      <path d="M2.75 12.25v1.5h10.5v-1.5" />
                    </svg>
                    Download CV
                    <span className="btn-meta mono">PDF · 75 KB</span>
                  </a>
                </div>

                <dl className="contact-meta mono">
                  <div>
                    <dt>Email</dt>
                    <dd>
                      <a href={`mailto:${contact.email}`}>{contact.email}</a>
                    </dd>
                  </div>
                  <div>
                    <dt>Phone</dt>
                    <dd>
                      <a href={`tel:${contact.phone.replace(/\s/g, '')}`}>{contact.phone}</a>
                    </dd>
                  </div>
                </dl>
              </div>
            </Reveal>
          </div>
        </section>

        <footer className="footer">
          <div className="shell footer-inner mono">
            <span>Tanvir Ahmed — AI / ML Engineer</span>
            <span>Building intelligent systems for real-world problems.</span>
            <span>&copy; {new Date().getFullYear()}</span>
          </div>
        </footer>
      </main>

      {/* --------------------------- case study --------------------------- */}
      {open && (
        <Sheet onClose={close}>
          <div className="sheet-head">
            <p className="mono sheet-cat">{open.category}</p>
            <button type="button" className="glass-btn sheet-close" onClick={close}>
              Close
            </button>
          </div>

          <h2 id="sheet-title" className="display sheet-title">
            {open.title}
          </h2>
          <p className="prose sheet-lede">{open.description}</p>

          <div className="sheet-body">
            <section>
              <h3 className="eyebrow">Problem</h3>
              <p className="prose">{open.caseStudy.problem}</p>
            </section>

            <section>
              <h3 className="eyebrow">Approach</h3>
              <p className="prose">{open.caseStudy.approach}</p>
            </section>

            <section>
              <h3 className="eyebrow">Architecture</h3>
              <ol className="sheet-arch">
                {open.caseStudy.architecture.map((a, i) => (
                  <li key={a}>
                    <span className="mono sheet-arch-i">{String(i + 1).padStart(2, '0')}</span>
                    <span>{a}</span>
                  </li>
                ))}
              </ol>
            </section>

            <section>
              <h3 className="eyebrow">Result</h3>
              <p className="prose">{open.caseStudy.result}</p>
            </section>

            <section>
              <h3 className="eyebrow">What it taught me</h3>
              <p className="prose">{open.caseStudy.lesson}</p>
            </section>

            <section>
              <h3 className="eyebrow">Built with</h3>
              <ul className="chip-row">
                {open.stack.map((t) => (
                  <li key={t} className="chip">
                    {t}
                  </li>
                ))}
              </ul>
            </section>
          </div>
        </Sheet>
      )}
    </>
  );
}
