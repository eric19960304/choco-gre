# Choco GRE — Vocabulary & Verbal Practice

Choco GRE is a mobile-first, browser-based GRE preparation tool. It ships with a prepared list of 1,000 GRE words ranked by study priority and 100 original Verbal Reasoning practice questions. It stores learning progress locally, schedules vocabulary reviews, records question attempts, and works without a backend or account.

## Run it locally

Requirements:

- Node.js 20 or newer
- npm 10 or newer

Install dependencies and start the development server:

```bash
npm install
npm run dev
```

Vite runs at **http://localhost:5173** by default. If that port is occupied, Vite automatically selects the next available port and prints the actual URL in the terminal.

To require a specific port:

```bash
npm run dev -- --port 4173 --strictPort
```

Then open **http://localhost:4173**.

## Commands

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the Vite development server (default port 5173) |
| `npm run generate:practice` | Validate and regenerate both copies of the 100-question practice bank |
| `npm run typecheck` | Run strict TypeScript checking without emitting files |
| `npm test` | Run all Vitest tests once |
| `npm run test:watch` | Run Vitest in watch mode |
| `npm run build` | Type-check and create the GitHub Pages artifact in `docs/` |
| `npm run preview` | Preview the production build locally (default port 4173) |

Preview the generated production build with:

```bash
npm run preview
```

Vite preview uses **http://localhost:4173** by default.

## Technical architecture

- **React + TypeScript:** component UI and strict application types.
- **Vite:** development server, module bundling, and production builds.
- **Tailwind CSS:** mobile-first layout and a custom warm editorial design system. Tailwind is connected with the official Vite plugin.
- **React Context + custom hooks:** a vocabulary context owns learning state, while a focused practice-history hook records Verbal Reasoning attempts. No external state-management library is needed for this dataset size.
- **localStorage:** dedicated service modules handle vocabulary data and practice history. Components do not access persistence directly.
- **Web Speech API:** word and example-sentence pronunciation uses Chrome's built-in `speechSynthesis` engine. The app prefers a Google US English voice when Chrome exposes one, falls back to another English voice, and does not download or store audio files.
- **Vitest:** tests vocabulary scheduling and validation as well as all question-bank structures, GRE answer rules, history persistence, and the end-to-end submit/reveal flow.

The main source layout is:

```text
src/
  components/     Reusable navigation, forms, cards, dialogs, flashcards, and toasts
  constants/      Review interval constants
  data/           Bundled vocabulary and Verbal Reasoning datasets
  hooks/          Vocabulary, practice-history, and theme state
  pages/          Words, Review, Practice, and Progress screens
  services/       Device-local persistence and import/export boundaries
  test/           Shared test setup and fixtures
  types/          Vocabulary and review TypeScript models
  utils/          Pure date, filtering, validation, ID, and scheduling functions
```

### Why localStorage instead of SQLite?

The app is intentionally client-only and holds a small personal study dataset. localStorage keeps startup immediate after the first load, needs no database server, and satisfies offline personal use. History is tied to the current browser and device rather than an account. All storage access is isolated, so persistence can be replaced later if multi-device synchronization is required.

## First-run data and persistence

`src/data/seedVocabulary.json` contains the app-ready 1,000-word list with rank, part of speech, English definition, Traditional Chinese meaning, available example sentence, a `commonAffixes` array, and an optional `affixMemoryHint`. Despite the legacy field name, each retained item may be a meaning-bearing prefix, root, or suffix. The memory hint connects those parts to that specific word's definition. Words without an honest, learner-useful breakdown have an empty array and no hint. The source dataset, including evidence signals used during ranking and equivalent `common_affixes` and `affix_memory_hint` fields, is `gre_vocabulary_1000_zh_TW.json` in the project root.

Run `npm run annotate:affixes` to validate both 1,000-word files and regenerate their word-part annotations from the curated, offline rules in `scripts/annotate-vocabulary-affixes.mjs`. The current audit examines all 1,000 entries and retains 305 meaning-linked parts for 216 words. Broad grammar-only endings such as `-ous`, `-al`, `-ive`, and `-tion` are deliberately excluded. Alternative senses use semicolons for quick scanning. The generator rejects duplicate clues, malformed notation, overly long explanations, and “or” separators, and it requires a word-specific memory link for every annotated word. The annotation process does not call an external dictionary or web service.

On the first visit, the storage service:

1. Converts each seed record to the complete `VocabularyWord` model.
2. Adds IDs, timestamps, review counters, and useful starter tags.
3. Saves the result under the versioned `lexilo:vocabulary:v1` localStorage key.

Every later visit loads that saved snapshot instead of rebuilding the seed. Edits, review results, mastery state, imports, and deletions persist across refreshes. When bundled seed metadata is revised, the storage migration updates seed-word priority ranks, meaning-linked word parts, memory hints, and `Top 100`/`Top 300` tags while preserving the learner's review history and edits. Clearing site data in the browser resets the app to the bundled seed on the next launch.

The light/dark preference is stored separately under `lexilo:theme`.

The internal `lexilo:*` storage-key prefix is intentionally retained after the Choco GRE rename so existing learners keep their saved vocabulary progress, theme preference, and practice history.

## What the vocabulary rank means

`rank` is an evidence-weighted **study-priority rank**: rank 1 should be studied before rank 2. It is not an official count of appearances on live GRE tests. ETS does not publish a complete 1,000-word frequency table for operational test questions, so an exact claim of that kind would not be supportable.

The ranking combines these signals, from strongest to weakest:

1. Inclusion in Magoosh's current top-20 most-tested list.
2. Agreement across three independently published high-frequency shortlists: Magoosh Top 20, Kaplan Top 100 (Top 52 plus the next 48), and CrunchPrep 101.
3. Conservatively cleaned matches reported for public ETS Official Guide material. Very short words and obvious substring-count outliers are not treated as reliable counts.
4. Agreement across the broader Magoosh 1,000, Manhattan 500, and Barron's 333 study lists.
5. Source-list position and general English corpus frequency only as tie-breakers.

Sources used for the audit:

- [Magoosh: Best GRE Word Lists and Top 20 Most Tested Words](https://magoosh.com/gre/best-and-worst-gre-word-lists/)
- [Kaplan: Top 52 GRE Vocabulary Words](https://www.kaptest.com/study/gre/top-52-gre-vocabulary-words/)
- [Kaplan: The Next 48 GRE Vocabulary Words](https://www.kaptest.com/study/gre/top-48-gre-vocabulary-words/)
- [CrunchPrep: 101 High-Frequency GRE Words](https://crunchprep.com/assets/uploads/2015/10/101-High-Frequency-GRE-words-CrunchPrepGRE.pdf)
- [GRE Prep Club: vocabulary frequency in public ETS material](https://gre.myprepclub.com/forum/gre-prep-club-official-vocabulary-lists-for-the-gre-20466.html)

Each source record has a `rank_signals` object showing its publisher-shortlist memberships, broader-list overlap count, and usable ETS-guide match count. Exact ordering among words with similar evidence remains approximate, but alphabetical source order is never used as a ranking signal. In the website, the Words page defaults to the **New** status and **Study priority** sorting, and shows the rank on each card.

## GRE Verbal Reasoning practice bank

`gre_verbal_practice_100.json` is the readable source artifact. The app bundles an identical copy at `src/data/verbalPracticeQuestions.json`. Running `npm run generate:practice` validates the answer keys and regenerates both files from `scripts/build-verbal-practice.mjs`.

The bank contains:

| Type | Questions | Supported interaction |
| --- | ---: | --- |
| Reading Comprehension | 40 | Five-choice single selection and three-choice “select all that apply” |
| Text Completion | 30 | One to three independent blanks; one selection per blank |
| Sentence Equivalence | 30 | Exactly two selections from six choices |

Every question contains a stable ID, sequence number, difficulty, directions, response groups, correct answer, explanation, skills, and source disclosure. Reading Comprehension questions reference one of 20 reusable passages. The generic `responseGroups` representation lets the scoring utility handle single answers, multiple answers, and independent blanks without type-specific answer hacks.

The format follows the structures described in the [official ETS Verbal Reasoning overview](https://www.ets.org/gre/test-takers/general-test/prepare/content/verbal-reasoning.html). All question wording, passages, distractors, answer keys, and explanations in this repository are original GRE-style practice created for Choco GRE. They are not official ETS questions, copied commercial questions, or recalled live-test content.

On the Practice page, the user can:

1. Filter by question type and by unanswered, answered, or incorrect status.
2. Select answers with accessible single- or multiple-selection buttons.
3. Submit only after every required answer is present.
4. See the correct choices and explanation immediately.
5. Retry a question or move between questions.
6. Open History to review every saved attempt and its original response.

Attempts are stored under `lexilo:practice:v1`. Each history record contains the question ID, selected response, correctness, and answer time. History survives refreshes on the same browser and device. Clearing site data removes it.

## Spaced-repetition behavior

Opening a word from the Words page marks it as viewed and adds it to the learner's personal review pool. Untouched words in the bundled 1,000-word library are excluded. Review sessions include only viewed, unmastered words whose `nextReviewAt` is now or earlier, and shuffle that queue once when the session starts. Previously reviewed words from an older saved dataset remain eligible so existing progress is preserved.

| Rating | Level change | Next review | Counter |
| --- | --- | --- | --- |
| Again | Decrease by 1, minimum 0 | 10 minutes | Incorrect +1 |
| Hard | No change | 1 day | No graded counter change |
| Good | Increase by 1 | Interval for the new level | Correct +1 |
| Master | No change | Removed from future review sessions | No graded counter change |

Good uses these level intervals in days:

```text
[0, 1, 3, 7, 14, 30, 60, 120]
```

The level is capped at 7. Reaching level 7 automatically marks the word as mastered.

## Import and export service boundary

The storage service can validate a UTF-8 `.json` file containing an array. A minimal record is:

```json
[
  {
    "word": "laconic",
    "definition": "Using very few words.",
    "chineseMeaning": "簡潔的；寡言的",
    "exampleSentence": "Her laconic reply ended the conversation.",
    "notes": "Think: concise",
    "tags": ["adjective", "difficult"]
  }
]
```

Only `word` and `definition` are required. Missing IDs, timestamps, and review fields receive safe defaults. Invalid records are skipped, and duplicates are detected case-insensitively both within the import and against existing words.

The export service can serialize the complete `VocabularyWord[]` collection, including review progress. The current Words page does not expose Import or Export controls.

## Production deployment

The production build is configured for GitHub Pages and writes directly to the repository's `docs/` folder:

```bash
npm run build
```

The Vite base path is relative (`./`), so generated assets work for a project site such as `https://username.github.io/repository/` and for a custom domain. The build also includes `docs/.nojekyll`.

In the GitHub repository:

1. Commit the generated `docs/` directory to the `main` branch.
2. Open **Settings → Pages**.
3. Under **Build and deployment**, select **Deploy from a branch**.
4. Choose the `main` branch and `/docs` folder, then save.

GitHub Pages will publish the contents of `docs/`. No server environment variables, database, or API routes are required. Vocabulary progress and question history remain stored in each visitor's browser.

To preview the compiled site locally after building:

```bash
npm run preview
```

Vite preview runs at **http://localhost:4173** by default.
