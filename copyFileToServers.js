/** @param {NS} ns **/
export async function main(ns) {
    ns.disableLog('ALL');

    // Get the filename to copy from the command line arguments
    const [fileToCopy] = ns.args;
    if (!fileToCopy) {
        ns.tprint('FAIL: No file specified to copy. Usage: run copyFileToServers.js <file>');
        return;
    }

    // Get all servers
    const servers = getAllServers(ns);
    let copiedCount = 0;

    // Loop through each server and copy the file if root access is available
    for (const server of servers) {
        if (ns.hasRootAccess(server)) {
            // Use scp to copy the file to the server
            const success = ns.scp(fileToCopy, server);
            if (success) {
                ns.tprint(`SUCCESS: Copied ${fileToCopy} to ${server}`);
                copiedCount++;
            } else {
                ns.tprint(`FAIL: Failed to copy ${fileToCopy} to ${server}`);
            }
        }
    }

    // Summary of operations
    ns.tprint(`INFO: Total servers copied: ${copiedCount} out of ${servers.length}`);
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
