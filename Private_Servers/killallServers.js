/** @param {NS} ns **/
export async function main(ns) {
    ns.disableLog('ALL'); // Disable all logs for cleaner output

    // Get all servers accessible from "home"
    const allServers = getAllServers(ns);
    
    if (allServers.length === 0) {
        ns.tprint("INFO: No servers found.");
        return;
    }

    // Iterate through each server and kill all running scripts
    for (const server of allServers) {
        ns.killall(server); // Kill all scripts on the server
        ns.tprint(`INFO: Killed all scripts on ${server}.`);
    }

    ns.tprint("INFO: Completed killing scripts on all servers.");
}

// Recursively find all servers accessible from "home"
function getAllServers(ns, root = 'home', found = new Set()) {
    found.add(root);
    for (const server of ns.scan(root)) {
        if (!found.has(server)) {
            getAllServers(ns, server, found);
        }
    }
    return Array.from(found);
}
