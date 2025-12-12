# Checklist Clarification Algorithm

## Purpose

Generate 3-5 contextual clarifying questions to refine checklist focus and scope. Questions MUST be:

- Generated from user's phrasing + extracted signals from spec/plan/tasks
- Only about information that materially changes checklist content
- Skipped individually if already unambiguous in user input
- Precise over broad

## Generation Algorithm

### Step 1: Extract Signals

Identify key indicators from user input and feature context:

**Domain Keywords**:
- Technical domains: `auth`, `latency`, `UX`, `API`, `database`, `security`
- Feature types: `dashboard`, `integration`, `migration`, `refactor`

**Risk Indicators**:
- Priority markers: `critical`, `must`, `required`, `essential`
- Compliance: `GDPR`, `HIPAA`, `SOC2`, `compliance`, `audit`
- Quality gates: `production-ready`, `release-blocking`

**Stakeholder Hints**:
- Roles: `QA`, `review`, `security team`, `architect`, `product`
- Timing: `pre-commit`, `PR review`, `release gate`, `planning`

**Explicit Deliverables**:
- Quality attributes: `a11y`, `i18n`, `performance`, `security`
- Processes: `rollback`, `migration`, `deployment`, `testing`
- Artifacts: `contracts`, `API specs`, `data model`

### Step 2: Cluster Signals

Group signals into candidate focus areas (max 4) ranked by relevance:

1. **Primary domain** (most frequently mentioned)
2. **Risk/compliance areas** (highest impact)
3. **Quality attributes** (explicitly mentioned)
4. **Process/timing** (when/how checklist will be used)

### Step 3: Identify Audience & Timing

Determine probable audience and timing if not explicit:

**Audience**:
- **Author**: Writing the spec/plan themselves
- **Reviewer**: Peer review during PR
- **QA**: Quality assurance before release
- **Release**: Final gate before production

**Timing**:
- **Pre-commit**: Quick sanity check
- **PR Review**: Thorough peer validation
- **Planning**: Before creating implementation plan
- **Release**: Final production readiness

### Step 4: Detect Missing Dimensions

Identify gaps in the user's request:

- **Scope breadth**: How comprehensive should the checklist be?
- **Depth/rigor**: Lightweight sanity check or formal gate?
- **Risk emphasis**: Which risks need mandatory checks?
- **Exclusion boundaries**: What should be explicitly excluded?
- **Measurable acceptance criteria**: What defines "done"?

### Step 5: Formulate Questions

Choose from these archetypes based on detected gaps:

#### Scope Refinement
"Should this include integration touchpoints with X and Y or stay limited to local module correctness?"

#### Risk Prioritization
"Which of these potential risk areas should receive mandatory gating checks?"

#### Depth Calibration
"Is this a lightweight pre-commit sanity list or a formal release gate?"

#### Audience Framing
"Will this be used by the author only or peers during PR review?"

#### Boundary Exclusion
"Should we explicitly exclude performance tuning items this round?"

#### Scenario Class Gap
"No recovery flows detected—are rollback / partial failure paths in scope?"

## Question Formatting

### Table Format (for multiple choice)

When presenting options, use this format:

```markdown
| Option | Candidate | Why It Matters |
|--------|-----------|----------------|
| A      | [Option A description] | [Impact explanation] |
| B      | [Option B description] | [Impact explanation] |
| C      | [Option C description] | [Impact explanation] |
```

**Rules**:
- Limit to A–E options maximum
- Omit table if free-form answer is clearer
- Each option should be mutually exclusive
- "Why It Matters" explains impact on checklist content

### Free-Form Format

For open-ended questions:

```markdown
Q[N]: [Question]

Please provide: [What format/type of answer expected]
```

### Formatting Rules

- **Never ask user to restate** what they already said
- **Avoid speculative categories** - no hallucination
- **If uncertain**, ask explicitly: "Confirm whether X belongs in scope"
- **Label questions** as Q1, Q2, Q3, etc.

## Defaults When Interaction Impossible

If unable to ask questions (non-interactive mode):

- **Depth**: Standard (not lightweight, not exhaustive)
- **Audience**: Reviewer (PR) if code-related; Author otherwise
- **Focus**: Top 2 relevance clusters from signal extraction

## Escalation Rules

After initial 3 questions:

**MAY ask up to TWO more** (Q4/Q5) if:
- ≥2 scenario classes (Alternate / Exception / Recovery / Non-Functional) remain unclear
- Each follow-up has one-line justification (e.g., "Unresolved recovery path risk")

**MUST NOT**:
- Exceed 5 total questions
- Continue if user explicitly declines more ("stop", "enough", "no more")

## Example Question Flow

### Example 1: API Feature

**User Input**: "Create checklist for user authentication API"

**Extracted Signals**:
- Domain: API, authentication
- Risk: security (implicit in auth)
- Deliverable: API endpoints

**Generated Questions**:

Q1: **Scope** - Should this checklist cover:
| Option | Candidate | Why It Matters |
|--------|-----------|----------------|
| A | Only authentication endpoints | Focused, faster review |
| B | Auth + authorization + session management | Comprehensive security coverage |
| C | Full API including related user management | Broader scope, more items |

Q2: **Security Depth** - What security rigor level?
| Option | Candidate | Why It Matters |
|--------|-----------|----------------|
| A | Standard web app security | Common patterns, moderate depth |
| B | High-security / compliance-driven | Extensive checks, formal validation |
| C | Basic security hygiene | Lightweight, essential items only |

Q3: **Audience** - Who will use this checklist?
| Option | Candidate | Why It Matters |
|--------|-----------|----------------|
| A | Author (self-review) | Simpler language, fewer items |
| B | Security team review | Technical depth, compliance focus |
| C | General PR reviewer | Balanced, educational items |

### Example 2: UX Feature

**User Input**: "Checklist for dashboard redesign"

**Extracted Signals**:
- Domain: UX, dashboard
- Type: redesign (implies existing system)

**Generated Questions**:

Q1: **Scope** - Dashboard coverage:
| Option | Candidate | Why It Matters |
|--------|-----------|----------------|
| A | Visual design only | Layout, colors, typography |
| B | Design + interactions | Includes hover, click, navigation |
| C | Full UX including accessibility | Comprehensive quality check |

Q2: **Backwards Compatibility** - Since this is a redesign:
| Option | Candidate | Why It Matters |
|--------|-----------|----------------|
| A | Check migration/transition requirements | Ensures smooth user transition |
| B | Treat as greenfield | Simpler, no legacy concerns |

Q3: **Responsive Design** - Should checklist verify:
| Option | Candidate | Why It Matters |
|--------|-----------|----------------|
| A | Desktop only | Faster, focused scope |
| B | Desktop + mobile | Comprehensive coverage |
| C | All breakpoints (desktop/tablet/mobile) | Exhaustive responsive check |

## Output Format

Present questions with clear labels and wait for responses:

```markdown
Q1: [Question text]
[Table or format]

Q2: [Question text]
[Table or format]

Q3: [Question text]
[Table or format]

Please respond with your choices (e.g., "Q1: A, Q2: B, Q3: C")
```
