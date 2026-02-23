The AI Code Pattern Checklist
Pattern #1: Context Gap Check

Compare before/after using git diff or file comparison
Verify all original functionality is preserved
Check that new features integrate with existing operations
Confirm business logic completeness
Questions to Ask:

What did the original code do?
What does the new code do?
What's missing from the comparison?
Pattern #2: Phantom Dependency Check

Verify every import exists in package managers (PyPI, npm, etc.)
Check that libraries are actively maintained
Confirm you're using current, not deprecated, imports
Validate function signatures match current documentation
Red Flag Keywords:

"pro", "advanced", "fast", "optimized", "enhanced" in library names
"contrib", "legacy", "compat" in module paths
Imports that seem too convenient for your specific use case
Pattern #3: Over-Engineering Check

Does the complexity match the problem scope?
Is this design pattern necessary for current requirements?
Would simpler code achieve the same goal?
Are we building for hypothetical future needs?
YAGNI Principle: "You Aren't Gonna Need It" - Don't add complexity until it's actually required.

Pattern #4: Test Theater Check

Do tests interact with real systems (databases, APIs, files)?
Are failure cases tested, not just happy paths?
Do tests verify behavior, not implementation details?
Are edge conditions and integration points covered?
Questions to Ask:

What would happen if this test passed but the feature was broken?
Am I testing the code I care about or just mocks and stubs?
Pattern #5: Architectural Mismatch Check

Does code follow existing patterns in your codebase?
Does it use your team's established conventions?
Does it integrate with your architecture (MVC, service layer, etc.)?
Does it match your tech stack and framework usage?
Comparison Strategy: Look at similar features in your codebase: does the AI code follow the same patterns?

