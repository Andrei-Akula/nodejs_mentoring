
// This is the child process script for the fork() example.

// A CPU-intensive function to simulate work
function performComplexCalculation(iterations) {
    let result = 0;
    for (let i = 0; i < iterations; i++) {
        result += Math.sqrt(i) * Math.sin(i);
    }
    return result;
}

process.on('message', (message) => {
    if (message.task === 'calculate') {
        console.log(`[Worker] Received task to perform ${message.data} iterations.`);
        const result = performComplexCalculation(message.data);

        // Send the result back to the parent process
        process.send({ 
            event: 'calculationComplete', 
            result: result 
        });
    } else {
        process.send({ 
            event: 'error', 
            message: 'Unknown task' 
        });
    }
});

// Notify the parent that the worker is ready
process.send({ event: 'ready' });
