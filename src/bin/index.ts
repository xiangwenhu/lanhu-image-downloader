import { downloadByOptions } from "../downloadEntry";
import { getLogger } from "../logger";
import { getOptionsFromEnv } from "./util";

async function start() {
    const logger = getLogger();
    try {
        const options = getOptionsFromEnv();
        logger.log("options:", options)
        await downloadByOptions(options);

    } catch (err: any) {
        logger.error("error:", err && err.message);
    }
}



start();