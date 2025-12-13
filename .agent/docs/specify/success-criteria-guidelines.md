# Success Criteria Guidelines

## Definition

Success criteria define **measurable outcomes** that indicate the feature is working as intended, from a **user/business perspective**.

## Requirements

Success criteria must be:

### 1. Measurable
Include specific metrics:
- **Time**: seconds, minutes, hours
- **Percentage**: completion rate, accuracy, uptime
- **Count**: number of users, transactions, items
- **Rate**: requests per second, tasks per hour

### 2. Technology-Agnostic
**No mention of**:
- Frameworks (React, Vue, Angular)
- Languages (Python, Java, Go)
- Databases (PostgreSQL, MongoDB, Redis)
- Tools or libraries

### 3. User-Focused
Describe outcomes from **user/business perspective**, not system internals:
- What users can accomplish
- How quickly they can do it
- What quality they experience
- What business value is delivered

### 4. Verifiable
Can be tested/validated **without knowing implementation details**:
- Observable user behavior
- Measurable business metrics
- Testable acceptance criteria

## Good Examples

✅ **Correct** - User-focused and measurable:

- "Users can complete checkout in under 3 minutes"
- "System supports 10,000 concurrent users"
- "95% of searches return results in under 1 second"
- "Task completion rate improves by 40%"
- "Users can find products with 3 clicks or less"
- "Error rate is below 0.1% for all transactions"
- "Customer satisfaction score increases by 25%"

## Bad Examples

❌ **Wrong** - Implementation-focused:

| Bad Example | Why It's Wrong | Better Alternative |
|-------------|----------------|-------------------|
| "API response time is under 200ms" | Too technical, mentions API | "Users see search results instantly (< 1 second)" |
| "Database can handle 1000 TPS" | Implementation detail | "System processes 10,000 orders per hour without delays" |
| "React components render efficiently" | Framework-specific | "Page loads complete in under 2 seconds" |
| "Redis cache hit rate above 80%" | Technology-specific | "Frequently accessed data loads instantly" |
| "PostgreSQL queries optimized" | Database-specific | "Reports generate in under 5 seconds" |
| "Microservices architecture implemented" | Architecture detail | "System remains available during component updates" |

## Writing Tips

### Transform Technical Metrics to User Outcomes

1. **Start with the technical requirement**
   - "API latency < 100ms"

2. **Ask: What does this mean for the user?**
   - Fast response time

3. **Make it measurable from user perspective**
   - "Search results appear in under 1 second"

### Use Business Language

Instead of:
- "Database throughput of 5000 writes/sec"

Write:
- "System processes 100,000 customer orders per hour"

### Focus on Observable Behavior

Instead of:
- "Implement caching layer"

Write:
- "Repeat page visits load 3x faster than initial visit"

## Common Patterns

### Performance Criteria
- "Page loads complete in under [X] seconds"
- "[X]% of requests complete in under [Y] seconds"
- "Users can perform [action] in under [X] clicks/steps"

### Capacity Criteria
- "System supports [X] concurrent users"
- "Handles [X] transactions per hour"
- "Stores up to [X] records without degradation"

### Quality Criteria
- "Error rate below [X]%"
- "[X]% of users complete task successfully"
- "Customer satisfaction score of [X] or higher"

### Availability Criteria
- "System available [X]% of time"
- "Downtime limited to [X] hours per month"
- "Recovery time under [X] minutes"
