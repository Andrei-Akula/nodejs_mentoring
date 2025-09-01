const cliProgress = require('cli-progress');
const colors = require('ansi-colors');

// Helper function to simulate async work
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function runExamples() {
    // -----------------------------------------------------------------------------
    // Example 1: Basic Bar with a Custom Payload
    //
    // "Cutting Edge" takeaway: Go beyond a simple percentage. A modern progress
    // bar should provide context. Use custom payloads to display dynamic info
    // like the current file being processed, download speed, or ETA.
    // -----------------------------------------------------------------------------
    console.log(colors.cyan('--- Example 1: Basic Bar with Custom Payload ---'));
    const bar1 = new cliProgress.SingleBar({
        format: 'Processing |' + colors.cyan('{bar}') + '| {percentage}% || {value}/{total} Chunks || Speed: {speed}',
        barCompleteChar: '█',
        barIncompleteChar: '░',
        hideCursor: true
    });

    bar1.start(200, 0, { speed: "N/A" });

    for (let i = 0; i <= 200; i++) {
        bar1.update(i, { speed: (Math.random() * 10 + 5).toFixed(2) + " Mbps" });
        await sleep(15);
    }

    bar1.stop();
    console.log('\n');


    // -----------------------------------------------------------------------------
    // Example 2: Multi-Progress Bars for Parallel Tasks
    //
    // "Cutting Edge" takeaway: Many modern tools perform tasks in parallel.
    // A multi-progress bar container provides a clean, non-flickering way to
    // visualize the status of multiple concurrent operations.
    // -----------------------------------------------------------------------------
    console.log(colors.cyan('--- Example 2: Multi-Progress Bars for Parallel Tasks ---'));
    const multiBar = new cliProgress.MultiBar({
        clearOnComplete: false,
        hideCursor: true,
        format: ' {bar} | {filename} | {value}/{total}'
    }, cliProgress.Presets.shades_grey);

    const b1 = multiBar.create(200, 0, { filename: "file1.zip" });
    const b2 = multiBar.create(500, 0, { filename: "file2.img" });

    const task1 = async () => {
        for (let i = 0; i <= 200; i++) {
            await sleep(20);
            b1.increment();
        }
    };

    const task2 = async () => {
        for (let i = 0; i <= 500; i++) {
            await sleep(10);
            b2.increment();
        }
    };

    await Promise.all([task1(), task2()]);
    multiBar.stop();
    console.log('\n');


    // -----------------------------------------------------------------------------
    // Example 3: Indeterminate Progress for Unknown Durations
    //
    // "Cutting Edge" takeaway: Sometimes you don't know the total size of an
    // operation. An indeterminate (shuttling) progress bar provides clear
    // visual feedback that the application is working, not frozen.
    // -----------------------------------------------------------------------------
    console.log(colors.cyan('--- Example 3: Indeterminate Progress ---'));
    const bar3 = new cliProgress.SingleBar({
        format: colors.yellow('Connecting to remote server [{bar}] {duration}s'),
        barCompleteChar: '█',
        barIncompleteChar: '░',
        hideCursor: true,
    });

    // Start with a total of 0 for an indeterminate bar
    bar3.start(100, 0);

    // Simulate a task of unknown length
    let connectTime = 0;
    const interval = setInterval(() => {
        connectTime++;
        bar3.update(connectTime);
    }, 1000);

    await sleep(4200); // Simulate connection established after 4.2 seconds
    clearInterval(interval);
    bar3.update(100); // Fill the bar to 100%
    bar3.stop();
    console.log('\n');


    // -----------------------------------------------------------------------------
    // Example 4: Logging During Progress
    //
    // "Cutting Edge" takeaway: A common challenge is logging text without
    // breaking the progress bar's rendering. Use the library's built-in
    // logging support to print messages cleanly above the active bar.
    // -----------------------------------------------------------------------------
    console.log(colors.cyan('--- Example 4: Logging During Progress ---'));
    const multiLogBar = new cliProgress.MultiBar({
        clearOnComplete: false,
        hideCursor: true,
        format: ' {bar} | {task} | {value}/{total}'
    }, cliProgress.Presets.shades_classic);

    const logBar = multiLogBar.create(100, 0, { task: "Main Process" });

    for (let i = 0; i <= 100; i++) {
        logBar.increment();
        await sleep(30);

        if (i === 25) {
            multiLogBar.log(colors.yellow('WARN: A minor, non-blocking issue occurred.\n'));
        }
        if (i === 60) {
            multiLogBar.log(colors.green('INFO: Checkpoint reached successfully.\n'));
        }
    }

    multiLogBar.stop();
    console.log('\n');


    // -----------------------------------------------------------------------------
    // Example 5: Dynamic Updates and Custom Themes
    //
    // "Cutting Edge" takeaway: Progress bars can be dynamic. You can update the
    // total value on the fly. You can also fully customize the format function
    // to create a unique, branded look for your CLI tool.
    // -----------------------------------------------------------------------------
    console.log(colors.cyan('--- Example 5: Dynamic Updates and Custom Themes ---'));

    const customThemeBar = new cliProgress.SingleBar({
        hideCursor: true,
        // Custom formatter function
        format: (options, params, payload) => {
            const bar = options.barCompleteString.substr(0, Math.round(params.progress * options.barsize));
            const percentage = Math.floor(params.progress * 100) + '';
            const status = payload.status || '...';
            return `${colors.bold('MyApp |')} ${colors.magenta(bar)} ${percentage}% | ${colors.yellow(status)}`;
        }
    });

    customThemeBar.start(100, 0, { status: 'Initializing...' });
    await sleep(1000);

    // Update total and payload on the fly
    customThemeBar.setTotal(300);
    customThemeBar.update(50, { status: 'Downloading files...' });
    await sleep(2000);

    customThemeBar.update(250, { status: 'Extracting archive...' });
    await sleep(1500);

    customThemeBar.update(300, { status: 'Complete!' });
    customThemeBar.stop();
}

runExamples();