Integrated Review Workflow
Step 1: Universal Review (from Lesson 1)

Structure & Organization
Naming & Clarity
Error Handling
Testability
Step 2: AI Pattern Review (from Lesson 2)

Context Gap Check
Phantom Dependency Check
Over-Engineering Check
Test Theater Check
Architectural Mismatch Check
Step 3: Decision

Accept: Code passes both reviews
Modify: Code has fixable issues
Reject: Code has fundamental problems
Practical Application Strategy
For Every AI Code Review:

Quick Scan (30 seconds)
Check imports for phantom dependencies
Assess complexity relative to request
Detailed Review (2-5 minutes)
Apply universal checklist
Run through AI pattern checklist
Diff against original if modifying existing code
Architecture Fit (1-2 minutes)
Compare to similar code in your codebase
Verify pattern consistency
Time Investment: 3-8 minutes of systematic review saves hours of debugging production issues.

Common Scenarios and Checklist Application
Scenario 1: AI Generated New Feature Focus on: Over-Engineering, Phantom Dependencies, Architectural Mismatch

Scenario 2: AI Modified Existing Code Focus on: Context Gap, Architectural Mismatch

Scenario 3: AI Generated Tests Focus on: Test Theater

Scenario 4: AI Suggested Optimization Focus on: Over-Engineering, Phantom Dependencies, Context Gap