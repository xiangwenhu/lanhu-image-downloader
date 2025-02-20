import path from "path";
import "petal-service";
import { readConfig } from "../src/config";
import service from "../src/services/index";

; (async function init() {
    const configPath = path.join(__dirname, "../data/config.json")

    const config = readConfig(configPath);
    const cookie = Array.isArray(config.cookies) ? config.cookies.map(c => `${c.name}=${c.value}`).join("; ") : `${config.cookies}`;

    // 设置服务的cookie
    petalSetConfig({
        headers: {
            cookie
        }
    })

    const teams = await service.getUserTeams();

    const teamId = teams[0].id;

    const sources = await service.getTeamSourceList({
        data: {
            parentId: 0,
            tenantId: teamId
        }
    });

    console.log("sources:", sources);

})();

