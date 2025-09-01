

// -----------------------------------------------------------------------------
// Example 1: Safe and Unsafe Buffer Allocation
//
// "Cutting Edge" takeaway: Understanding the performance vs. security trade-off
// between `alloc` and `allocUnsafe` is crucial for high-performance applications.
// Always prefer `Buffer.alloc()` unless you have a specific, measured reason
// to use `Buffer.allocUnsafe()` and are certain you will overwrite the memory.
// -----------------------------------------------------------------------------
console.log('--- Example 1: Safe and Unsafe Buffer Allocation ---');

// Safe allocation: The buffer is zero-filled.
// This prevents old, sensitive data from leaking into the new buffer.
const safeBuffer = Buffer.alloc(10);
console.log('Safe Buffer (zero-filled):', safeBuffer);

// Unsafe allocation: Faster, but the allocated memory segment is not initialized.
// It may contain old data from the application's memory space.
// Use it only when you are immediately going to write over the entire buffer.
const unsafeBuffer = Buffer.allocUnsafe(10);
console.log('Unsafe Buffer (uninitialized):', unsafeBuffer);

// To make an unsafe buffer safe, you must fill it completely.
unsafeBuffer.fill(0);
console.log('Unsafe Buffer after fill():', unsafeBuffer);
console.log('\n');


// -----------------------------------------------------------------------------
// Example 2: Advanced Binary Data Manipulation (Custom Protocol)
//
// "Cutting Edge" takeaway: Buffers allow you to work directly with binary
// data, enabling the creation of highly efficient custom data protocols for
// networking or file storage, avoiding JSON/XML overhead.
// -----------------------------------------------------------------------------
console.log('--- Example 2: Advanced Binary Data Manipulation ---');

// Let's define a custom binary protocol for a sensor reading:
// - 4 bytes: Sensor ID (UInt32 Big Endian)
// - 8 bytes: Timestamp (BigInt64 Big Endian)
// - 4 bytes: Temperature (Float Big Endian)

const packetSize = 4 + 8 + 4;
const packetBuffer = Buffer.alloc(packetSize);

const sensorId = 101;
const timestamp = BigInt(Date.now());
const temperature = 23.5;

// Write data to the buffer at specific offsets
console.log(`Encoding packet: ID=${sensorId}, Time=${timestamp}, Temp=${temperature}`);
packetBuffer.writeUInt32BE(sensorId, 0);
packetBuffer.writeBigInt64BE(timestamp, 4);
packetBuffer.writeFloatBE(temperature, 12);

console.log('Encoded Packet (as hex):', packetBuffer.toString('hex'));

// Now, let's read the data back from the buffer
const decodedSensorId = packetBuffer.readUInt32BE(0);
const decodedTimestamp = packetBuffer.readBigInt64BE(4);
const decodedTemperature = packetBuffer.readFloatBE(12);

console.log(`Decoded Packet: ID=${decodedSensorId}, Time=${new Date(Number(decodedTimestamp))}, Temp=${decodedTemperature.toFixed(1)}`);
console.log('\n');


// -----------------------------------------------------------------------------
// Example 3: Efficiently Handling Chunked Data with `Buffer.concat()`
//
// "Cutting Edge" takeaway: When receiving data in chunks (e.g., from a TCP
// stream or a file read), `Buffer.concat()` is the most performant way to
// assemble the final buffer, as it can pre-calculate the total length and
// perform a single, optimized memory copy.
// -----------------------------------------------------------------------------
console.log('--- Example 3: Efficiently Handling Chunked Data ---');

const chunk1 = Buffer.from('Hello, ');
const chunk2 = Buffer.from('Node.js ');
const chunk3 = Buffer.from('Buffers!');
const chunks = [chunk1, chunk2, chunk3];

// Inefficient way (multiple intermediate buffers and string conversions)
let combinedString = '';
for (const chunk of chunks) {
    combinedString += chunk.toString();
}
const finalBufferFromString = Buffer.from(combinedString);
console.log('Inefficient result:', finalBufferFromString.toString());


// Highly efficient way using Buffer.concat()
const totalLength = chunks.reduce((acc, chunk) => acc + chunk.length, 0);
const finalBuffer = Buffer.concat(chunks, totalLength);
console.log('Efficient result:  ', finalBuffer.toString());
console.log('\n');


// -----------------------------------------------------------------------------
// Example 4: Buffers and Cryptography
//
// "Cutting Edge" takeaway: The `crypto` module heavily relies on Buffers for
// handling binary data securely and efficiently. All cryptographic operations
// from hashing to encryption/decryption are performed on buffers.
// -----------------------------------------------------------------------------
console.log('--- Example 4: Buffers and Cryptography ---');
const crypto = require('crypto');

const dataToHash = Buffer.from('This is a secret message.');

// Create a SHA-256 hash
const hash = crypto.createHash('sha256');
hash.update(dataToHash);
const hashedResult = hash.digest('hex'); // Get result as a hex string

console.log('Original Data:', dataToHash.toString());
console.log('SHA-256 Hash (hex):', hashedResult);

// Example of using a buffer for an encryption key
const key = crypto.randomBytes(32); // Generate a secure, random 32-byte key
console.log('Generated Encryption Key (hex):', key.toString('hex'));
console.log('\n');


// -----------------------------------------------------------------------------
// Example 5: Buffers for Encoding and Decoding (Base64 URL Safe)
//
// "Cutting Edge" takeaway: Buffers are essential for handling different data
// encodings. A modern use case is creating URL-safe Base64 strings, often
// used in JWTs, web push notifications, and other web protocols.
// -----------------------------------------------------------------------------
console.log('--- Example 5: Buffers for URL-Safe Base64 ---');

const complexDataObject = { user: 'gemini', roles: ['admin', 'editor'], iat: 1678886400 };
const jsonString = JSON.stringify(complexDataObject);

// Create a Base64 string from the JSON
const base64String = Buffer.from(jsonString).toString('base64');
console.log('Standard Base64:', base64String);

// Standard Base64 includes characters ('+', '/', '=') that are not URL-safe.
// Let's make it safe for URLs.
const base64UrlSafe = base64String
    .replace(/\+/g, '-') // Replace '+' with '-'
    .replace(/\//g, '_') // Replace '/' with '_'
    .replace(/=/g, '');   // Remove '=' padding

console.log('URL-Safe Base64:', base64UrlSafe);

// How to decode it back
const originalBase64 = base64UrlSafe
    .replace(/-/g, '+')
    .replace(/_/g, '/');

const decodedJson = Buffer.from(originalBase64, 'base64').toString('utf8');
const decodedObject = JSON.parse(decodedJson);

console.log('Decoded Object:', decodedObject);
