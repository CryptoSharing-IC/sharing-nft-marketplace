import React from 'react'
import nftCanister from "../../canisters/nft/canister"

export default function StakeStep (props) {
    const status = {
        UNSTAKING: "UNSTAKING",
        STAKING: "STAKING",
        ERROR: "ERROR"
    }

    let [staking, setStaking] = React.useState(status.UNSTAKING);

    function onSubmit () {
        //这里比较深了, 所以假设plug钱包已经连接
        setStaking(status.STAKING);
        nftCanister.transfer()

    }
    return (
        <div className='flex flex-col'>
            <ul className="steps justify-center">
                <li className="step step-primary" >Listing</li>
                <li className="step step-primary">Staking</li>
                <li className="step">Mint</li>
                <li className="step">Finished</li>
            </ul>

            <div className="card card-side bg-base-100 shadow-xl">
                <figure><img src="https://api.lorem.space/image/movie?w=200&h=280" alt="Movie" /></figure>
                <div class="card-body">
                    <h2 className="card-title">Transfer this NFT to Sharing Marketplace?</h2>
                    <div className="modal-action justify-end">
                        <progress className="progress w-56" visibility={staking == status.STAKING}></progress>
                        <div class="alert alert-error shadow-lg" visibility={staking == status.ERROR}>
                            <div>
                                <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current flex-shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                <span>Stake NFT failed!</span>
                            </div>
                        </div>
                        <label htmlFor="listing-step" className="btn" disabled={staking == status.STAKING ? "disabled" : ""}>取消</label>
                        <button className="btn" onClick={async () => { onSubmit() }} disabled={staking == status.STAKING ? "disabled" : ""}>质押</button>
                        <div />
                    </div>
                </div>
            </div>

        </div>


    )
}
