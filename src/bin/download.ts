import { getOptionsFromEnv } from "./util";
import { downloadByOptions } from "../downloadEntry";
import { getLogger } from "../logger";

export async function downloadByEnv() {
    const logger = getLogger();
    try {

        const options = getOptionsFromEnv();
        logger.log("options:", options)
        await downloadByOptions(options);

    } catch (err: any) {
        logger.error("error:", err && err.message);
    }
}
