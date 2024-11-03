/** @param {NS} ns **/
export async function main(ns) {
    ns.disableLog('ALL');

    // Get all servers and their information
    const servers = getAllServers(ns);
    const serverData = [];

    // Gather server information
    for (const server of servers) {
        if (ns.hasRootAccess(server)) {
            const serverInfo = ns.getServer(server);
            serverData.push({
                name: server,
                requiredHackingLevel: serverInfo.requiredHackingSkill,
                maxMoney: serverInfo.moneyMax,
                ram: serverInfo.maxRam
            });
        }
    }

    // Sort servers by required hacking level
    serverData.sort((a, b) => a.requiredHackingLevel - b.requiredHackingLevel);

    // Display the sorted list
    ns.tprint(`Server Scan Results (Sorted by Required Hacking Level):`);
    ns.tprint(`--------------------------------------------------------`);
    ns.tprint(`Server Name             | Required Hacking Level | Max Money        | RAM`);
    ns.tprint(`--------------------------------------------------------`);
    serverData.forEach(server => {
        ns.tprint(`${server.name.padEnd(24)} | ${server.requiredHackingLevel.toString().padEnd(21)} | $${formatMoney(server.maxMoney).padStart(14)} | ${server.ram}`);
    });
    ns.tprint(`--------------------------------------------------------`);
    ns.tprint(`Total Servers Accessible: ${serverData.length}`);
}

/** 
 * Formats money with commas and a dollar sign.
 * @param {number} amount 
 * @returns {string}
 */
function formatMoney(amount) {
    return amount.toLocaleString();
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
