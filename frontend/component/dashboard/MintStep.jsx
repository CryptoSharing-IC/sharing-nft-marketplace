import React from 'react'

export default function MintStep () {

    //Todo, custome define hook
    async function createNftCanisterFromPlug (canisterId, idlFactory) {
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

    React.useEffect(() => {
        (async () => {
            //通知后端, nft质押完成
        })()
    }, [])

    return (
        <div className='flex flex-col'>
            <ul className="steps justify-center">
                <li className="step step-primary" >Listing</li>
                <li className="step step-primary">Staking</li>
                <li className="step step-primary">Mint</li>
                <li className="step">Finished</li>
            </ul>


            <div className="card bg-base-100 shadow-xl">
                <div className="flex flex-col card-body">
                    <h2 className="card-title">Redemption certificates are being minted for you</h2>
                    <div className="flex flex-col modal-action justify-end">
                        <progress className="progress w-56 "></progress>
                    </div>
                </div>
            </div>

        </div>


    )
}
