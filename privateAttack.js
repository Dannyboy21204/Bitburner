/** @param {NS} ns **/
export async function main(ns) {
    const target = ns.args[0];
    if (!target) {
        ns.tprint("ERROR: Target server not specified.");
        return;
    }

    // Get all private servers
    const privateServers = getPrivateServers(ns);
    
    while (true) {
        // Calculate the number of threads needed for each operation
        const moneyAvailable = ns.getServerMoneyAvailable(target);
        const maxMoney = ns.getServerMaxMoney(target);
        const minSecurity = ns.getServerMinSecurityLevel(target);
        const currentSecurity = ns.getServerSecurityLevel(target);

        // Avoid division by zero
        const threadsToGrow = maxMoney > 0 ? Math.ceil(ns.growthAnalyze(target, maxMoney / Math.max(1, moneyAvailable))) : 0;
        const securityDeficit = currentSecurity - minSecurity;
        const threadsToWeaken = securityDeficit > 0 ? Math.ceil(securityDeficit / ns.weakenAnalyze(1)) : 0;
        const threadsToHack = moneyAvailable > 0 ? Math.floor(ns.hackAnalyzeThreads(target, moneyAvailable * 0.25)) : 0;

        // Execute weaken if needed
        if (threadsToWeaken > 0) {
            let threadsPerServer = Math.floor(threadsToWeaken / privateServers.length);
            for (const server of privateServers) {
                ns.exec("weaken.js", server, threadsPerServer, target);
            }
            ns.print(`INFO: Weaken ${target} with ${threadsToWeaken} threads using private servers.`);
        }

        // Execute grow if needed
        if (threadsToGrow > 0) {
            let threadsPerServer = Math.floor(threadsToGrow / privateServers.length);
            for (const server of privateServers) {
                ns.exec("grow.js", server, threadsPerServer, target);
            }
            ns.print(`INFO: Grow ${target} with ${threadsToGrow} threads using private servers.`);
        }

        // Execute hack if needed
        if (threadsToHack > 0) {
            let threadsPerServer = Math.floor(threadsToHack / privateServers.length);
            for (const server of privateServers) {
                ns.exec("hack.js", server, threadsPerServer, target);
            }
            ns.print(`INFO: Hack ${target} with ${threadsToHack} threads using private servers.`);
        }

        // Sleep before repeating
        await ns.sleep(10000); // Adjust sleep time as needed
    }
}

// Function to get all private servers
function getPrivateServers(ns) {
    const allServers = ns.getPurchasedServers();
    return allServers.filter(server => server.startsWith("pserv-"));
}
