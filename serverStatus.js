/** @param {NS} ns **/
export async function main(ns) {
    // Get the target server from command line arguments
    const target = ns.args[0];

    if (!target) {
        ns.tprint("ERROR: No target server specified. Usage: run serverStatus.js <server>");
        return;
    }

    // Get server information
    const serverInfo = ns.getServer(target);

    if (!serverInfo) {
        ns.tprint(`ERROR: Server "${target}" not found.`);
        return;
    }

    // Get the current values
    const moneyAvailable = ns.getServerMoneyAvailable(target);
    const maxMoney = serverInfo.moneyMax;
    const currentSecurity = ns.getServerSecurityLevel(target);
    const minSecurity = ns.getServerMinSecurityLevel(target);
    const weakenTime = ns.getWeakenTime(target);
    const growTime = ns.getGrowTime(target);
    const hackTime = ns.getHackTime(target);

    // Print server status to the main terminal
    ns.tprint("----------------------------------------------------------");
    ns.tprint(`Status of Server: ${target}`);
    ns.tprint("----------------------------------------------------------");
    ns.tprint(`Available Money     : $${moneyAvailable.toLocaleString()}`);
    ns.tprint(`Maximum Money       : $${maxMoney.toLocaleString()}`);
    ns.tprint(`Current Security    : ${currentSecurity}`);
    ns.tprint(`Minimum Security    : ${minSecurity}`);
    ns.tprint(`Weaken Time         : ${ns.tFormat(weakenTime)}`);
    ns.tprint(`Grow Time           : ${ns.tFormat(growTime)}`);
    ns.tprint(`Hack Time           : ${ns.tFormat(hackTime)}`);
    ns.tprint("----------------------------------------------------------");
}
