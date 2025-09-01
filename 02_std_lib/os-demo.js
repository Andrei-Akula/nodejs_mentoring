

const os = require('os');
const colors = require('ansi-colors');

// Helper to format bytes into KB, MB, GB
const formatBytes = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

// -----------------------------------------------------------------------------
// Example 1: System Information Dashboard
//
// "Cutting Edge" takeaway: Consolidate OS info into a readable summary.
// This is invaluable for diagnostic tools, deployment logs, and ensuring an
// application is running in the expected environment.
// -----------------------------------------------------------------------------
function showSystemInfo() {
    console.log(colors.cyan.bold('--- System Information Dashboard ---'));
    const info = {
        'OS Type': os.type(),
        'Platform': os.platform(),
        'Architecture': os.arch(),
        'OS Release': os.release(),
        'CPU Model': os.cpus()[0].model,
        'CPU Cores': os.cpus().length,
        'Total Memory': formatBytes(os.totalmem()),
        'Uptime': `${(os.uptime() / 3600).toFixed(2)} hours`,
        'User': os.userInfo().username,
        'Home Dir': os.homedir(),
    };
    console.table(info);
}

// -----------------------------------------------------------------------------
// Example 2: CPU-Aware Parallelization Logic
//
// "Cutting Edge" takeaway: Don't guess the optimal number of worker processes.
// Use `os.cpus().length` to scale your application's parallel tasks (e.g.,
// using the `cluster` module or `worker_threads`) to match the host machine's
// hardware for maximum performance.
// -----------------------------------------------------------------------------
function planParallelTasks() {
    console.log(colors.cyan.bold('\n--- CPU-Aware Parallelization Planner ---'));
    const coreCount = os.cpus().length;
    console.log(`This machine has ${colors.green(coreCount)} CPU cores.`);
    if (coreCount >= 4) {
        console.log(`✅ Recommended worker count: ${colors.bold(coreCount)}. Ideal for heavy parallel processing.`);
    } else {
        console.log(`⚠️ Recommended worker count: ${colors.bold(coreCount)}. Consider upgrading for intensive tasks.`);
    }
}

// -----------------------------------------------------------------------------
// Example 3: Cross-Platform Path Resolution
//
// "Cutting Edge" takeaway: Never hardcode file paths. Use `os.platform()` and
// `os.homedir()` to build paths that work reliably across different operating
// systems (Windows, macOS, Linux), making your application portable.
// -----------------------------------------------------------------------------
function getAppDataPath(appName) {
    console.log(colors.cyan.bold('\n--- Cross-Platform Path Resolution ---'));
    const platform = os.platform();
    const homeDir = os.homedir();
    let appDataPath;

    switch (platform) {
        case 'win32':
            // Windows: C:\Users\Username\AppData\Roaming\AppName
            appDataPath = `${process.env.APPDATA}\\${appName}`;
            break;
        case 'darwin':
            // macOS: /Users/Username/Library/Application Support/AppName
            appDataPath = `${homeDir}/Library/Application Support/${appName}`;
            break;
        case 'linux':
            // Linux: /Users/Username/.config/AppName
            appDataPath = `${homeDir}/.config/${appName}`;
            break;
        default:
            // Default fallback
            appDataPath = `${homeDir}/.${appName}`;
            break;
    }
    console.log(`App data path for "${appName}" on ${colors.yellow(platform)} would be:`);
    console.log(colors.magenta(appDataPath));
}

// -----------------------------------------------------------------------------
// Example 4: Simple System Health Monitor
//
// "Cutting Edge" takeaway: Applications can be self-aware. By periodically
// checking `os.freemem()` and `os.loadavg()`, a long-running process can
// log warnings, throttle tasks, or gracefully restart if system resources
// become critically low.
// -----------------------------------------------------------------------------
function monitorSystemHealth() {
    console.log(colors.cyan.bold('\n--- System Health Monitor (running for 5 seconds) ---'));
    const totalMem = os.totalmem();

    const monitorInterval = setInterval(() => {
        const freeMem = os.freemem();
        const usedMem = totalMem - freeMem;
        const memUsage = (usedMem / totalMem) * 100;
        const load = os.loadavg()[0]; // 1-minute load average

        const memColor = memUsage > 75 ? colors.red : memUsage > 50 ? colors.yellow : colors.green;
        const loadColor = load > os.cpus().length ? colors.red : load > os.cpus().length / 2 ? colors.yellow : colors.green;

        process.stdout.write(`Mem Usage: ${memColor(memUsage.toFixed(2) + '%')} | `);
        process.stdout.write(`Load Avg (1m): ${loadColor(load.toFixed(2))}\r`);
    }, 1000);

    setTimeout(() => {
        clearInterval(monitorInterval);
        process.stdout.write('\nMonitor stopped.\n');
    }, 5200);
}

// -----------------------------------------------------------------------------
// Example 5: Network Interface Inspector
//
// "Cutting Edge" takeaway: Services can discover their own network address.
// This is useful for auto-configuring services, service discovery protocols,
// or displaying the correct access URL to the user upon startup.
// -----------------------------------------------------------------------------
function showNetworkAddresses() {
    console.log(colors.cyan.bold('\n--- Network Interface Inspector ---'));
    const interfaces = os.networkInterfaces();
    const results = {};

    for (const name of Object.keys(interfaces)) {
        for (const net of interfaces[name]) {
            // Skip over non-IPv4 and internal (i.e. 127.0.0.1) addresses
            if (net.family === 'IPv4' && !net.internal) {
                if (!results[name]) {
                    results[name] = [];
                }
                results[name].push(net.address);
            }
        }
    }
    if (Object.keys(results).length > 0) {
        console.log('Found the following external IPv4 addresses:');
        console.table(results);
    } else {
        console.log(colors.yellow('No external IPv4 addresses found.'));
    }
}

// Run all examples
showSystemInfo();
planParallelTasks();
getAppDataPath('MyCoolApp');
showNetworkAddresses();
monitorSystemHealth(); // Run the async monitor last

