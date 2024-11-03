/** @param {NS} ns **/
export async function main(ns) {
    const MAX_OPERATION_TIME = 600 * 1000; // 5 minutes in milliseconds

    // Get all servers with root access
    const servers = GetAllServers(ns).filter(s => ns.hasRootAccess(s));

    let bestServer = null;

    // Evaluate each server
    for (const server of servers) {
        const maxMoney = ns.getServerMaxMoney(server);
        const hackTime = ns.getHackTime(server);
        const growTime = ns.getGrowTime(server);
        const weakenTime = ns.getWeakenTime(server);

        // Check if the operation times are within the limit
        if (hackTime <= MAX_OPERATION_TIME &&
            growTime <= MAX_OPERATION_TIME &&
            weakenTime <= MAX_OPERATION_TIME) {
            if (!bestServer || maxMoney > bestServer.maxMoney) {
                bestServer = {
                    server,
                    maxMoney,
                    hackTime,
                    growTime,
                    weakenTime
                };
            }
        }
    }

    // Print the best server
    ns.tprint("----------------------------------------------------------");
    ns.tprint("Best Server for Money (under 5 mins for any operation):");
    ns.tprint("----------------------------------------------------------");
    if (bestServer) {
        ns.tprint(`Server: ${bestServer.server}`);
        ns.tprint(`Max Money: $${bestServer.maxMoney.toLocaleString()}`);
        ns.tprint(`Hack Time: ${ns.tFormat(bestServer.hackTime)}`);
        ns.tprint(`Grow Time: ${ns.tFormat(bestServer.growTime)}`);
        ns.tprint(`Weaken Time: ${ns.tFormat(bestServer.weakenTime)}`);
    } else {
        ns.tprint("No suitable servers found.");
    }
}

// Recursive function to get all servers
export function GetAllServers(ns, root = 'home', found = []) {
    found.push(root);
    for (const server of root === 'home' ? ns.scan(root) : ns.scan(root).slice(1)) {
        GetAllServers(ns, server, found);
    }
    return found;
}
