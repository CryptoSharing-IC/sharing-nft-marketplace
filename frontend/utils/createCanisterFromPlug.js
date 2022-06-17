//define custom hook
export default async function createCanisterFromPlug (canisterId, idlFactory) {

    const connected = await window?.ic?.plug?.isConnected();
    if (!connected) {
        const host = "http://127.0.0.1:8000"
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