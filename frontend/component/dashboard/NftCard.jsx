import React from 'react'
import LengingStep from './LengingStep'
import ListingFlow from './ListingFlow';

export default function NftCard (props) {
    let attributes = adapter(props.nftData);
    function adapter (nft) {
        let attributes = {};
        if (nft.metadata.length !== 0) {
            nft.metadata[0].attributes.forEach(element => {
                attributes[element.key] = element.value;
            });
        }
        return attributes;
    }

    return (
        <>
            <div className="card w-80 bg-base-100 shadow-xl">
                <figure className="px-5 pt-7">
                    <img src={props.nftData.metadata[0].location.Web} alt="img" className="rounded-xl" />
                </figure>
                <div className="card-body items-center text-center">
                    <h2 className="card-title">{attributes.name}</h2>
                    <p>{attributes.desc}</p>
                    <div className="card-actions">
                        <label htmlFor="listing-step" className="btn modal-button">Lending</label>
                    </div>
                </div>
            </div>
            <ListingFlow nftData={{ ...attributes, index: props.nftData.index, Web: props.nftData.metadata[0].location.Web }}></ListingFlow>
        </>
    )
}
