# Checklist Quality Dimensions

## Core Principles

Every checklist item MUST evaluate the **REQUIREMENTS THEMSELVES** for:

1. **Completeness**: Are all necessary requirements present?
2. **Clarity**: Are requirements unambiguous and specific?
3. **Consistency**: Do requirements align with each other?
4. **Measurability**: Can requirements be objectively verified?
5. **Coverage**: Are all scenarios/edge cases addressed?

## Category Structure

Group checklist items by requirement quality dimensions:

1. **Requirement Completeness** - Are all necessary requirements documented?
2. **Requirement Clarity** - Are requirements specific and unambiguous?
3. **Requirement Consistency** - Do requirements align without conflicts?
4. **Acceptance Criteria Quality** - Are success criteria measurable?
5. **Scenario Coverage** - Are all flows/cases addressed?
6. **Edge Case Coverage** - Are boundary conditions defined?
7. **Non-Functional Requirements** - Performance, Security, Accessibility, etc. - are they specified?
8. **Dependencies & Assumptions** - Are they documented and validated?
9. **Ambiguities & Conflicts** - What needs clarification?

## Item Structure

Each checklist item should follow this pattern:

- **Question format** asking about requirement quality
- **Focus on what's WRITTEN** (or not written) in the spec/plan
- **Include quality dimension** in brackets `[Completeness/Clarity/Consistency/etc.]`
- **Reference spec section** `[Spec §X.Y]` when checking existing requirements
- **Use `[Gap]` marker** when checking for missing requirements

**Format**: `- [ ] CHK### - [Question about requirement quality] [Quality Dimension, Spec Reference]`

## Examples by Quality Dimension

### Completeness

Check if all necessary requirements are documented:

- "Are error handling requirements defined for all API failure modes? [Gap]"
- "Are accessibility requirements specified for all interactive elements? [Completeness]"
- "Are mobile breakpoint requirements defined for responsive layouts? [Gap]"
- "Are loading state requirements defined for asynchronous data? [Gap]"

### Clarity

Check if requirements are specific and unambiguous:

- "Is 'fast loading' quantified with specific timing thresholds? [Clarity, Spec §NFR-2]"
- "Are 'related episodes' selection criteria explicitly defined? [Clarity, Spec §FR-5]"
- "Is 'prominent' defined with measurable visual properties? [Ambiguity, Spec §FR-4]"
- "Can 'user-friendly' be objectively measured? [Clarity]"

### Consistency

Check if requirements align without conflicts:

- "Do navigation requirements align across all pages? [Consistency, Spec §FR-10]"
- "Are card component requirements consistent between landing and detail pages? [Consistency]"
- "Are error message formats consistent across all failure scenarios? [Consistency]"
- "Do authentication requirements align with security requirements? [Consistency]"

### Coverage

Check if all scenarios and flows are addressed:

- "Are requirements defined for zero-state scenarios (no episodes)? [Coverage, Edge Case]"
- "Are concurrent user interaction scenarios addressed? [Coverage, Gap]"
- "Are requirements specified for partial data loading failures? [Coverage, Exception Flow]"
- "Are offline/network failure scenarios covered? [Coverage, Gap]"

### Measurability

Check if requirements can be objectively verified:

- "Are visual hierarchy requirements measurable/testable? [Acceptance Criteria, Spec §FR-1]"
- "Can 'balanced visual weight' be objectively verified? [Measurability, Spec §FR-2]"
- "Are performance targets quantified with specific metrics? [Measurability]"
- "Can success criteria be validated without implementation knowledge? [Measurability]"

## Scenario Classification & Coverage

Check if requirements exist for all scenario types:

- **Primary scenarios**: Main user flows and happy paths
- **Alternate scenarios**: Alternative ways to achieve goals
- **Exception/Error scenarios**: Error conditions and failures
- **Recovery scenarios**: How to recover from errors
- **Non-Functional scenarios**: Performance, security, accessibility

For each scenario class, ask:
- "Are [scenario type] requirements complete, clear, and consistent?"
- If scenario class missing: "Are [scenario type] requirements intentionally excluded or missing? [Gap]"

Include resilience/rollback when state mutation occurs:
- "Are rollback requirements defined for migration failures? [Gap]"
- "Are recovery procedures specified for data corruption? [Gap, Recovery]"

## Traceability Requirements

**MINIMUM**: ≥80% of items MUST include at least one traceability reference

Each item should reference:
- Spec section: `[Spec §X.Y]`
- Or use markers: `[Gap]`, `[Ambiguity]`, `[Conflict]`, `[Assumption]`

If no ID system exists:
- "Is a requirement & acceptance criteria ID scheme established? [Traceability]"

## Surface & Resolve Issues

Ask questions about the requirements themselves:

### Ambiguities
- "Is the term 'fast' quantified with specific metrics? [Ambiguity, Spec §NFR-1]"
- "Is 'scalable' defined with concrete capacity targets? [Ambiguity]"

### Conflicts
- "Do navigation requirements conflict between §FR-10 and §FR-10a? [Conflict]"
- "Are authentication requirements consistent with authorization rules? [Conflict]"

### Assumptions
- "Is the assumption of 'always available podcast API' validated? [Assumption]"
- "Are database availability assumptions documented? [Assumption]"

### Dependencies
- "Are external podcast API requirements documented? [Dependency, Gap]"
- "Are third-party service SLAs specified? [Dependency, Gap]"

### Missing Definitions
- "Is 'visual hierarchy' defined with measurable criteria? [Gap]"
- "Are 'critical user journeys' explicitly listed? [Gap]"

## Content Consolidation

### Soft Cap
If raw candidate items > 40, prioritize by risk/impact

### Merge Near-Duplicates
Combine items checking the same requirement aspect

### Consolidate Low-Impact Items
If >5 low-impact edge cases, create one item:
- "Are edge cases X, Y, Z addressed in requirements? [Coverage]"

## Prohibited Patterns

**🚫 ABSOLUTELY PROHIBITED** - These make it an implementation test, not a requirements test:

- ❌ Any item starting with "Verify", "Test", "Confirm", "Check" + implementation behavior
- ❌ References to code execution, user actions, system behavior
- ❌ "Displays correctly", "works properly", "functions as expected"
- ❌ "Click", "navigate", "render", "load", "execute"
- ❌ Test cases, test plans, QA procedures
- ❌ Implementation details (frameworks, APIs, algorithms)

## Required Patterns

**✅ REQUIRED PATTERNS** - These test requirements quality:

- ✅ "Are [requirement type] defined/specified/documented for [scenario]?"
- ✅ "Is [vague term] quantified/clarified with specific criteria?"
- ✅ "Are requirements consistent between [section A] and [section B]?"
- ✅ "Can [requirement] be objectively measured/verified?"
- ✅ "Are [edge cases/scenarios] addressed in requirements?"
- ✅ "Does the spec define [missing aspect]?"

## Item Numbering

- Number items sequentially starting from CHK001
- Use globally incrementing IDs across all categories
- Format: `CHK001`, `CHK002`, `CHK003`, etc.
- Never reuse IDs within the same checklist
