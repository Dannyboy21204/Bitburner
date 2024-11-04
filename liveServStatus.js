/** @param {NS} ns **/
export async function main(ns) {
    const target = ns.args[0];
    if (!target) {
        ns.tprint("ERROR: No target specified. Usage: run liveServerStatus.js <target>");
        return;
    }

    ns.disableLog('ALL');

    // Continuously update the target server status
    while (true) {
        const moneyAvailable = ns.getServerMoneyAvailable(target);
        const maxMoney = ns.getServerMaxMoney(target);
        const securityLevel = ns.getServerSecurityLevel(target);
        const minSecurityLevel = ns.getServerMinSecurityLevel(target);

        // Format money with commas and dollar sign
        const formattedMoney = `$${moneyAvailable.toLocaleString()} / $${maxMoney.toLocaleString()}`;
        
        // Print the current status to the terminal
        ns.print('---------------------------------');
        ns.print(`Status of ${target}:`);
        ns.print(`Money: ${formattedMoney}`);
        ns.print(`Security Level: ${securityLevel} (Min: ${minSecurityLevel})`);
        ns.print('---------------------------------');

        // Sleep for a specified interval before updating again (e.g., 5 seconds)
        await ns.sleep(1000);
    }
}
