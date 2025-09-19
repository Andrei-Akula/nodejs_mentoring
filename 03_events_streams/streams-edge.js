import { Readable, Writable, Transform } from 'stream';
import { pipeline } from 'stream/promises';
import { setTimeout } from 'timers/promises';

console.log('--- Modern Node.js Streams Example ---');
console.log('Demonstrating Readable, Transform, and Writable streams with async/await and pipeline.\n');

// --- 1. Readable Stream ---
// A modern Readable stream simulates an asynchronous data source, like fetching data from an API or database.
// It produces data that can be consumed by other streams.
class DataSource extends Readable {
  constructor() {
    // objectMode allows the stream to handle JavaScript objects, not just strings or buffers.
    super({ objectMode: true });
    this.data = ['a', 'b', 'c', 'd', 'e'];
    this.index = 0;
  }

  // _read() is called automatically when a consumer is ready to receive data.
  async _read() {
    if (this.index >= this.data.length) {
      this.push(null); // Pushing null signals that the stream has ended. No more data will be produced.
      return;
    }

    // We create a data object and push it into the stream.
    const chunk = { data: this.data[this.index], timestamp: Date.now() };
    console.log(`[DataSource]   -> Pushing: ${JSON.stringify(chunk)}`);
    this.push(chunk);
    this.index++;

    // Simulate a small delay, like a network request, before the next chunk is ready.
    await setTimeout(200);
  }
}

// --- 2. Transform Stream ---
// A Transform stream is a duplex stream that modifies data as it passes through.
// It's both writable (receives data) and readable (sends modified data).
class UppercaseTransform extends Transform {
  constructor() {
    super({
      readableObjectMode: true, // We will be pushing objects out.
      writableObjectMode: true, // We will be receiving objects in.
    });
  }

  // _transform() is called for each chunk from the upstream (readable) stream.
  _transform(chunk, encoding, callback) {
    try {
      console.log(`[Transformer]  <- Received: ${JSON.stringify(chunk)}`);
      // Modify the data
      chunk.data = chunk.data.toUpperCase();
      chunk.transformedAt = Date.now();
      console.log(`[Transformer]  -> Transformed to: ${JSON.stringify(chunk)}`);

      // Push the modified chunk to be consumed by the next stream in the pipeline.
      this.push(chunk);

      // The callback signals that we have successfully processed this chunk.
      callback();
    } catch (error) {
      // If an error occurs, pass it to the callback.
      callback(error);
    }
  }
}

// --- 3. Writable Stream ---
// A Writable stream is a destination for data. It consumes data but does not produce any.
// This one will simply log the final data to the console.
class DataSink extends Writable {
  constructor() {
    super({ objectMode: true });
  }

  // _write() is called for each chunk that has been processed by the upstream streams.
  _write(chunk, encoding, callback) {
    console.log(`[DataSink]     <- ✅ Final result: ${JSON.stringify(chunk)}\n`);
    // The callback signals that we have successfully handled the data.
    callback();
  }
}

// --- 4. The Pipeline ---
// The `pipeline` function from `stream/promises` connects our streams together.
// It's "modern" because it uses async/await and automatically handles errors and stream cleanup.
// If any stream in the pipeline fails, the pipeline will destroy all streams and throw an error.
async function run() {
  console.log('Starting stream pipeline...\n');
  try {
    await pipeline(
      new DataSource(),
      new UppercaseTransform(),
      new DataSink()
    );
    console.log('\nPipeline finished successfully.');
  } catch (error) {
    console.error('\nPipeline failed:', error);
  }
}

run();
