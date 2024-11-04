const MIN_HOME_RAM = 64;          // Amount of RAM to reserve on the home server
const MAX_SECURITY_DRIFT = 3;     // Max security level drift allowed before weakening
const MAX_MONEY_DRIFT = 0.1;      // Max percentage of money drift allowed before growing

/** @param {NS} ns **/
export async function main(ns) {
    ns.disableLog('ALL');
    
    const [target] = ns.args;
    if (!target) {
        ns.tprint("ERROR: No target specified. Usage: run privateAutoHackManager.js <target>");
        return;
    }
    
    ns.tprint(`INFO: Starting hack process on target: ${target}`);
    await createScripts(ns); // Create basic hack, grow, weaken scripts
    await manageHackCycle(ns, target); // Start the hack management cycle
}

// Main loop to manage hacking cycle on the target server
async function manageHackCycle(ns, target) {
    while (true) {
        const moneyThresh = ns.getServerMaxMoney(target) * (1 - MAX_MONEY_DRIFT);
        const securityThresh = ns.getServerMinSecurityLevel(target) + MAX_SECURITY_DRIFT;
        
        if (ns.getServerSecurityLevel(target) > securityThresh) {
            ns.print(`INFO: Security too high, weakening ${target}`);
            await distributeWork(ns, 'weaken', target);
        } else if (ns.getServerMoneyAvailable(target) < moneyThresh) {
            ns.print(`INFO: Money too low, growing ${target}`);
            await distributeWork(ns, 'grow', target);
        } else {
            ns.print(`INFO: Optimal conditions reached, hacking ${target}`);
            await distributeWork(ns, 'hack', target);
        }
        await ns.sleep(100); // Pause briefly to avoid continuous checking
    }
}

// Distribute work across all private servers for a specified operation (hack, grow, weaken)
async function distributeWork(ns, operation, target) {
    const privateServers = getPrivateServers(ns); // Get only private servers
    const scriptName = `temp-${operation}.js`;
    const ramPerThread = ns.getScriptRam(scriptName);
    let threadsNeeded = calculateThreads(ns, target, operation);
    
    for (const server of privateServers) {
        let maxThreads = Math.floor((ns.getServerMaxRam(server) - ns.getServerUsedRam(server)) / ramPerThread);
        
        if (server === 'home') maxThreads = Math.max(0, maxThreads - Math.floor(MIN_HOME_RAM / ramPerThread));
        if (maxThreads <= 0 || threadsNeeded <= 0) continue;
        
        let threadsToUse = Math.min(maxThreads, threadsNeeded);
        if (server !== ns.getHostname()) await ns.scp(scriptName, server);
        
        ns.print(`INFO: Executing ${operation} on ${server} with ${threadsToUse} threads`);
        ns.exec(scriptName, server, threadsToUse, target);
        threadsNeeded -= threadsToUse;
        
        if (threadsNeeded <= 0) break;
    }
}

// Calculate the number of threads needed for a given operation on a target server
function calculateThreads(ns, target, operation) {
    switch (operation) {
        case 'weaken':
            const securityDeficit = ns.getServerSecurityLevel(target) - ns.getServerMinSecurityLevel(target);
            return Math.ceil(securityDeficit / ns.weakenAnalyze(1));
        case 'grow':
            const moneyAvailable = ns.getServerMoneyAvailable(target);
            return Math.ceil(ns.growthAnalyze(target, ns.getServerMaxMoney(target) / Math.max(1, moneyAvailable)));
        case 'hack':
            return Math.floor(ns.hackAnalyzeThreads(target, ns.getServerMoneyAvailable(target) * 0.25));
        default:
            return 0;
    }
}

// Creates simple one-line worker scripts if they don’t already exist
async function createScripts(ns) {
    await ns.write('temp-hack.js', 'export async function main(ns) { await ns.hack(ns.args[0]) }', 'w');
    await ns.write('temp-grow.js', 'export async function main(ns) { await ns.grow(ns.args[0]) }', 'w');
    await ns.write('temp-weaken.js', 'export async function main(ns) { await ns.weaken(ns.args[0]) }', 'w');
}

// Recursively find all private servers accessible from "home"
function getPrivateServers(ns) {
    return ns.getPurchasedServers().filter(server => server.startsWith("pserv-"));
}
