import React from 'react'
import createCanisterFromPlug from '../../utils/createCanisterFromPlug'
import canisterIds from "../../../.dfx/local/canister_ids.json"
import { idlFactory } from "../../canisters/marketplace/marketplace.did.js"

export default function MintStep (props) {
    const [err, setErr] = React.useState("");
    React.useEffect(() => {
        (async () => {
            const marketplaceCanisterId = canisterIds["marketplace"]["local"];
            const canister = await createCanisterFromPlug(marketplaceCanisterId, idlFactory);
            //通知后端, nft质押完成
            const res = await canister.listingNFT({ id: props.listId });
            res?.Ok ? props.nextStep() : setErr(res?.Err || "Failed to Mint!");
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
                    {!err && (<div className="flex flex-col modal-action justify-end">
                        <progress className="progress w-56 "></progress>
                    </div>)}
                    {err && (
                        <div>err</div>
                    )}
                </div>
            </div>

        </div>


    )
}
