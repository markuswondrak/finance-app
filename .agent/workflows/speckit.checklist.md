---
description: Generate a custom checklist for the current feature based on user requirements.
---

## Overview

Generate domain-specific checklists that validate **requirements quality**, not implementation. Checklists are "Unit Tests for English" - they test if requirements are well-written, complete, and unambiguous.

**Supporting Documentation**:
- Core Concept: `.specify/docs/checklist/core-concept.md`
- Quality Dimensions: `.specify/docs/checklist/quality-dimensions.md`
- Domain Examples: `.specify/docs/checklist/domain-examples.md`
- Clarification Algorithm: `.specify/docs/checklist/clarification-algorithm.md`

## User Input

```text
$ARGUMENTS
```

You **MUST** consider the user input before proceeding (if not empty).

## Execution Steps

### 1. Setup

Run `.specify/scripts/bash/check-prerequisites.sh --json` from repo root and parse JSON for FEATURE_DIR and AVAILABLE_DOCS list.

**Important**:
- All file paths must be absolute
- For single quotes in args like "I'm Groot", use escape syntax: `'I'\''m Groot'` or double-quote: `"I'm Groot"`

### 2. Clarify Intent (Dynamic)

See `.specify/docs/checklist/clarification-algorithm.md` for full algorithm.

**Quick Process**:

Derive up to THREE initial contextual clarifying questions:
- Generate from user's phrasing + extracted signals from spec/plan/tasks
- Only ask about information that materially changes checklist content
- Skip individually if already unambiguous in `$ARGUMENTS`
- Prefer precision over breadth

**Signal Extraction**:
1. Domain keywords (auth, latency, UX, API)
2. Risk indicators ("critical", "must", "compliance")
3. Stakeholder hints ("QA", "review", "security team")
4. Explicit deliverables ("a11y", "rollback", "contracts")

**Question Archetypes**:
- Scope refinement
- Risk prioritization
- Depth calibration (lightweight vs formal gate)
- Audience framing (author vs reviewer)
- Boundary exclusion
- Scenario class gaps

**Defaults** (when interaction impossible):
- Depth: Standard
- Audience: Reviewer (PR) if code-related; Author otherwise
- Focus: Top 2 relevance clusters

**Escalation**: MAY ask up to TWO more questions (Q4/Q5) if ≥2 scenario classes remain unclear. Max 5 total questions.

### 3. Understand User Request

Combine `$ARGUMENTS` + clarifying answers:
- Derive checklist theme (e.g., security, review, deploy, ux)
- Consolidate explicit must-have items mentioned by user
- Map focus selections to category scaffolding
- Infer any missing context from spec/plan/tasks (do NOT hallucinate)

### 4. Load Feature Context

Read from FEATURE_DIR:
- `spec.md`: Feature requirements and scope
- `plan.md` (if exists): Technical details, dependencies
- `tasks.md` (if exists): Implementation tasks

**Context Loading Strategy**:
- Load only necessary portions relevant to active focus areas
- Prefer summarizing long sections into concise scenario/requirement bullets
- Use progressive disclosure: add follow-on retrieval only if gaps detected
- If source docs are large, generate interim summary items instead of embedding raw text

### 5. Generate Checklist

See `.specify/docs/checklist/quality-dimensions.md` for detailed guidance.

**File Management**:
- Create `FEATURE_DIR/checklists/` directory if it doesn't exist
- Generate unique checklist filename based on domain (e.g., `ux.md`, `api.md`, `security.md`)
- Format: `[domain].md`
- If file exists, append to existing file
- Each `/speckit.checklist` run creates a NEW file (never overwrites)

**Item Numbering**:
- Number items sequentially starting from CHK001
- Use globally incrementing IDs

**Core Principle** (see `.specify/docs/checklist/core-concept.md`):

Test the **REQUIREMENTS**, not the implementation. Every checklist item MUST evaluate requirements for:
- **Completeness**: Are all necessary requirements present?
- **Clarity**: Are requirements unambiguous and specific?
- **Consistency**: Do requirements align with each other?
- **Measurability**: Can requirements be objectively verified?
- **Coverage**: Are all scenarios/edge cases addressed?

**Category Structure** (see `.specify/docs/checklist/quality-dimensions.md`):
1. Requirement Completeness
2. Requirement Clarity
3. Requirement Consistency
4. Acceptance Criteria Quality
5. Scenario Coverage
6. Edge Case Coverage
7. Non-Functional Requirements
8. Dependencies & Assumptions
9. Ambiguities & Conflicts

**Item Structure**:
- Question format asking about requirement quality
- Focus on what's WRITTEN (or not written) in spec/plan
- Include quality dimension in brackets `[Completeness/Clarity/etc.]`
- Reference spec section `[Spec §X.Y]` when checking existing requirements
- Use `[Gap]` marker when checking for missing requirements

**Examples** (see `.specify/docs/checklist/domain-examples.md` for comprehensive examples):

✅ **CORRECT**:
- "Are the exact number and layout of featured episodes specified? [Completeness]"
- "Is 'prominent display' quantified with specific sizing/positioning? [Clarity]"
- "Are hover state requirements consistent across all interactive elements? [Consistency]"

❌ **WRONG**:
- "Verify landing page displays 3 episode cards"
- "Test hover states work on desktop"
- "Confirm logo click navigates home"

**Content Consolidation**:
- Soft cap: If raw candidate items > 40, prioritize by risk/impact
- Merge near-duplicates checking the same requirement aspect
- If >5 low-impact edge cases, create one consolidated item

### 6. Apply Template Structure

Generate checklist following canonical template in `.specify/templates/checklist-template.md`.

If template unavailable, use:
- H1 title
- Purpose/created meta lines
- `##` category sections
- `- [ ] CHK### <requirement item>` lines with globally incrementing IDs starting at CHK001

### 7. Report Completion

Output:
- Full path to created checklist
- Item count
- Remind user that each run creates a new file

Summarize:
- Focus areas selected
- Depth level
- Actor/timing
- Any explicit user-specified must-have items incorporated

**Note**: Each `/speckit.checklist` invocation creates a checklist file using short, descriptive names. This allows:
- Multiple checklists of different types (e.g., `ux.md`, `test.md`, `security.md`)
- Simple, memorable filenames that indicate checklist purpose
- Easy identification and navigation in the `checklists/` folder

To avoid clutter, use descriptive types and clean up obsolete checklists when done.

## Quick Reference

### Core Concept
See `.specify/docs/checklist/core-concept.md`

Checklists are **UNIT TESTS FOR REQUIREMENTS WRITING** - they validate quality, clarity, and completeness of requirements.

### Quality Dimensions
See `.specify/docs/checklist/quality-dimensions.md`

- Completeness, Clarity, Consistency, Measurability, Coverage
- 9 standard categories
- Prohibited vs Required patterns
- Traceability requirements (≥80% items must have references)

### Domain Examples
See `.specify/docs/checklist/domain-examples.md`

- UX, API, Performance, Security examples
- Anti-examples (wrong vs correct)
- Pattern recognition guide

### Clarification Algorithm
See `.specify/docs/checklist/clarification-algorithm.md`

- Signal extraction
- Question generation
- Formatting rules
- Escalation logic
