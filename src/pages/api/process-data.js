import { Worker } from "worker_threads";
import path from "path";

export default function handler(req, res) {
    if (req.method !== "GET") {
        return res.status(405).json({ error: "Method not supported" });
    }

    const workerPath = path.resolve(process.cwd(), "src/workers/dataWorker.js");

    try {
        const worker = new Worker(workerPath);

        worker.on("message", (result) => {
            res.status(200).json({
                message: "Processing completed",
                data: result,
            });
        });

        worker.on("error", (err) => {
            res.status(500).json({ error: err.message });
        });

        worker.postMessage("start");
    } catch (err) {
        res.status(500).json({
            error: " Worker start error: " + err.message,
        });
    }
}
