import React from 'react'
import LengingDetail from './LengingDetail'

export default function NftCard (props) {
    return (
        <>
            <div className="card w-96 bg-base-100 shadow-xl">
                <figure className="px-10 pt-10">
                    <img src={props.nftData.location} alt="img" className="rounded-xl" />
                </figure>
                <div className="card-body items-center text-center">
                    <h2 className="card-title">{props.nftData.name}</h2>
                    <p>{props.nftData.desc}</p>
                    <div className="card-actions">

                        <label htmlFor="lending-modal" className="btn modal-button">Lending</label>
                    </div>
                </div>
            </div>

            <LengingDetail nftData={props.nftData}></LengingDetail>
        </>
    )
}
