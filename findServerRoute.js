/** @param {NS} ns **/
export async function main(ns) {
    // Get the target server name from the arguments
    const target = ns.args[0];
    if (!target) {
        ns.tprint("ERROR: Please specify a target server as an argument.");
        return;
    }

    // Start searching from 'home' and initialize path
    const path = findRoute(ns, "home", target, []);
    
    // Display the route or show an error if not found
    if (path) {
        ns.tprint(`Route to ${target}: ` + path.join(" -> "));
    } else {
        ns.tprint(`ERROR: Could not find route to ${target}.`);
    }
}

/**
 * Recursively searches for the route to the target server
 * @param {NS} ns
 * @param {string} current - The current server being checked
 * @param {string} target - The server we are trying to find
 * @param {string[]} visited - A list of visited servers to prevent loops
 * @returns {string[] | null} - Returns an array representing the path if found, or null if not
 */
function findRoute(ns, current, target, visited) {
    // Base case: if we found the target, return the path as an array
    if (current === target) {
        return [current];
    }
    
    // Mark this server as visited
    visited.push(current);

    // Scan the connected servers
    for (const neighbor of ns.scan(current)) {
        // Skip any servers we've already visited
        if (visited.includes(neighbor)) continue;

        // Recursively search from this neighbor
        const path = findRoute(ns, neighbor, target, visited);
        if (path) {
            // If we found the target, add this server to the path and return it
            return [current, ...path];
        }
    }
    // Return null if the target is not found in this branch
    return null;
}
