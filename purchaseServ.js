/** @param {NS} ns **/
export async function main(ns) {
    // Check if a server name and RAM amount were provided as arguments
    const [serverName, ramAmount] = ns.args;

    if (!serverName || !ramAmount) {
        ns.tprint("ERROR: Usage: run purchasePrivateServer.js <server-name> <ram-amount>");
        return;
    }

    // Convert ramAmount to an integer
    const ram = parseInt(ramAmount);
    if (isNaN(ram) || ram < 8 || ram > 1048576) {
        ns.tprint("ERROR: RAM amount must be a number between 8 and 1048576 GB.");
        return;
    }

    // Check if the server already exists
    if (ns.serverExists(serverName)) {
        ns.tprint(`ERROR: Server '${serverName}' already exists.`);
        return;
    }

    // Check if the player can afford the server
    const cost = ns.getPurchasedServerCost(ram);
    if (ns.getServerMoneyAvailable("home") < cost) {
        ns.tprint(`ERROR: Not enough money to purchase a server with ${ram} GB of RAM. Cost: $${cost.toLocaleString()}`);
        return;
    }

    // Purchase the server
    const purchasedServer = ns.purchaseServer(serverName, ram);
    if (purchasedServer) {
        ns.tprint(`SUCCESS: Purchased server '${purchasedServer}' with ${ram} GB of RAM.`);
    } else {
        ns.tprint("ERROR: Unable to purchase the server.");
    }
}
