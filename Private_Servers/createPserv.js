/** @param {NS} ns **/
export async function main(ns) {
    ns.disableLog('ALL');

    const ram = 1024; // Set RAM for each server
    let createdCount = 0;

    // Loop through the first digit (0 to 4)
    for (let i = 0; i <= 4; i++) {
        // Loop through the second digit (0 to 4)
        for (let j = 0; j <= 4; j++) {
            const serverName = `${i}pserv-${j}`;

            // Check if server already exists
            if (ns.serverExists(serverName)) {
                ns.tprint(`INFO: Server ${serverName} already exists.`);
                continue;
            }

            // Try to purchase the server
            const success = ns.purchaseServer(serverName, ram);
            if (success) {
                ns.tprint(`SUCCESS: Purchased server ${serverName} with ${ram}GB RAM.`);
                createdCount++;
            } else {
                ns.tprint(`FAIL: Could not purchase server ${serverName}. Insufficient funds.`);
            }

            // Add a small delay to avoid flooding the purchase requests
            await ns.sleep(100);
        }

        // Also create *pserv-main servers
        const mainServerName = `${i}pserv-main`;
        if (!ns.serverExists(mainServerName)) {
            const mainSuccess = ns.purchaseServer(mainServerName, ram);
            if (mainSuccess) {
                ns.tprint(`SUCCESS: Purchased server ${mainServerName} with ${ram}GB RAM.`);
                createdCount++;
            } else {
                ns.tprint(`FAIL: Could not purchase server ${mainServerName}. Insufficient funds.`);
            }
            await ns.sleep(100); // Delay for purchasing
        }
    }

    // Summary of creation
    ns.tprint(`INFO: Total servers created: ${createdCount} out of 30 possible servers.`);
}
