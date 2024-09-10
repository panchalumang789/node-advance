const { parentPort, workerData } = require('worker_threads');

console.log(`Worker ${workerData} started`);

parentPort?.on('message', (message) => {
  const result = performTask(workerData);
  console.log(`Received message from main thread: ${message}, Result: ${result}`);

  // Send the result back to the main thread
  parentPort?.postMessage(result);
});

function performTask(data) {
  let result = 0;
  for (let i = 0; i < 100000000; i++) {
    result += i * data;
  }
  return result;
}
