#!/usr/bin/env node
/**
 * Build-time asset generation.
 *
 *   public/resume/khang-nguyen-tran-resume.pdf   ← the downloadable resume
 *   public/og/og.png                             ← social preview image
 *   public/apple-touch-icon.png                  ← iOS home-screen icon
 *
 * Everything is rendered from src/data/*.json, so the site and the PDF can
 * never drift apart. Requires the Playwright Chromium build:
 *   npm run test:e2e:install
 *
 * See docs/adr/ADR-0010-resume-generation.md
 */
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from '@playwright/test';

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const readJson = async (name) => JSON.parse(await readFile(join(root, 'src/data', name), 'utf8'));

const [profile, experience, caseStudies, skills, education] = await Promise.all([
  readJson('profile.json'),
  readJson('experience.json'),
  readJson('case-studies.json'),
  readJson('skills.json'),
  readJson('education.json'),
]);

const escape = (value) =>
  String(value).replace(
    /[&<>"']/g,
    (character) =>
      ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[character],
  );

// ---------------------------------------------------------------------------
// Resume
// ---------------------------------------------------------------------------

const contactLine = [
  profile.email,
  profile.phone.display,
  profile.location.display,
  `linkedin.com/in/khangnguyentran`,
  'github.com/MEGAFICER',
]
  .map(escape)
  .join('  ·  ');

const experienceHtml = experience.roles
  .map(
    (role) => `
      <section class="role">
        <div class="role-head">
          <div>
            <h3>${escape(role.role)} — ${escape(role.company)}</h3>
            <p class="sub">${escape(role.location)}${role.formerName ? ` · ${escape(role.formerName)}` : ''}</p>
          </div>
          <p class="dates">${escape(role.period)}</p>
        </div>
        <ul>
          ${role.highlights.map((highlight) => `<li>${escape(highlight)}</li>`).join('\n')}
        </ul>
      </section>`,
  )
  .join('\n');

const workHtml = caseStudies.studies
  .map(
    (study) => `
      <li>
        <strong>${escape(study.name)}</strong> — ${escape(study.context)}.
        ${study.scale.map((metric) => `${escape(metric.value)} ${escape(metric.label)}`).join(', ')}.
      </li>`,
  )
  .join('\n');

const skillsHtml = skills.groups
  .map(
    (group) =>
      `<p class="skill"><span class="skill-label">${escape(group.name)}:</span> ${group.items.map(escape).join(', ')}</p>`,
  )
  .join('\n');

const educationHtml = education.degrees
  .map(
    (degree) => `
      <div class="edu">
        <div>
          <h3>${escape(degree.degree)}</h3>
          <p class="sub">${escape(degree.school)} · ${escape(degree.location)}</p>
        </div>
        <p class="dates">${escape(degree.period)}</p>
      </div>`,
  )
  .join('\n');

const researchHtml = education.research
  .map(
    (project) =>
      `<li><strong>${escape(project.title)}</strong> (${escape(project.kind)}, ${escape(project.period)}). ${escape(project.detail)}</li>`,
  )
  .join('\n');

const resumeHtml = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<title>${escape(profile.name)} — ${escape(profile.role)}</title>
<style>
  @page { size: A4; }
  * { box-sizing: border-box; }
  body {
    margin: 0;
    font-family: Helvetica, Arial, "Liberation Sans", sans-serif;
    font-size: 8.6pt;
    line-height: 1.34;
    color: #111;
  }
  h1 { font-size: 19pt; margin: 0; letter-spacing: -0.5pt; }
  .role-line { font-size: 9.5pt; letter-spacing: 1.6pt; text-transform: uppercase; margin: 2pt 0 3pt; color: #8a3a10; }
  .contact { font-size: 8pt; color: #333; }
  .rule { border-top: 1.2pt solid #111; margin: 7pt 0 8pt; }
  h2 {
    font-size: 8pt;
    letter-spacing: 1.4pt;
    text-transform: uppercase;
    border-bottom: 0.6pt solid #bbb;
    padding-bottom: 2pt;
    margin: 9pt 0 5pt;
  }
  h3 { font-size: 9.2pt; margin: 0; }
  .role { margin-bottom: 7pt; page-break-inside: avoid; }
  .role-head, .edu { display: flex; justify-content: space-between; gap: 12pt; align-items: baseline; }
  .dates { font-size: 8pt; white-space: nowrap; color: #444; margin: 0; }
  .sub { font-size: 8pt; color: #555; margin: 1pt 0 0; }
  ul { margin: 3pt 0 0; padding-left: 11pt; }
  li { margin-bottom: 1.8pt; }
  p { margin: 0; }
  .summary { margin-top: 2pt; }
  .skill { margin-bottom: 2pt; }
  .skill-label { font-weight: bold; }
  .edu { margin-bottom: 5pt; }
  .awards { margin: 0; padding-left: 11pt; }
</style>
</head>
<body>
  <header>
    <h1>${escape(profile.name)}</h1>
    <p class="role-line">${escape(profile.role)}</p>
    <p class="contact">${contactLine}</p>
  </header>
  <div class="rule"></div>

  <h2>Summary</h2>
  <p class="summary">${escape(profile.summary)}</p>

  <h2>Experience</h2>
  ${experienceHtml}

  <h2>Selected work</h2>
  <ul>${workHtml}</ul>

  <h2>Skills</h2>
  ${skillsHtml}

  <h2>Education</h2>
  ${educationHtml}

  <h2>Research &amp; projects</h2>
  <ul>${researchHtml}</ul>

  <h2>Awards</h2>
  <ul class="awards">
    ${education.awards.map((award) => `<li>${escape(award.title)} — ${escape(award.year)}</li>`).join('\n')}
  </ul>

  <h2>Availability</h2>
  <p>${escape(profile.availability.status)}. ${escape(profile.availability.note)} Regions: ${escape(profile.availability.regions.join(', '))}. Modes: ${escape(profile.availability.modes.join(', '))}.</p>
</body>
</html>`;

// ---------------------------------------------------------------------------
// Social preview + touch icon
// ---------------------------------------------------------------------------

const ogHtml = `<!doctype html>
<html lang="en"><head><meta charset="utf-8" /><style>
  * { box-sizing: border-box; }
  body {
    margin: 0; width: 1200px; height: 630px; overflow: hidden;
    background: #0a0d10; color: #e9eef3;
    font-family: Helvetica, Arial, sans-serif;
    padding: 72px; display: flex; flex-direction: column; justify-content: space-between;
    background-image:
      linear-gradient(to right, rgba(233,238,243,0.05) 1px, transparent 1px),
      linear-gradient(to bottom, rgba(233,238,243,0.05) 1px, transparent 1px);
    background-size: 72px 72px;
  }
  .top { display: flex; align-items: center; gap: 18px; }
  .mark {
    width: 56px; height: 56px; border: 1px solid #354150; border-radius: 3px;
    display: grid; place-items: center; color: #f0995e;
    font-family: ui-monospace, Menlo, monospace; font-size: 22px; font-weight: 600;
  }
  .kicker { font-family: ui-monospace, Menlo, monospace; font-size: 15px; letter-spacing: 3.4px; text-transform: uppercase; color: #8b98a5; }
  h1 { font-size: 82px; line-height: 0.98; letter-spacing: -3px; margin: 0 0 18px; max-width: 15ch; }
  .role { font-size: 27px; color: #a3b0bc; max-width: 30ch; line-height: 1.35; }
  .foot { display: flex; justify-content: space-between; align-items: flex-end; font-family: ui-monospace, Menlo, monospace; font-size: 15px; letter-spacing: 2px; text-transform: uppercase; color: #8b98a5; }
  .accent { color: #f0995e; }
</style></head>
<body>
  <div class="top">
    <div class="mark">KT</div>
    <div class="kicker">Physical design engineer</div>
  </div>
  <div>
    <h1>${escape(profile.name)}</h1>
    <p class="role">Netlist to GDSII, floorplan to signoff. 3.5 years of advanced-node physical design.</p>
  </div>
  <div class="foot">
    <span>Ottawa · Montréal · Toronto</span>
    <span class="accent">Winter 2027 / Summer 2027</span>
  </div>
</body></html>`;

const iconHtml = `<!doctype html>
<html><head><meta charset="utf-8" /><style>
  html, body { margin: 0; width: 180px; height: 180px; }
  body {
    background: #0a0d10; display: grid; place-items: center;
    font-family: ui-monospace, Menlo, monospace; color: #e9eef3; font-size: 62px; font-weight: 600;
    letter-spacing: -2px; border: 10px solid #0a0d10; outline: 2px solid #354150; outline-offset: -12px;
  }
  .dot { color: #f0995e; }
</style></head>
<body>K<span class="dot">T</span></body></html>`;

// ---------------------------------------------------------------------------

async function main() {
  const browser = await chromium.launch({
    args: process.env.CI ? ['--no-sandbox'] : [],
  });

  try {
    const page = await browser.newPage();

    // Resume PDF ------------------------------------------------------------
    await page.setContent(resumeHtml, { waitUntil: 'load' });
    const resumePath = join(root, 'public/resume/khang-nguyen-tran-resume.pdf');
    await mkdir(dirname(resumePath), { recursive: true });
    const pdfOptions = {
      format: 'A4',
      printBackground: true,
      margin: { top: '12mm', bottom: '12mm', left: '13mm', right: '13mm' },
    };
    try {
      await page.pdf({ ...pdfOptions, tagged: true, outline: true, path: resumePath });
    } catch {
      // Older Chromium builds do not support tagged PDF output.
      await page.pdf({ ...pdfOptions, path: resumePath });
    }
    console.log(`✓ resume   ${resumePath}`);

    // Open Graph image ------------------------------------------------------
    const ogPage = await browser.newPage({
      viewport: { width: 1200, height: 630 },
      deviceScaleFactor: 1,
    });
    await ogPage.setContent(ogHtml, { waitUntil: 'load' });
    const ogPath = join(root, 'public/og/og.png');
    await mkdir(dirname(ogPath), { recursive: true });
    await ogPage.screenshot({ path: ogPath, type: 'png' });
    console.log(`✓ og image ${ogPath}`);

    // Apple touch icon ------------------------------------------------------
    const iconPage = await browser.newPage({
      viewport: { width: 180, height: 180 },
      deviceScaleFactor: 1,
    });
    await iconPage.setContent(iconHtml, { waitUntil: 'load' });
    const iconPath = join(root, 'public/apple-touch-icon.png');
    await iconPage.screenshot({ path: iconPath, type: 'png' });
    console.log(`✓ icon     ${iconPath}`);

    // Keep a copy of the generated markup for debugging snaps.
    await mkdir(join(root, '.astro'), { recursive: true });
    await writeFile(join(root, '.astro/resume-preview.html'), resumeHtml, 'utf8');
  } finally {
    await browser.close();
  }
}

main().catch((error) => {
  console.error('\nAsset generation failed.');
  console.error('If Chromium is missing, run: npm run test:e2e:install\n');
  console.error(error);
  process.exit(1);
});
