/** @param {NS} ns **/
export async function main(ns) {
    ns.disableLog('ALL');

    // Get all private servers
    const privateServers = ns.getPurchasedServers().filter(server => server.startsWith("0pserv-") || server.startsWith("1pserv-"));

    if (privateServers.length === 0) {
        ns.tprint("INFO: No private servers found.");
        return;
    }

    // Iterate through each private server and kill all running scripts
    for (const server of privateServers) {
        ns.killall(server); // Kill all scripts on the private server
        ns.tprint(`INFO: Killed all scripts on ${server}.`);
    }
    
    ns.tprint("INFO: Completed killing scripts on all private servers.");
}
