# Claude Academy — Project Notes

## Overview

Static multilingual course site (EN + VI). Built with **Pug + PostCSS + TypeScript + esbuild**, dev tooling lives in `_develop/`.

- Live URL: `https://chobadon.com/claude-academy/`
- Courses: `claude-101`, `ai-fluency`, `building-with-claude-api`, `claude-code-101`

---

## Directory Structure

```
claude-academy/
├── data/                        # JSON lesson content (one file per lesson)
│   └── claude-101/
│       ├── intro.json
│       ├── working-with-skills.json
│       ├── connecting-your-tools.json
│       └── enterprise-search.json   ← stub (empty sections)
├── _develop/
│   ├── src/
│   │   ├── pug/
│   │   │   ├── utils/_lesson.pug    # shared lesson layout
│   │   │   └── claude-101/          # one .pug per lesson
│   │   ├── css/pages/_lesson/
│   │   │   ├── _style_pc.css
│   │   │   └── _style_sp.css        # mobile styles
│   │   └── ts/                      # TypeScript
│   └── (build config)
└── assets/
```

---

## Lesson JSON Schema

```json
{
  "slug": "lesson-slug",
  "titleEn": "Lesson Title",
  "titleVi": "Tiêu đề bài",
  "estimatedTimeEn": "20 minutes",
  "estimatedTimeVi": "20 phút",
  "prevLesson": "previous-slug",
  "nextLesson": "next-slug",
  "summaryEn": "...",
  "summaryVi": "...",
  "sections": [
    {
      "id": "section-id",
      "titleEn": "Section Title",
      "titleVi": "Tiêu đề mục",
      "en": "<p>HTML content...</p>",
      "vi": "<p>Nội dung HTML...</p>",
      "image": "",
      "video": ""
    }
  ]
}
```

- `en` / `vi` fields: HTML string, double quotes inside must be escaped as `\"`
- `image` / `video`: empty string if unused

---

## Pug Stub Template

```pug
extends ../utils/_lesson.pug

block append meta
  -
    var courseId = 'claude-101'
    var currentSlug = 'lesson-slug'
    var lessonData = JSON.parse(nodeFs.readFileSync(nodePath.join(process.cwd(), '../data/claude-101/lesson-slug.json'), 'utf8'))
    title = lessonData.titleEn + ' · Claude 101 · Claude Academy'
    description = 'Meta description here.'
    baseURL = 'https://chobadon.com/claude-academy/'
    ogImageURL = baseURL + 'assets/images/ogp.png'
    canonicalURL = `${baseURL}${courseId}/${currentSlug}/`
```

- `process.cwd()` = `_develop/` → `../data/` = project root `data/`
- `nodeFs` and `nodePath` are injected globally into Pug

---

## Bilingual Toggle

- Default mode: bilingual (both EN + VI shown)
- `data-lang="en"` or `data-lang="vi"` on `.lesson-body` hides the other language
- localStorage key: `claude-academy-lang`

---

## Workflow: Adding a New Lesson

1. User provides HTML file (source content)
2. Extract content from `id="lesson-main-content"`
3. Check for images (`<img>`) and videos (YouTube embeds)
4. Create `data/claude-101/<slug>.json` with full EN + VI content
5. Create `_develop/src/pug/claude-101/<slug>.pug` stub
6. Update previous lesson's JSON: set `nextLesson` to new slug
7. Create stub JSON for the *next* lesson (if not exists): empty sections, `prevLesson` set
8. Run `npm run build:pug` from `_develop/` to compile HTML output
9. Verify build output in `public_html/claude-academy/claude-101/`

---

## Workflow: When User Provides a Folder Path

When the user provides a folder path and asks to add or fix a lesson:

1. **Find the HTML file** — search inside the given folder for the `.html` file (Skilljar lesson export)
2. **Extract content** from `div.lesson-description-content` inside `#details-pane` (NOT from the main video area)
3. **Images** — download all images from the `_files/` subfolder next to the HTML, copy to `_develop/src/images/lesson/` with clean names (e.g. `{slug}-01.png`), then run `npm run build:image`. Use path `/claude-academy/assets/images/lesson/{filename}` in JSON
4. **Video** — if the lesson has a JW Player video, confirm with the user and ask them to provide the manifest URL (`https://cdn.jwplayer.com/manifests/{mediaId}.m3u8`). Do NOT proceed with video embed until URL is confirmed
5. **Content rules**:
   - Anthropic's original content → inline lesson `sections[]`
   - Any supplementary/explanatory content written by Claude → `supplementEn` / `supplementVi` fields (rendered in the Deep Dive modal, NOT inline)
6. Run `npm run build:pug` after all JSON/Pug changes

---

## claude-with-the-anthropic-api — Lesson Status

Legend: ✅ done (Anthropic content + supplement) | 📝 self-written (no supplement yet) | 💬 exercise/stub with content | ⬜ stub (empty)

| Section | Slug | Status |
|---------|------|--------|
| Introduction | `welcome-to-the-course` | 💬 exercise |
| Anthropic overview | `overview-of-claude-models` | 📝 self-written |
| Accessing Claude with the API | `accessing-the-api` | ✅ done |
| | `getting-an-api-key` | 📝 self-written |
| | `making-a-request` | ✅ done |
| | `multi-turn-conversations` | 📝 self-written |
| | `chat-exercise` | 💬 exercise |
| | `system-prompts` | ✅ done |
| | `system-prompts-exercise` | 💬 exercise |
| | `temperature` | ✅ done |
| | `response-streaming` | ✅ done |
| | `structured-data` | ✅ done |
| | `structured-data-exercise` | ⬜ stub |
| Prompt evaluation | `prompt-evaluation` | ⬜ stub |
| | `a-typical-eval-workflow` | ⬜ stub |
| | `generating-test-datasets` | ⬜ stub |
| | `running-the-eval` | ⬜ stub |
| | `model-based-grading` | ⬜ stub |
| | `code-based-grading` | ⬜ stub |
| | `exercise-on-prompt-evals` | ⬜ stub |
| Prompt engineering techniques | `prompt-engineering` | ⬜ stub |
| | `being-clear-and-direct` | ⬜ stub |
| | `being-specific` | ⬜ stub |
| | `structure-with-xml-tags` | ⬜ stub |
| | `providing-examples` | ⬜ stub |
| | `exercise-on-prompting` | ⬜ stub |
| Tool use with Claude | `introducing-tool-use` | ⬜ stub |
| | `project-overview` | ⬜ stub |
| | `tool-functions` | ⬜ stub |
| | `tool-schemas` | ⬜ stub |
| | `handling-message-blocks` | ⬜ stub |
| | `sending-tool-results` | ⬜ stub |
| | `multi-turn-conversations-with-tools` | ⬜ stub |
| | `implementing-multiple-turns` | ⬜ stub |
| | `using-multiple-tools` | ⬜ stub |
| | `fine-grained-tool-calling` | ⬜ stub |
| | `the-text-edit-tool` | ⬜ stub |
| | `the-web-search-tool` | ⬜ stub |
| RAG and Agentic Search | `introducing-retrieval-augmented-generation` | ⬜ stub |
| | `text-chunking-strategies` | ⬜ stub |
| | `text-embeddings` | ⬜ stub |
| | `the-full-rag-flow` | ⬜ stub |
| | `implementing-the-rag-flow` | ⬜ stub |
| | `bm25-lexical-search` | ⬜ stub |
| | `a-multi-index-rag-pipeline` | ⬜ stub |
| Features of Claude | `extended-thinking` | ⬜ stub |
| | `image-support` | ⬜ stub |
| | `pdf-support` | ⬜ stub |
| | `citations` | ⬜ stub |
| | `prompt-caching` | ⬜ stub |
| | `rules-of-prompt-caching` | ⬜ stub |
| | `prompt-caching-in-action` | ⬜ stub |
| | `code-execution-and-the-files-api` | ⬜ stub |
| Model Context Protocol | `introducing-mcp` | ⬜ stub |
| | `mcp-clients` | ⬜ stub |
| | `mcp-project-setup` | ⬜ stub |
| | `defining-tools-with-mcp` | ⬜ stub |
| | `the-server-inspector` | ⬜ stub |
| | `implementing-a-client` | ⬜ stub |
| | `defining-resources` | ⬜ stub |
| | `accessing-resources` | ⬜ stub |
| | `defining-prompts` | ⬜ stub |
| | `prompts-in-the-client` | ⬜ stub |
| | `mcp-review` | ⬜ stub |
| Anthropic apps | `anthropic-apps` | ⬜ stub |
| | `claude-code-setup` | ⬜ stub |
| | `claude-code-in-action` | ⬜ stub |
| | `enhancements-with-mcp-servers` | ⬜ stub |
| Agents and workflows | `agents-and-workflows` | ⬜ stub |
| | `parallelization-workflows` | ⬜ stub |
| | `chaining-workflows` | ⬜ stub |
| | `routing-workflows` | ⬜ stub |
| | `agents-and-tools` | ⬜ stub |
| | `environment-inspection` | ⬜ stub |
| | `workflows-vs-agents` | ⬜ stub |
| Wrapping up! | `course-wrap-up` | ⬜ stub |

---

## Claude 101 — Lesson Chain

| Order | Slug | Status |
|-------|------|--------|
| 1 | `intro` | done |
| 2 | `working-with-skills` | done |
| 3 | `connecting-your-tools` | done |
| 4 | `enterprise-search` | stub only |
| 5 | `research-mode` | done |
| 6 | `use-cases-by-role` | pending |
| 7 | `other-ways-to-work` | pending |
| 8 | `whats-next` | pending |
| 9 | `certificate` | pending |

---

## CSS: Roadmap Component

### PC (`_style_pc.css`)
```css
.roadmap-steps { display: flex; flex: 1; flex-direction: row; align-items: stretch; gap: 8px; }
.roadmap-step  { display: flex; flex: 1; flex-direction: column; min-width: 0; }
.roadmap-card  { display: flex; align-items: center; justify-content: center; height: 58px; margin-bottom: 8px; padding: 0 8px; border-radius: 8px; color: var(--color-white); font-size: rem(11); font-weight: 700; line-height: 1.4; text-align: center; }
.roadmap-desc  { color: var(--color-text-sub) !important; font-size: rem(12) !important; line-height: 1.4 !important; text-align: left; }
.roadmap-arrow { flex-shrink: 0; padding-top: 18px; color: var(--color-text-sub); }
```

Color classes: `.c1` `#6b9fd4` / `.c2` `#7ab5a0` / `.c3` `#c4956a` / `.c4` `#9b7fc4` / `.c5` `#d47a7a`

### Mobile (`_style_sp.css`)
- `.roadmap-steps`: `flex-direction: column; gap: 8px`
- `.roadmap-step`: `flex-direction: column` (card is full-width)
- `.roadmap-arrow`: `display: flex; justify-content: center` + `svg { transform: rotate(90deg) }`
  - HTML already omits `.roadmap-arrow` after the last step — no extra CSS needed

---

## CSS Property Order Convention

Per project memory: **font/color first → position → layout → box model → border → effects**

---

## Common Pitfalls

- **Unescaped double quotes in JSON**: Any `"text"` inside `en`/`vi` HTML strings must be `\"text\"`
- **Build runs from `_develop/`**: All relative paths in Pug/JS are relative to `_develop/`
- Never remove `.roadmap-arrow` from HTML — last step naturally has no `.roadmap-arrow` sibling
