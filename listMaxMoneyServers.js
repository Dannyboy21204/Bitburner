/** @param {NS} ns */
export async function main(ns) {
    // Get all servers
    let servers = GetAllServers(ns);

    // Create an array of server data with their maximum money for servers with root access
    let serverData = servers
        .filter(server => ns.hasRootAccess(server)) // Filter servers with root access
        .map(server => {
            let serverInfo = ns.getServer(server);
            return {
                name: server,
                maxMoney: serverInfo.moneyMax
            };
        });

    // Sort the servers based on maximum money in descending order
    serverData.sort((a, b) => b.maxMoney - a.maxMoney);

    // Print the sorted list to the main terminal
    ns.tprint("Available servers with root access sorted by maximum money:");
    ns.tprint("----------------------------------------------------------");
    ns.tprint("Server Name                     | Max Money          ");
    ns.tprint("----------------------------------------------------------");
    serverData.forEach(data => {
        ns.tprint(`${data.name.padEnd(30)} | $${data.maxMoney.toLocaleString().padStart(15)}`);
    });

    // Optional: Add a delay to allow for terminal to catch up with output
    await ns.sleep(1000);
}

/** Recursive function to get all servers */
export function GetAllServers(ns, root = 'home', found = []) {
    found.push(root);
    for (const server of root == 'home' ? ns.scan(root) : ns.scan(root).slice(1)) {
        GetAllServers(ns, server, found);
    }
    return found;
}
