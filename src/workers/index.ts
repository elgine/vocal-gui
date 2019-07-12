import EncodeWorker from "worker-loader!./encode.worker.ts";

export default {
    encode: new EncodeWorker()
};