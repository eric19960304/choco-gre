# Project working instructions

## Bulk vocabulary data work

- For bulk generation, enrichment, or review of vocabulary metadata across roughly 100 or more words, delegate the records to a lower-cost subagent through one or more explicit prompts. This includes synonyms, definitions, example sentences, affixes, memory hints, translations, and similar annotations.
- Prefer GPT-5.5 when it is available. If it is unavailable, use the cheapest available subagent model that can reliably complete the task.
- Split the records into multiple bounded prompts when one prompt would be too large. Require structured output that can be validated and merged into the project data.
- Do not call online dictionary, synonym, language-model, or other web APIs for this bulk vocabulary work, including free APIs. Use the delegated model's knowledge and local project data only.
- Validate the merged output for completeness, schema compliance, duplicates, and obvious self-references before committing it.
