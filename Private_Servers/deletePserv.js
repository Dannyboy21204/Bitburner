/** @param {NS} ns **/
export async function main(ns) {
    // Check if a server name was provided as an argument
    const [serverName] = ns.args;

    if (!serverName) {
        ns.tprint("ERROR: No server name specified. Usage: run deletePrivateServer.js <server-name>");
        return;
    }

    // Check if the server exists
    if (!ns.serverExists(serverName)) {
        ns.tprint(`ERROR: Server '${serverName}' does not exist.`);
        return;
    }

    // Confirm deletion
    const confirmation = await ns.prompt(`Are you sure you want to delete the server '${serverName}'? This action cannot be undone.`);
    
    if (confirmation) {
        // Delete the server
        ns.deleteServer(serverName);
        ns.tprint(`SUCCESS: Server '${serverName}' has been deleted.`);
    } else {
        ns.tprint("CANCELLED: Server deletion has been aborted.");
    }
}
