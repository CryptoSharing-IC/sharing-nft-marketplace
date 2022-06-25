import React from 'react'
import EventBus from '../../utils/EventBus'

export default function FinishListingStep () {

    return (
        <div className='flex flex-col'>
            <ul className="steps justify-center">
                <li className="step step-primary" >Listing</li>
                <li className="step step-primary">Staking</li>
                <li className="step step-primary">Mint</li>
                <li className="step step-primary">Finished</li>
            </ul>


            <div className="card bg-base-100 shadow-xl">
                <div className="flex flex-col card-body">
                    <h2>Finished! now your nft is on lending list!</h2>
                </div>
                <div className="modal-action justify-end mr-2">
                    <label htmlFor="listing-step" className="btn" onClick={EventBus.emit("updateIdleList")}>完成</label>
                </div>
            </div>
        </div>
    )
}
