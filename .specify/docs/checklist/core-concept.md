# Checklist Core Concept: "Unit Tests for English"

## Philosophy

**CRITICAL CONCEPT**: Checklists are **UNIT TESTS FOR REQUIREMENTS WRITING** - they validate the quality, clarity, and completeness of requirements in a given domain.

## What Checklists Test

Checklists evaluate **requirements themselves** for:

- ✅ **Completeness**: Are all necessary requirements present?
- ✅ **Clarity**: Are requirements unambiguous and specific?
- ✅ **Consistency**: Do requirements align with each other?
- ✅ **Measurability**: Can requirements be objectively verified?
- ✅ **Coverage**: Are all scenarios/edge cases addressed?

## What Checklists DON'T Test

Checklists are **NOT for verification/testing**:

- ❌ NOT "Verify the button clicks correctly"
- ❌ NOT "Test error handling works"
- ❌ NOT "Confirm the API returns 200"
- ❌ NOT checking if code/implementation matches the spec

## The Metaphor

**If your spec is code written in English, the checklist is its unit test suite.**

You're testing whether the requirements are well-written, complete, unambiguous, and ready for implementation - **NOT** whether the implementation works.

## Quick Examples

### ❌ WRONG (Testing Implementation)

These test if the system works correctly:

- "Verify landing page displays 3 episode cards"
- "Test hover states work on desktop"
- "Confirm logo click navigates home"

### ✅ CORRECT (Testing Requirements Quality)

These test if the requirements are written correctly:

- "Are the exact number and layout of featured episodes specified?" [Completeness]
- "Is 'prominent display' quantified with specific sizing/positioning?" [Clarity]
- "Are hover state requirements consistent across all interactive elements?" [Consistency]
- "Are keyboard navigation requirements defined for all interactive UI?" [Coverage]
- "Is the fallback behavior specified when logo image fails to load?" [Edge Cases]
- "Are loading states defined for asynchronous episode data?" [Completeness]
- "Does the spec define visual hierarchy for competing UI elements?" [Clarity]

## Key Differences

| Wrong Approach | Correct Approach |
|----------------|------------------|
| Tests if the system works correctly | Tests if the requirements are written correctly |
| Verification of behavior | Validation of requirement quality |
| "Does it do X?" | "Is X clearly specified?" |
| Implementation testing | Requirements quality testing |
| QA/Testing focus | Specification quality focus |

## When to Use Checklists

Use checklists to validate that:

1. **Before planning**: Requirements are complete enough to create a technical plan
2. **Before implementation**: Specifications are unambiguous enough to code against
3. **During review**: Requirements meet quality standards
4. **After changes**: Modifications maintain consistency and completeness
