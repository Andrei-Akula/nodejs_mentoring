const fs = require('fs');
const path = require('path');

const phaseColors = {
  'script execution': 'yellow',
  'timers phase': 'green',
  'check phase': 'cyan',
  'poll phase': 'blue',
  'nextTick queue': 'magenta',
  'microtask queue': 'red'
};

const colors = {
  yellow: '\x1b[33m',
  green: '\x1b[32m',
  cyan: '\x1b[36m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  red: '\x1b[31m',
  reset: '\x1b[0m'
};

const formatOutput = (message, phase) => {
  const messageWidth = 45;
  const phaseWidth = 20;
  const paddedMessage = message.padEnd(messageWidth);
  const paddedPhase = phase.padEnd(phaseWidth);
  const colorName = phaseColors[phase] || 'reset';
  const colorCode = colors[colorName] || colors.reset;
  console.log(`${colorCode}| ${paddedMessage} | ${paddedPhase} |${colors.reset}`);
};

console.log('| Message                                       | Phase/Queue          |');
console.log('|-----------------------------------------------|----------------------|');


// Initial console.log to show the start of the script
formatOutput('Start of script', 'script execution');

// This will be executed in the timers phase of the next event loop iteration.
setTimeout(() => {
  formatOutput('setTimeout callback', 'timers phase');
}, 0);

// This will be executed in the check phase of the next event loop iteration.
setImmediate(() => {
  formatOutput('setImmediate callback', 'check phase');
});

// This is an I/O operation. The callback will be executed in the poll phase
// after the file has been read.
fs.readFile(path.join(__dirname, 'dummy.txt'), () => {
  formatOutput('fs.readFile callback', 'poll phase');

  // These are scheduled from within an I/O callback
  setTimeout(() => {
    formatOutput('setTimeout inside I/O', 'timers phase');
  }, 0);

  setImmediate(() => {
    formatOutput('setImmediate inside I/O', 'check phase');
  });

  process.nextTick(() => {
    formatOutput('process.nextTick inside I/O', 'nextTick queue');
  });

  Promise.resolve().then(() => {
    formatOutput('Promise.resolve inside I/O', 'microtask queue');
  });
});

// This will be added to the nextTick queue and executed before the event loop starts.
process.nextTick(() => {
  formatOutput('process.nextTick callback', 'nextTick queue');
});

// This will be added to the microtask queue and executed after the nextTick queue,
// but before the event loop starts.
Promise.resolve().then(() => {
  formatOutput('Promise.resolve callback', 'microtask queue');
});

// Another console.log to show the end of the initial script execution.
formatOutput('End of script', 'script execution');

process.on('beforeExit', (code) => {
  console.log('\nExiting the event loop\n');
});
