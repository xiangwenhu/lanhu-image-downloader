import { Logger } from "./types";


let _logger: Logger = console;

export function setLogger(logger: Logger) {
    _logger = logger;
}

export function getLogger() {
    return _logger;
}
