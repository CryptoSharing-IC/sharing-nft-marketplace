
import React from 'react'
import { AppContext } from "../App"

export default function MintUseNftStep (props) {
    const [err, setErr] = React.useState("");
    const { initMarketplace } = React.useContext(AppContext);

    React.useEffect(() => {
        (async () => {
            const canister = await initMarketplace();
            //通知后端, nft质押完成
            console.log("start notify, lend id is: " + props.lend.id)
            const res = await canister.notify({ id: props.lend.id }, props.height);
            console.log("mint result is: " + JSON.stringify(res))
            res["Ok"] ? props.nextStep() : setErr(res["Err"] || "Failed To Mint NFT!");
        })()
    }, [])

    return (
        <div className='flex flex-col'>
            <ul className="steps justify-center">
                <li className="step step-primary" >Lending Info</li>
                <li className="step step-primary">Pay</li>
                <li className="step step-primary">Mint</li>
                <li className="step">Finished</li>
            </ul>


            <div className="card bg-base-100 shadow-xl">
                <div className="flex flex-col card-body">
                    <h2 className="card-title">User NFT are being minted for you</h2>
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
