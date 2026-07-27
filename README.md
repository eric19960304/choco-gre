# Choco GRE — Vocabulary & Verbal Practice

Choco GRE is a mobile-first, browser-based GRE preparation tool. It ships with a prepared list of 1,000 GRE words ranked by study priority and 300 original Verbal Reasoning practice questions. It schedules vocabulary reviews, records question attempts, and uses Firebase Authentication plus Cloud Firestore to synchronize vocabulary progress for signed-in users. Anonymous use still works without an account.

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
| `npm run generate:practice` | Validate and regenerate both copies of the 300-question practice bank |
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
- **localStorage:** keeps an immediate offline cache and anonymous progress. Each Firebase user gets a separate local cache so accounts cannot accidentally inherit another account's state on a shared browser.
- **Firebase Authentication + Cloud Firestore:** Google sign-in identifies the learner. Firestore stores only per-word learning fields and review events under that user's UID; the bundled definitions and sentences are not uploaded.
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
  services/       Device cache, Firestore synchronization, and import/export boundaries
  test/           Shared test setup and fixtures
  types/          Vocabulary and review TypeScript models
  utils/          Pure date, filtering, validation, ID, and scheduling functions
```

### Why localStorage and Firestore instead of SQLite?

The static GitHub Pages app cannot run a server-side SQLite database. localStorage keeps startup immediate and preserves changes when the browser is temporarily offline. For a signed-in user, Cloud Firestore is the account-level source shared by devices. The app merges newer per-word progress, uploads existing local progress on first sign-in, and keeps signed-out data local to that browser.

## First-run data and persistence

`src/data/seedVocabulary.json` contains the app-ready 1,000-word list with rank, part of speech, English definition, Traditional Chinese meaning, available example sentence, a `commonAffixes` array, and an optional `affixMemoryHint`. Despite the legacy field name, each retained item may be a meaning-bearing prefix, root, or suffix. The memory hint connects those parts to that specific word's definition. Words without an honest, learner-useful breakdown have an empty array and no hint. The source dataset, including evidence signals used during ranking and equivalent `common_affixes` and `affix_memory_hint` fields, is `gre_vocabulary_1000_zh_TW.json` in the project root.

Run `npm run annotate:affixes` to validate both 1,000-word files and regenerate their word-part annotations from the curated, offline rules in `scripts/annotate-vocabulary-affixes.mjs`. The current audit examines all 1,000 entries and retains 305 meaning-linked parts for 216 words. Broad grammar-only endings such as `-ous`, `-al`, `-ive`, and `-tion` are deliberately excluded. Alternative senses use semicolons for quick scanning. The generator rejects duplicate clues, malformed notation, overly long explanations, and “or” separators, and it requires a word-specific memory link for every annotated word. The annotation process does not call an external dictionary or web service.

On the first visit, the storage service:

1. Converts each seed record to the complete `VocabularyWord` model.
2. Adds IDs, timestamps, review counters, and useful starter tags.
3. Saves the result under the versioned `lexilo:vocabulary:v1` localStorage key.

Every later visit loads that saved snapshot instead of rebuilding the seed. Edits, review results, mastery state, imports, and deletions persist across refreshes. When a Google user signs in, viewed state, review scheduling, mastery, correct/incorrect counters, and review history synchronize through Firestore. Each device retains a user-scoped local cache for fast startup and offline fallback. When bundled seed metadata is revised, the storage migration updates seed-word priority ranks, meaning-linked word parts, memory hints, and `Top 100`/`Top 300` tags while preserving the learner's review history and edits.

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

`gre_verbal_practice_300.json` is the readable source artifact. The app bundles an identical copy at `src/data/verbalPracticeQuestions.json`. Running `npm run generate:practice` validates the answer keys and regenerates both files from `scripts/build-verbal-practice.mjs` and `scripts/verbal-practice-expansion.mjs`.

The bank contains:

| Type | Questions | Supported interaction |
| --- | ---: | --- |
| Reading Comprehension | 100 | Five-choice single selection and three-choice “select all that apply” |
| Text Completion | 100 | One to three independent blanks; one selection per blank |
| Sentence Equivalence | 100 | Exactly two selections from six choices |

Every question contains a stable ID, sequence number, difficulty, directions, response groups, correct answer, explanation, skills, and source disclosure. Reading Comprehension questions reference one of 50 reusable passages. The generic `responseGroups` representation lets the scoring utility handle single answers, multiple answers, and independent blanks without type-specific answer hacks.

The format follows the structures described in the [official ETS Verbal Reasoning overview](https://www.ets.org/gre/test-takers/general-test/prepare/content/verbal-reasoning.html). All question wording, passages, distractors, answer keys, and explanations in this repository are original GRE-style practice created for Choco GRE. They are not official ETS questions, copied commercial questions, or recalled live-test content; reproducing ETS test material requires the appropriate [ETS license or permission](https://www.ets.org/legal/permissions/licensing.html).

On the Practice page, the user can:

1. Filter by question type and by unanswered, answered, or incorrect status.
2. Select answers with accessible single- or multiple-selection buttons.
3. Submit only after every required answer is present.
4. See the correct choices and explanation immediately.
5. Retry a question or move between questions.
6. Open History to review every saved attempt and its original response.
7. Open any bundled high-frequency vocabulary word found in a passage, prompt, or answer choice in a new tab without losing the current question.

Vocabulary links use a shareable `?word=...` URL. Opening one starts on the Words page, opens that word's detail sheet, and marks it as viewed without adding it to spaced repetition.

Attempts are stored under `lexilo:practice:v1`. Each history record contains the question ID, selected response, correctness, and answer time. Practice-question history remains device-local; the current Firestore sync is intentionally limited to vocabulary progress and vocabulary review history.

## Spaced-repetition behavior

Opening a word records that it was seen but leaves it in the New status and does not add it to the learner's review pool. The learner explicitly selects **Send to Review** in the word detail sheet to enroll it; enrollment makes the word due immediately and synchronizes through the existing vocabulary-progress record. Review sessions include only enrolled, unmastered words whose `nextReviewAt` is now or earlier, and shuffle that queue once when the session starts. Previously reviewed words from an older saved dataset remain eligible so existing progress is preserved.

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

The Vite base path is relative (`./`), so generated assets work at the current project URL, **https://eric19960304.github.io/choco-gre/**, and on a custom domain. The build also includes `docs/.nojekyll`.

In the GitHub repository:

1. Commit the generated `docs/` directory to the `main` branch.
2. Open **Settings → Pages**.
3. Under **Build and deployment**, select **Deploy from a branch**.
4. Choose the `main` branch and `/docs` folder, then save.

GitHub Pages will publish the contents of `docs/`. No custom application server or API routes are required. The static client communicates directly with Firebase Authentication and Cloud Firestore, with Firestore Security Rules restricting each learner to documents under their own Firebase UID.

### Firebase Google sign-in and progress-sync setup

The Firebase web SDK and the `choco-gre` Firebase app configuration are bundled into the static build. Configure the project as follows:

1. Open **Firebase Console → Authentication → Sign-in method** and enable **Google**.
2. Open **Authentication → Settings → Authorized domains** and add `eric19960304.github.io`.
3. Keep `localhost` authorized if local sign-in testing is required.
4. Open **Build → Firestore Database**, choose **Create database**, select the **Standard** edition and **Production mode**, and choose the database location carefully. The location cannot be changed later.
5. In **Firestore Database → Rules**, replace the default deny-all rules with the contents of `firestore.rules`, then click **Publish**.

The checked-in rules allow reads and writes only when `request.auth.uid` matches the UID segment in `/users/{uid}/...`. They also validate the fields and bounds accepted by word-progress and review-history documents. Do not use Firestore test mode for the deployed site.

Firestore creates these paths automatically on the first successful sync:

```text
users/{uid}/wordProgress/{wordKey}
users/{uid}/reviewHistory/{reviewEventId}
```

The same rules can be deployed from the repository with the Firebase CLI:

```bash
npx firebase-tools login
npx firebase-tools deploy --only firestore:rules
```

The `.firebaserc` file targets the `choco-gre` Firebase project, and `firebase.json` points the CLI at `firestore.rules`.

The header uses Firebase's popup flow, which avoids redirect-helper complications on GitHub Pages. The Firebase web configuration is public by design; never commit a Firebase service-account key or another private server credential.

To preview the compiled site locally after building:

```bash
npm run preview
```

Vite preview runs at **http://localhost:4173** by default.
