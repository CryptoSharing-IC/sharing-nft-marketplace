import React from 'react'

export default function MintStep () {

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
