//define custom hook
export default async function createCanisterFromPlug (canisterId, idlFactory) {

    const connected = await window?.ic?.plug?.isConnected();
    if (!connected) {
        const host = "https://mainnet.dfinity.network"
        const whitelist = [canisterId];
        await window?.ic?.plug?.requestConnect({
            whitelist,
            host
        });
    }
    return await window.ic.plug.createActor({
        canisterId: canisterId,
        interfaceFactory: idlFactory,
    });
}