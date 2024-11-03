import { LogMessage } from 'utils.js';

/** @param {NS} ns **/
export async function main(ns) {
    ns.disableLog('ALL');

    const [silent = false] = ns.args;
    const servers = getAllServers(ns);

    let rootedCount = 0;
    let newlyRootedCount = 0;

    // Loop through each server to check and breach
    for (const server of servers) {
        if (ns.hasRootAccess(server)) {
            rootedCount++;
        } else if (await breachServer(ns, server)) {
            ns.tprint(`SUCCESS: Rooted new server: ${server}`);
            newlyRootedCount++;
        }
    }

    // Log the results
    logResults(ns, rootedCount, newlyRootedCount, silent);
}

/** 
 * Attempts to breach a server and returns whether it was successful.
 * @param {NS} ns 
 * @param {string} server 
 * @returns {Promise<boolean>}
 */
async function breachServer(ns, server) {
    const hacks = [ns.brutessh, ns.ftpcrack, ns.relaysmtp, ns.httpworm, ns.sqlinject, ns.nuke];

    // Try to use each hack method, ignoring failures
    for (const hack of hacks) {
        try {
            await hack(server);
        } catch (error) {
            // Optional: Log the specific failure if needed
            // ns.tprint(`Failed to use ${hack.name} on ${server}: ${error.message}`);
        }
    }

    // Return whether we now have root access
    return ns.hasRootAccess(server);
}

/** 
 * Retrieves all servers in the network recursively.
 * @param {NS} ns 
 * @param {string} root 
 * @param {string[]} found 
 * @returns {string[]} 
 */
function getAllServers(ns, root = 'home', found = []) {
    found.push(root);
    for (const server of ns.scan(root)) {
        if (!found.includes(server)) {
            getAllServers(ns, server, found);
        }
    }
    return found;
}

/** 
 * Logs the results of the server breaches.
 * @param {NS} ns 
 * @param {number} rootedCount 
 * @param {number} newlyRootedCount 
 * @param {boolean} silent 
 */
function logResults(ns, rootedCount, newlyRootedCount, silent) {
    if (newlyRootedCount > 0) {
        const totalRooted = rootedCount + newlyRootedCount;
        const message = `SUCCESS: Successfully breached ${newlyRootedCount} new servers (before: ${rootedCount}, after: ${totalRooted})`;
        ns.tprint(message);
        LogMessage(ns, message);
    } else if (!silent) {
        ns.tprint('FAIL: No new servers rooted.');
    }
}
