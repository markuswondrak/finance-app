# Specification Quality Validation

## Validation Checklist Template

Use this template when creating `FEATURE_DIR/checklists/requirements.md`:

```markdown
# Specification Quality Checklist: [FEATURE NAME]

**Purpose**: Validate specification completeness and quality before proceeding to planning
**Created**: [DATE]
**Feature**: [Link to spec.md]

## Content Quality

- [ ] No implementation details (languages, frameworks, APIs)
- [ ] Focused on user value and business needs
- [ ] Written for non-technical stakeholders
- [ ] All mandatory sections completed

## Requirement Completeness

- [ ] No [NEEDS CLARIFICATION] markers remain
- [ ] Requirements are testable and unambiguous
- [ ] Success criteria are measurable
- [ ] Success criteria are technology-agnostic (no implementation details)
- [ ] All acceptance scenarios are defined
- [ ] Edge cases are identified
- [ ] Scope is clearly bounded
- [ ] Dependencies and assumptions identified

## Feature Readiness

- [ ] All functional requirements have clear acceptance criteria
- [ ] User scenarios cover primary flows
- [ ] Feature meets measurable outcomes defined in Success Criteria
- [ ] No implementation details leak into specification

## Notes

- Items marked incomplete require spec updates before `/speckit.clarify` or `/speckit.plan`
```

## Validation Process

### Step 1: Create Checklist
Generate checklist file at `FEATURE_DIR/checklists/requirements.md` using the template above.

### Step 2: Run Validation Check
Review the spec against each checklist item:
- For each item, determine if it passes or fails
- Document specific issues found (quote relevant spec sections)

### Step 3: Handle Results

#### If All Items Pass
- Mark checklist complete
- Proceed to next phase

#### If Items Fail (excluding [NEEDS CLARIFICATION])
1. List the failing items and specific issues
2. Update the spec to address each issue
3. Re-run validation until all items pass (max 3 iterations)
4. If still failing after 3 iterations, document remaining issues in checklist notes and warn user

#### If [NEEDS CLARIFICATION] Markers Remain
1. Extract all `[NEEDS CLARIFICATION: ...]` markers from the spec
2. **LIMIT CHECK**: If more than 3 markers exist, keep only the 3 most critical (by scope/security/UX impact) and make informed guesses for the rest
3. For each clarification needed (max 3), present options to user

### Step 4: Update Checklist
After each validation iteration, update the checklist file with current pass/fail status.

## Clarification Question Format

When presenting clarifications to the user:

```markdown
## Question [N]: [Topic]

**Context**: [Quote relevant spec section]

**What we need to know**: [Specific question from NEEDS CLARIFICATION marker]

**Suggested Answers**:

| Option | Answer | Implications |
|--------|--------|--------------|
| A      | [First suggested answer] | [What this means for the feature] |
| B      | [Second suggested answer] | [What this means for the feature] |
| C      | [Third suggested answer] | [What this means for the feature] |
| Custom | Provide your own answer | [Explain how to provide custom input] |

**Your choice**: _[Wait for user response]_
```

### Table Formatting Rules

**CRITICAL** - Ensure markdown tables are properly formatted:
- Use consistent spacing with pipes aligned
- Each cell should have spaces around content: `| Content |` not `|Content|`
- Header separator must have at least 3 dashes: `|--------|`
- Test that the table renders correctly in markdown preview

### Question Handling

1. Number questions sequentially (Q1, Q2, Q3 - max 3 total)
2. Present all questions together before waiting for responses
3. Wait for user to respond with their choices for all questions
   - Example: "Q1: A, Q2: Custom - [details], Q3: B"
4. Update the spec by replacing each [NEEDS CLARIFICATION] marker with the user's selected or provided answer
5. Re-run validation after all clarifications are resolved

## Common Validation Failures

### Implementation Details Leaked

**Problem**: Spec mentions specific technologies
```
❌ "Use PostgreSQL database to store user data"
❌ "Implement REST API with Express.js"
```

**Fix**: Focus on what, not how
```
✅ "System stores user profile information persistently"
✅ "Provide programmatic access to user data"
```

### Vague Requirements

**Problem**: Requirements lack specificity
```
❌ "System should be fast"
❌ "Interface should be user-friendly"
```

**Fix**: Make measurable and specific
```
✅ "Search results appear in under 1 second"
✅ "Users can complete checkout in 3 clicks or less"
```

### Missing Acceptance Criteria

**Problem**: Requirements without testable outcomes
```
❌ "Users can manage their profiles"
```

**Fix**: Add specific acceptance criteria
```
✅ "Users can view, edit, and save profile information including name, email, and preferences"
```

### Unbounded Scope

**Problem**: No clear boundaries
```
❌ "Build a social media platform"
```

**Fix**: Define specific scope
```
✅ "Users can create posts, comment on others' posts, and follow other users. Out of scope: messaging, groups, events"
```
