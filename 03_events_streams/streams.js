import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Replicate __dirname functionality in ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create a readable stream from data.txt
// Set the highWaterMark to 50 bytes to control the chunk size.
const readableStream = fs.createReadStream(
  path.join(__dirname, 'data.txt'),
  { highWaterMark: 50 }
);

console.log('Reading file with a highWaterMark of 50 bytes...');

// Listen for the 'data' event, which fires when a chunk is ready
readableStream.on('data', (chunk) => {
  console.log(`Received a chunk of size: ${chunk.length} bytes`);
  // console.log(`Chunk content: "${chunk.toString()}"\n`);
});

// Listen for the 'end' event, which fires when the file has been fully read
readableStream.on('end', () => {
  console.log('Finished reading the file.');
});

// Listen for any errors
readableStream.on('error', (err) => {
  console.error('An error occurred:', err);
});
