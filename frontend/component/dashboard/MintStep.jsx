import React from 'react'
import { AppContext } from "../../App"
import createCanisterFromPlug from '../../utils/createCanisterFromPlug'
import canisterIds from "../../../canister_ids.json"
import { idlFactory } from "../../canisters/marketplace/marketplace.did.js"

export default function MintStep (props) {
    const [err, setErr] = React.useState("");
    const { initMarketplace } = React.useContext(AppContext);

    React.useEffect(() => {
        (async () => {
            const marketplaceCanisterId = canisterIds["marketplace"]["ic"];
            const canister = await initMarketplace();
            //通知后端, nft质押完成
            const res = await canister.listingNFT({ id: props.listId });
            console.log("mint result is: " + JSON.stringify(res))
            res["Ok"] ? props.nextStep() : setErr(res["Err"] || "Failed to Mint!");
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
                        <div>{err}</div>
                    )}
                </div>
            </div>

        </div>


    )
}
