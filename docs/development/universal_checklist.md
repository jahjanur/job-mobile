##  Universal Red Flags
1. Functions Doing Too Many Things

If you can't explain what a function does in one sentence, it's doing too much.

Warning sign: Functions with multiple responsibilities make testing difficult and changes risky.

2. Mysterious Variable Names

Variable names like x, data, temp, val in production code.

Why it matters: These names work for quick prototypes but create maintenance nightmares. Six months from now, what does temp represent?

3. No Error Handling

Code with no try-catch blocks, no input validation, no null checks.

Reality check: This is code that's never been tested under real-world conditions. The first unexpected input will crash it.

4. Hard-Coded Values Scattered Throughout

Magic numbers and strings embedded directly in logic.

Example:

if customer_type == 'premium':
    discount = price * 0.15  # Why 0.15? Can this change?
Better approach: Named constants that explain meaning and centralize changes.

5. Deep Nesting Levels

Code that requires horizontal scrolling due to nested if-statements and loops.

Impact: Deeply nested code is hard to read, hard to test, and usually indicates missing abstractions.

Example of problematic nesting:

if user:
    if user.is_active:
        if user.has_permission:
            if resource.is_available:
                if quota.has_space:
                    # Finally do something
6. Copy-Pasted Code Blocks

Identical or nearly identical code appearing in multiple places.

Problem: When you find a bug, you have to fix it in multiple places. When requirements change, you have to update multiple locations. This is a maintenance liability.

