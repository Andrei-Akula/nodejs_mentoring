

const { exec, execFile, spawn, fork } = require('child_process');
const util = require('util');
const path = require('path');
const colors = require('ansi-colors');

// Promisify exec and execFile for modern async/await syntax
const execPromise = util.promisify(exec);

async function runChildProcessExamples() {

    // -----------------------------------------------------------------------------
    // Example 1: `exec` - For simple commands with buffered output
    //
    // "Cutting Edge" takeaway: Use the promisified version for clean async/await.
    // `exec` is great for short, simple commands where you need the full output
    // at once. It's NOT suitable for long-running processes or commands with
    // large output, as it buffers everything in memory.
    // -----------------------------------------------------------------------------
    console.log(colors.cyan.bold('--- Example 1: `exec` with Promises ---'));
    try {
        // Run a shell command. Note that this uses /bin/sh, which can be a security risk if command contains user input.
        const { stdout, stderr } = await execPromise('node --version && npm --version');
        console.log(colors.green('Command successful:'));
        console.log('stdout:\n', stdout);
        if (stderr) {
            console.log(colors.yellow('stderr:\n'), stderr);
        }
    } catch (error) {
        console.error(colors.red('Error executing command:'), error);
    }

    // -----------------------------------------------------------------------------
    // Example 2: `execFile` - The secure way to run executables
    //
    // "Cutting Edge" takeaway: Prefer `execFile` over `exec` when running a
    // specific program. It does NOT spawn a shell, which prevents shell injection
    // vulnerabilities. Arguments are passed as an array, so they cannot be
    // misinterpreted by a shell.
    // -----------------------------------------------------------------------------
    console.log(colors.cyan.bold('\n--- Example 2: `execFile` for Security ---'));
    execFile('node', ['--version'], (error, stdout, stderr) => {
        if (error) {
            console.error(colors.red('Error executing file:'), error);
            return;
        }
        console.log(colors.green('Executable finished:'));
        console.log('stdout:\n', stdout);
    });

    // Wait a moment for execFile to finish before the next example
    await new Promise(res => setTimeout(res, 500));

    // -----------------------------------------------------------------------------
    // Example 3: `spawn` - For long-running processes and streaming I/O
    //
    // "Cutting Edge" takeaway: `spawn` is the workhorse. It streams I/O instead
    // of buffering it, making it perfect for long-running tasks (like a dev server)
    // or commands with large amounts of output (like `find` or `ping`).
    // This is the most resource-efficient way to handle child processes.
    // -----------------------------------------------------------------------------
    console.log(colors.cyan.bold('\n--- Example 3: `spawn` for Streaming I/O ---'));
    const pingProcess = spawn('ping', ['-c', '4', 'google.com']);

    console.log(colors.magenta(`Spawned process with PID: ${pingProcess.pid}`));

    // Listen to data coming from the child process's stdout stream
    pingProcess.stdout.on('data', (data) => {
        process.stdout.write(`[ping stdout]: ${data}`);
    });

    // Listen for errors
    pingProcess.stderr.on('data', (data) => {
        process.stdout.write(colors.yellow(`[ping stderr]: ${data}`));
    });

    // Listen for the process to exit
    pingProcess.on('close', (code) => {
        console.log(`\n[ping] child process exited with code ${code}`);
    });

    // Wait for the ping process to close before continuing
    await new Promise(res => pingProcess.on('close', res));

    // -----------------------------------------------------------------------------
    // Example 4: `fork` - For IPC between Node.js processes
    //
    // "Cutting Edge" takeaway: `fork` is a special version of `spawn` for creating
    // new Node.js processes. It creates a built-in communication channel (IPC)
    // that allows parent and child to send messages to each other, enabling true
    // parallel processing for CPU-bound tasks without blocking the main event loop.
    // -----------------------------------------------------------------------------
    console.log(colors.cyan.bold('\n--- Example 4: `fork` for Inter-Process Communication (IPC) ---'));
    const workerPath = path.join(__dirname, 'worker.js');
    const workerProcess = fork(workerPath);

    console.log(colors.magenta(`Forked worker process with PID: ${workerProcess.pid}`));

    // Listen for messages from the worker
    workerProcess.on('message', (message) => {
        if (message.event === 'ready') {
            console.log('[Parent] Worker is ready. Sending it a task...');
            // Send a task to the worker
            workerProcess.send({ task: 'calculate', data: 1e7 });
        }
        if (message.event === 'calculationComplete') {
            console.log(colors.green(`[Parent] Received result from worker: ${message.result}`));
            // We're done with the worker, so we can kill it
            workerProcess.kill();
        }
    });

    workerProcess.on('exit', (code) => {
        console.log(`[worker] child process exited with code ${code}`);
    });

    // Wait for the worker to exit before finishing the script
    await new Promise(res => workerProcess.on('exit', res));
    console.log('\nAll examples complete.');
}

runChildProcessExamples();
