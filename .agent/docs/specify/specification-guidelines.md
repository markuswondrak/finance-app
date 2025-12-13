# Specification Guidelines

## Core Principles

### Focus on WHAT and WHY, Not HOW

- **WHAT**: Describe what users need and what the system should do
- **WHY**: Explain the business value and user benefit
- **NOT HOW**: Avoid implementation details (tech stack, APIs, code structure)

**Target Audience**: Business stakeholders, not developers

## Section Requirements

### Mandatory Sections
Must be completed for every feature:
- Feature Overview
- User Scenarios
- Functional Requirements
- Success Criteria

### Optional Sections
Include only when relevant:
- Non-Functional Requirements
- Key Entities
- Dependencies
- Assumptions

**Important**: When a section doesn't apply, remove it entirely (don't leave as "N/A")

## AI Generation Guidelines

When creating specifications from user prompts:

### 1. Make Informed Guesses
Use context, industry standards, and common patterns to fill gaps rather than asking for every detail.

### 2. Document Assumptions
Record reasonable defaults in the Assumptions section.

### 3. Limit Clarifications
**Maximum 3 [NEEDS CLARIFICATION] markers** - use only for critical decisions that:
- Significantly impact feature scope or user experience
- Have multiple reasonable interpretations with different implications
- Lack any reasonable default

### 4. Prioritization Order
When deciding what needs clarification:
1. **Scope** (highest priority)
2. **Security/Privacy**
3. **User Experience**
4. **Technical Details** (lowest priority)

### 5. Think Like a Tester
Every vague requirement should fail the "testable and unambiguous" checklist item.

## Common Areas Needing Clarification

Only ask about these if **no reasonable default exists**:

- **Feature scope and boundaries**: Include/exclude specific use cases
- **User types and permissions**: If multiple conflicting interpretations possible
- **Security/compliance requirements**: When legally/financially significant

## Reasonable Defaults (Don't Ask About These)

Use industry-standard assumptions for:

- **Data retention**: Industry-standard practices for the domain
- **Performance targets**: Standard web/mobile app expectations unless specified
- **Error handling**: User-friendly messages with appropriate fallbacks
- **Authentication method**: Standard session-based or OAuth2 for web apps
- **Integration patterns**: RESTful APIs unless specified otherwise

## Branch Naming Convention

Generate concise short names (2-4 words):

- Use action-noun format when possible
- Preserve technical terms and acronyms (OAuth2, API, JWT, etc.)
- Keep it descriptive enough to understand at a glance

**Examples**:
- "I want to add user authentication" → `user-auth`
- "Implement OAuth2 integration for the API" → `oauth2-api-integration`
- "Create a dashboard for analytics" → `analytics-dashboard`
- "Fix payment processing timeout bug" → `fix-payment-timeout`
