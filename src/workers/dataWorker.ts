const { parentPort } = require("worker_threads");

parentPort.on("message", () => {
    let result = 0;
    for (let i = 0; i < 1e9; i++) {
        result += i % 10;
    }
    parentPort.postMessage(result);
});
