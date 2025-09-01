// Modern Node.js development strongly favors the promise-based API for its clean
// async/await syntax. We will primarily use `fs/promises`.
const fs = require('fs/promises');
const fsSync = require('fs');
const path = require('path');
const { pipeline } = require('stream/promises');

// We'll perform all operations inside a temporary directory to keep things clean.
const tempDir = path.join(__dirname, 'temp_files');
const asyncFile = path.join(tempDir, 'async-example.txt');
const syncFile = path.join(tempDir, 'sync-example.txt');

async function runFileSystemExamples() {
    try {
        // -----------------------------------------------------------------------------
        // Setup: Create a temporary directory for our files
        // -----------------------------------------------------------------------------
        await fs.mkdir(tempDir, { recursive: true });
        console.log(`Created temporary directory: ${tempDir}`);

        // -----------------------------------------------------------------------------
        // Example 1: The Modern Async/Await Approach (fs/promises)
        //
        // "Cutting Edge" takeaway: This is the standard. It's non-blocking, clean,
        // and integrates perfectly with the rest of the async JavaScript ecosystem.
        // Always use this approach in servers and applications with concurrent users.
        // -----------------------------------------------------------------------------
        console.log('\n--- Running Modern Async/Await Examples ---');
        console.log('Step 1: Creating a file with writeFile...');
        await fs.writeFile(asyncFile, 'Hello, from the async world!\n');

        console.log('Step 2: Reading the file with readFile...');
        const content = await fs.readFile(asyncFile, 'utf8');
        console.log(`File Content: "${content.trim()}"`);

        console.log('Step 3: Updating the file with appendFile...');
        await fs.appendFile(asyncFile, 'This is new content.\n');
        const updatedContent = await fs.readFile(asyncFile, 'utf8');
        console.log(`Updated Content: "${updatedContent.trim().replace('\n', ' ')}"`);

        console.log('Step 4: Renaming the file with rename...');
        const newAsyncFile = path.join(tempDir, 'async-renamed.txt');
        await fs.rename(asyncFile, newAsyncFile);
        console.log(`Renamed ${path.basename(asyncFile)} to ${path.basename(newAsyncFile)}`);

        console.log('Step 5: Deleting the file with rm...');
        await fs.rm(newAsyncFile);
        console.log(`Deleted ${path.basename(newAsyncFile)}`);

        // -----------------------------------------------------------------------------
        // Example 2: The Synchronous Approach
        //
        // "Cutting Edge" takeaway: Know when NOT to use this. Sync methods block
        // the entire Node.js event loop. They are only acceptable for one-off
        // scripts, CLI tools, or during the initial startup phase of an application.
        // NEVER use them in a web server handling concurrent requests.
        // -----------------------------------------------------------------------------
        console.log('\n--- Running Synchronous Examples ---');
        try {
            console.log('Step 1: Creating a file with writeFileSync...');
            fsSync.writeFileSync(syncFile, 'Hello, from the sync world!');

            console.log('Step 2: Reading the file with readFileSync...');
            const syncContent = fsSync.readFileSync(syncFile, 'utf8');
            console.log(`File Content: "${syncContent.trim()}"`);

            console.log('Step 3: Deleting the file with unlinkSync...');
            fsSync.unlinkSync(syncFile);
            console.log(`Deleted ${path.basename(syncFile)}`);
        } catch (err) {
            console.error('Error during synchronous operations:', err);
        }

        // -----------------------------------------------------------------------------
        // Example 3: Handling Large Files with Streams
        //
        // "Cutting Edge" takeaway: `readFile`/`writeFile` load entire files into
        // memory. For large files (gigabytes), this is impossible. Streams process
        // data in small, manageable chunks, keeping memory usage low.
        // `pipeline` is the modern, recommended way to compose streams with proper error handling.
        // -----------------------------------------------------------------------------
        console.log('\n--- Running Large File Stream Example ---');
        const largeSourceFile = path.join(tempDir, 'large-file.bin');
        const largeDestFile = path.join(tempDir, 'large-file-copy.bin');

        console.log('Creating a large dummy file...');
        // Create a 100MB file for demonstration
        const dummyData = Buffer.alloc(1024 * 1024, 'x');
        const writeHandle = await fs.open(largeSourceFile, 'w');
        for (let i = 0; i < 100; i++) {
            await writeHandle.write(dummyData);
        }
        await writeHandle.close();

        console.log('Copying large file efficiently using streams and pipeline...');
        const readStream = fsSync.createReadStream(largeSourceFile);
        const writeStream = fsSync.createWriteStream(largeDestFile);

        await pipeline(readStream, writeStream);
        console.log('File copy complete!');


        // -----------------------------------------------------------------------------
        // Example 4: Watching for File System Changes
        //
        // "Cutting Edge" takeaway: `fs.watch` is the engine behind developer tools
        // like hot-reloading (e.g., nodemon). It allows an application to react
        // to file modifications in real-time. Use an AbortController for cleanup.
        // -----------------------------------------------------------------------------
        console.log('\n--- Running File Watcher Example ---');
        const watchFile = path.join(tempDir, 'watch-me.txt');
        await fs.writeFile(watchFile, 'Initial content.');

        const controller = new AbortController();
        const { signal } = controller;

        console.log(`Watching for changes on ${path.basename(watchFile)}. Try editing it in the next 20 seconds...`);

        const watchTimeout = setTimeout(() => {
            console.log('Stopping watcher via AbortController.');
            controller.abort();
        }, 20000);

        try {
            const watcher = fs.watch(watchFile, { signal });
            for await (const event of watcher) {
                console.log(`  -> Detected ${event.eventType} event on ${event.filename}`);
            }
        } catch (err) {
            if (err.name === 'AbortError') {
                // This is expected when the watcher is aborted. Ignore.
            } else {
                throw err;
            }
        }

        // It's good practice to clear the timeout if the loop exits for other reasons.
        clearTimeout(watchTimeout);

    } catch (err) {
        console.error('An error occurred in the main execution block:', err);
    } finally {
        // -----------------------------------------------------------------------------
        // Cleanup: Remove the temporary directory and all its contents
        // -----------------------------------------------------------------------------
        console.log('\n--- Cleaning up ---');
        await fs.rm(tempDir, { recursive: true, force: true });
        console.log(`Removed temporary directory: ${tempDir}`);
    }
}

runFileSystemExamples();
