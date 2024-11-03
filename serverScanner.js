/** @param {NS} ns **/
export async function main(ns) {
    // Function to recursively scan for all servers
    function getAllServers(ns, root = 'home', found = []) {
        found.push(root);
        for (const server of ns.scan(root)) {
            if (!found.includes(server)) {
                getAllServers(ns, server, found);
            }
        }
        return found;
    }

    // Get all servers in the network
    const servers = getAllServers(ns);
    
    // Collect server info only for servers with root access
    const serverInfoArray = servers
        .filter(server => ns.hasRootAccess(server)) // Only include servers we have root access to
        .map(server => {
            const info = ns.getServer(server);
            return {
                name: server,
                maxMoney: info.moneyMax,
                ram: info.maxRam
            };
        });

    // Sort servers by RAM in descending order
    serverInfoArray.sort((a, b) => b.ram - a.ram);

    ns.tprint("Server Information (Sorted by RAM, Only with Root Access):");
    ns.tprint("--------------------------------------------------------");
    ns.tprint("Server Name           | Max Money       | RAM (GB)");
    ns.tprint("--------------------------------------------------------");

    // Display the server's information
    for (const serverInfo of serverInfoArray) {
        const maxMoney = ns.nFormat(serverInfo.maxMoney, "$0.000a"); // Format max money
        
        ns.tprint(`${serverInfo.name.padEnd(20)} | ${maxMoney.padEnd(15)} | ${serverInfo.ram} GB`);
    }

    ns.tprint("--------------------------------------------------------");

    // Show the total number of servers with root access
    ns.tprint(`Total servers with root access: ${serverInfoArray.length}`);
}
