import { Worker } from "worker_threads";
import path from "path";
import { NextApiRequest, NextApiResponse } from "next";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "GET") {
        return res.status(405).json({ error: "Method not supported" });
    }

    const workerPath: string = path.resolve(
        process.cwd(),
        "src/workers/dataWorker.ts"
    );

    try {
        const worker: Worker = new Worker(workerPath);

        worker.on("message", (result: unknown) => {
            res.status(200).json({
                message: "Processing completed",
                data: result,
            });
        });

        worker.on("error", (err: Error) => {
            res.status(500).json({ error: err.message });
        });

        worker.postMessage("start");
    } catch (err) {
        const errorMessage =
            err instanceof Error ? err.message : "Unknown error";
        res.status(500).json({ error: "Worker start error: " + errorMessage });
    }
}
