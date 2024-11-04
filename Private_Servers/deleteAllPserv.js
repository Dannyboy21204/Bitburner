/** @param {NS} ns **/
export async function main(ns) {
    ns.disableLog('ALL');

    // Get all purchased servers
    const purchasedServers = ns.getPurchasedServers();
    let deletedCount = 0;

    // Loop through each purchased server and delete if it matches the *pserv-* pattern
    for (const server of purchasedServers) {
        if (server.match(/^\d+pserv-\d$/)) { // Regex to match pattern like "0pserv-1", "9pserv-9", etc.
            ns.killall(server); // Kill all scripts on the server
            const success = ns.deleteServer(server); // Delete the server
            if (success) {
                ns.tprint(`SUCCESS: Deleted server ${server}`);
                deletedCount++;
            } else {
                ns.tprint(`FAIL: Could not delete server ${server}`);
            }
        }
    }

    // Summary of operations
    if (deletedCount > 0) {
        ns.tprint(`INFO: Successfully deleted ${deletedCount} server(s) matching *pserv-* pattern.`);
    } else {
        ns.tprint("INFO: No servers matching *pserv-* pattern found.");
    }
}
