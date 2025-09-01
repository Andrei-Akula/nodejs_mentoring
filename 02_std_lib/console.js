

// -----------------------------------------------------------------------------
// Example 1: `console.table()` - Displaying Structured Data
//
// "Cutting Edge" takeaway: Stop logging raw arrays of objects. `console.table()`
// provides a clean, readable, and sortable tabular view of your data directly
// in the terminal, dramatically improving debugging for complex data structures.
// -----------------------------------------------------------------------------
console.log('--- Example 1: Displaying Structured Data with console.table() ---');

const users = [
    { id: 1, name: 'Alice', role: 'admin', lastLogin: new Date('2025-08-15T10:00:00Z') },
    { id: 2, name: 'Bob', role: 'editor', lastLogin: new Date('2025-09-01T12:30:00Z') },
    { id: 3, name: 'Charlie', role: 'viewer', lastLogin: new Date('2025-09-01T14:00:00Z') },
];

console.log('Default log output:');
console.log(users);

console.log('\nModern table output:');
console.table(users);

// You can also select specific columns
console.log('\nModern table output with selected columns:');
console.table(users, ['name', 'role']);
console.log('\n');


// -----------------------------------------------------------------------------
// Example 2: `console.group()` - Organizing Log Output
//
// "Cutting Edge" takeaway: Avoid flat, messy logs. `console.group()` and
// `console.groupCollapsed()` allow you to create nested, indented blocks of
// logs that make complex processes (like API request lifecycles or startup
// sequences) much easier to follow.
// -----------------------------------------------------------------------------
console.log('--- Example 2: Organizing Log Output with console.group() ---');

console.group('User Authentication Flow');
    console.log('Step 1: Receiving user credentials...');
    console.group('Step 2: Validating input');
        console.log('Username: OK');
        console.log('Password: OK');
    console.groupEnd();
    console.group('Step 3: Database lookup');
        console.log('Querying user record...');
        console.log('User found: Alice');
    console.groupEnd();
    console.log('Step 4: Authentication successful!');
console.groupEnd();
console.log('\n');


// -----------------------------------------------------------------------------
// Example 3: `console.time()` - Simple Performance Profiling
//
// "Cutting Edge" takeaway: Before reaching for a complex profiling library,
// use the built-in `console.time()`, `console.timeLog()`, and `console.timeEnd()`
// to quickly measure the duration of synchronous operations. It's a simple yet
// powerful tool for identifying performance bottlenecks.
// -----------------------------------------------------------------------------
console.log('--- Example 3: Simple Performance Profiling with console.time() ---');

const N = 1_000_000;

// Start the timer
console.time('Array Initialization');

const largeArray = new Array(N);

// Log progress at an intermediate point
console.timeLog('Array Initialization', 'Array allocated');

for (let i = 0; i < N; i++) {
    largeArray[i] = i * i;
}

// End the timer and print the total duration
console.timeEnd('Array Initialization');
console.log('\n');


// -----------------------------------------------------------------------------
// Example 4: `console.count()` - Counting Occurrences
//
// "Cutting Edge" takeaway: When debugging loops or event-driven code, use
// `console.count()` to verify how many times a specific code path is executed.
// It's more descriptive and less effort than setting up a manual counter variable.
// -----------------------------------------------------------------------------
console.log('--- Example 4: Counting Occurrences with console.count() ---');

function processUser(user) {
    if (user.role === 'admin') {
        console.count('Admin users processed');
    } else {
        console.count('Non-admin users processed');
    }
}

users.forEach(processUser);
processUser({ role: 'admin' }); // Process one more admin

// Reset a counter
console.countReset('Admin users processed');
console.log('\nCounters reset.');
processUser({ role: 'admin' }); // Count starts from 1 again
console.log('\n');


// -----------------------------------------------------------------------------
// Example 5: Styled and Colored Output (ANSI Escape Codes)
//
// "Cutting Edge" takeaway: Make your CLI output more intuitive and professional
// by adding color and style. This is standard practice in modern CLIs and build
// tools (e.g., Vite, Next.js) to differentiate between warnings, errors, and
// success messages.
// -----------------------------------------------------------------------------
console.log('--- Example 5: Styled and Colored Output ---');

const styles = {
    reset: "\x1b[0m",
    bright: "\x1b[1m",
    dim: "\x1b[2m",
    underscore: "\x1b[4m",
    fg: {
        red: "\x1b[31m",
        green: "\x1b[32m",
        yellow: "\x1b[33m",
        blue: "\x1b[34m",
    },
    bg: {
        red: "\x1b[41m",
        green: "\x1b[42m",
    }
};

console.log(`${styles.fg.green}✔ Success!${styles.reset} File saved correctly.`);
console.log(`${styles.fg.yellow}${styles.bright}⚠ Warning:${styles.reset} API is deprecated.`);
console.log(`${styles.bg.red}${styles.fg.yellow}${styles.bright}✖ ERROR!${styles.reset} ${styles.fg.red}Connection to database failed.${styles.reset}`);
console.log(`\n${styles.underscore}User Agreement${styles.reset}: Please read the terms.`);
console.log('\n');


// -----------------------------------------------------------------------------
// Example 6: `console.assert()` and `console.trace()`
//
// "Cutting Edge" takeaway: Use `console.assert()` for lightweight, conditional
// checks that log an error only if a condition is false. Pair it with
// `console.trace()` to get a full stack trace for pinpointing exactly where
// a function was called from, which is invaluable for debugging.
// -----------------------------------------------------------------------------
console.log('--- Example 6: Assertions and Tracing ---');

function calculateDiscount(price, discountPercentage) {
    // Assertion: Only log an error if the percentage is invalid
    console.assert(discountPercentage >= 0 && discountPercentage <= 1, 'Invalid discount percentage', discountPercentage);

    if (price < 10) {
        // Trace: Show the call stack to see how we got here
        console.log('Applying small item discount logic...');
        console.trace('Trace for small item');
    }

    return price * (1 - discountPercentage);
}

calculateDiscount(5, 0.1);
console.log('---');
// This call will trigger the assertion and log an error with a stack trace
calculateDiscount(100, 1.5);

