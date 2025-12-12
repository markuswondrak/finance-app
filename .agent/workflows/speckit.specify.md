---
description: Create or update the feature specification from a natural language feature description.
handoffs: 
  - label: Build Technical Plan
    agent: speckit.plan
    prompt: Create a plan for the spec. I am building with...
  - label: Clarify Spec Requirements
    agent: speckit.clarify
    prompt: Clarify specification requirements
    send: true
---

## User Input

```text
$ARGUMENTS
```

You **MUST** consider the user input before proceeding (if not empty).

## Overview

This workflow creates a feature specification from a natural language description. The specification focuses on **WHAT** users need and **WHY**, avoiding implementation details.

**Supporting Documentation**:
- Guidelines: `.specify/docs/specification-guidelines.md`
- Success Criteria: `.specify/docs/success-criteria-guidelines.md`
- Validation: `.specify/docs/validation-process.md`

## Execution Steps

### 1. Generate Branch Name

Create a concise short name (2-4 words) from the feature description:
- Use action-noun format (e.g., `user-auth`, `fix-payment-timeout`)
- Preserve technical terms and acronyms (OAuth2, API, JWT)
- See `.specify/docs/specification-guidelines.md` for examples

### 2. Check Existing Branches

a. Fetch remote branches:
```bash
git fetch --all --prune
```

b. Find highest feature number for this short-name across:
- Remote branches: `git ls-remote --heads origin | grep -E 'refs/heads/[0-9]+-<short-name>$'`
- Local branches: `git branch | grep -E '^[* ]*[0-9]+-<short-name>$'`
- Specs directories: `specs/[0-9]+-<short-name>`

c. Use N+1 for new branch number (or 1 if none exist)

### 3. Create Feature Branch

Run `.specify/scripts/bash/create-new-feature.sh` with calculated number and short-name:

```bash
.specify/scripts/bash/create-new-feature.sh --json "$ARGUMENTS" --number N+1 --short-name "your-short-name"
```

**Important**:
- Run script only once per feature
- Parse JSON output for BRANCH_NAME and SPEC_FILE paths
- For single quotes in args, use escape syntax: `'I'\''m Groot'` or double-quote: `"I'm Groot"`

### 4. Generate Specification

Follow this execution flow:

1. **Parse user description**
   - If empty: ERROR "No feature description provided"

2. **Extract key concepts**
   - Identify: actors, actions, data, constraints

3. **Handle unclear aspects**
   - Make informed guesses based on context and industry standards
   - Only use `[NEEDS CLARIFICATION: specific question]` if:
     - Choice significantly impacts feature scope or user experience
     - Multiple reasonable interpretations exist with different implications
     - No reasonable default exists
   - **LIMIT: Maximum 3 markers total**
   - Prioritize: scope > security/privacy > user experience > technical details
   - See `.specify/docs/specification-guidelines.md` for reasonable defaults

4. **Fill required sections**
   - User Scenarios & Testing (if no clear flow: ERROR)
   - Functional Requirements (must be testable)
   - Success Criteria (see `.specify/docs/success-criteria-guidelines.md`)
   - Key Entities (if data involved)

5. **Document assumptions**
   - Record reasonable defaults in Assumptions section

### 5. Write Specification

Write to SPEC_FILE using `.specify/templates/spec-template.md` structure:
- Replace placeholders with concrete details from feature description
- Preserve section order and headings
- Remove optional sections that don't apply

### 6. Validate Quality

See `.specify/docs/validation-process.md` for full validation process.

**Quick Steps**:

a. **Create checklist** at `FEATURE_DIR/checklists/requirements.md`
   - Use template from validation-process.md

b. **Run validation check**
   - Review spec against each checklist item
   - Document specific issues

c. **Handle results**:
   - **All pass**: Mark complete, proceed
   - **Items fail**: Update spec, re-validate (max 3 iterations)
   - **[NEEDS CLARIFICATION] markers**: Present questions to user (max 3)

d. **Update checklist** after each iteration

### 7. Report Completion

Output:
- Branch name
- Spec file path
- Checklist results
- Readiness for next phase (`/speckit.clarify` or `/speckit.plan`)

## Key Principles

See `.specify/docs/specification-guidelines.md` for detailed guidelines.

**Quick Reference**:
- Focus on WHAT and WHY, not HOW
- Written for business stakeholders, not developers
- No implementation details (languages, frameworks, APIs)
- Make informed guesses, document assumptions
- Limit clarifications to 3 critical questions
- All requirements must be testable and unambiguous
- Success criteria must be measurable and technology-agnostic
