# Domain-Specific Checklist Examples

These examples demonstrate how to write checklists for different domains. All items test **requirements quality**, NOT implementation.

## UX Requirements Quality

**Checklist file**: `ux.md`

Sample items testing the requirements, NOT the implementation:

- "Are visual hierarchy requirements defined with measurable criteria? [Clarity, Spec §FR-1]"
- "Is the number and positioning of UI elements explicitly specified? [Completeness, Spec §FR-1]"
- "Are interaction state requirements (hover, focus, active) consistently defined? [Consistency]"
- "Are accessibility requirements specified for all interactive elements? [Coverage, Gap]"
- "Is fallback behavior defined when images fail to load? [Edge Case, Gap]"
- "Can 'prominent display' be objectively measured? [Measurability, Spec §FR-4]"

## API Requirements Quality

**Checklist file**: `api.md`

Sample items:

- "Are error response formats specified for all failure scenarios? [Completeness]"
- "Are rate limiting requirements quantified with specific thresholds? [Clarity]"
- "Are authentication requirements consistent across all endpoints? [Consistency]"
- "Are retry/timeout requirements defined for external dependencies? [Coverage, Gap]"
- "Is versioning strategy documented in requirements? [Gap]"

## Performance Requirements Quality

**Checklist file**: `performance.md`

Sample items:

- "Are performance requirements quantified with specific metrics? [Clarity]"
- "Are performance targets defined for all critical user journeys? [Coverage]"
- "Are performance requirements under different load conditions specified? [Completeness]"
- "Can performance requirements be objectively measured? [Measurability]"
- "Are degradation requirements defined for high-load scenarios? [Edge Case, Gap]"

## Security Requirements Quality

**Checklist file**: `security.md`

Sample items:

- "Are authentication requirements specified for all protected resources? [Coverage]"
- "Are data protection requirements defined for sensitive information? [Completeness]"
- "Is the threat model documented and requirements aligned to it? [Traceability]"
- "Are security requirements consistent with compliance obligations? [Consistency]"
- "Are security failure/breach response requirements defined? [Gap, Exception Flow]"

## Anti-Examples: What NOT To Do

### ❌ WRONG - These test implementation, not requirements

```markdown
- [ ] CHK001 - Verify landing page displays 3 episode cards [Spec §FR-001]
- [ ] CHK002 - Test hover states work correctly on desktop [Spec §FR-003]
- [ ] CHK003 - Confirm logo click navigates to home page [Spec §FR-010]
- [ ] CHK004 - Check that related episodes section shows 3-5 items [Spec §FR-005]
```

**Why these are wrong**:
- They test if the **system works**, not if **requirements are well-written**
- They verify **implementation behavior**, not **specification quality**
- They use action verbs like "Verify", "Test", "Confirm", "Check"
- They describe **what the system does**, not **what the spec defines**

### ✅ CORRECT - These test requirements quality

```markdown
- [ ] CHK001 - Are the number and layout of featured episodes explicitly specified? [Completeness, Spec §FR-001]
- [ ] CHK002 - Are hover state requirements consistently defined for all interactive elements? [Consistency, Spec §FR-003]
- [ ] CHK003 - Are navigation requirements clear for all clickable brand elements? [Clarity, Spec §FR-010]
- [ ] CHK004 - Is the selection criteria for related episodes documented? [Gap, Spec §FR-005]
- [ ] CHK005 - Are loading state requirements defined for asynchronous episode data? [Gap]
- [ ] CHK006 - Can "visual hierarchy" requirements be objectively measured? [Measurability, Spec §FR-001]
```

**Why these are correct**:
- They test if **requirements are well-written**
- They evaluate **specification quality**
- They ask questions about what's **documented** (or missing)
- They focus on **requirement attributes**: completeness, clarity, consistency, measurability

## Key Differences

| Wrong Approach | Correct Approach |
|----------------|------------------|
| Tests if the system works correctly | Tests if the requirements are written correctly |
| Verification of behavior | Validation of requirement quality |
| "Does it do X?" | "Is X clearly specified?" |
| Implementation testing | Requirements quality testing |
| QA/Testing checklist | Specification quality checklist |
| Executable test cases | Requirement validation questions |

## Pattern Recognition

### Wrong Pattern
```
[Action Verb] + [System Behavior] + [Expected Outcome]
Example: "Verify button displays correctly when clicked"
```

### Correct Pattern
```
[Quality Question] + [Requirement Aspect] + [Quality Dimension]
Example: "Are button interaction states defined for all user actions? [Completeness]"
```

## Domain-Specific Focus Areas

### UX Checklists Focus On
- Visual hierarchy and layout specifications
- Interaction state definitions
- Accessibility requirements
- Responsive design requirements
- Error/empty/loading state specifications

### API Checklists Focus On
- Endpoint specifications and contracts
- Error response formats
- Authentication/authorization requirements
- Rate limiting and throttling
- Versioning and backwards compatibility

### Performance Checklists Focus On
- Quantified performance targets
- Load condition specifications
- Degradation requirements
- Scalability requirements
- Resource usage limits

### Security Checklists Focus On
- Authentication/authorization requirements
- Data protection specifications
- Threat model documentation
- Compliance requirements
- Security failure handling
