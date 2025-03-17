import { Worker } from "worker_threads";

export default function handler(req, res) {
    if (req.method !== "GET") {
        return res.status(405).json({ error: "Метод не поддерживается" });
    }

    const worker = new Worker("./workers/dataWorker.js");

    worker.on("message", (result) => {
        res.status(200).json({ message: "Обработка завершена", data: result });
    });

    worker.on("error", (err) => {
        res.status(500).json({ error: err.message });
    });

    worker.postMessage("start");
}
