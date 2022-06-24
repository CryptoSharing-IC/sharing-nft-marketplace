import React from 'react'
import { Link } from "react-router-dom"
import ListingFlow from './ListingFlow';

import { AppContext } from "../../App"
import { useAsync } from 'react-async-hook';
import Progress from "../Progress"
import Error from "../Error"
import NoData from '../NoData';
import getMarketplaceCanister from '../../utils/getMarketplactCanister';
import getSharingCanister from "../../utils/getSharingCanister";

export default function Unft () {

    const { initSharing, initMarketplace } = React.useContext(AppContext);
    let redeemError = null;

    let [redeemStatus, setRedeemStatus] = React.useState("Pending")

    const redeem = async (listingId) => {
        setRedeemStatus("Pending")
        redeemError = "";

        console.log("Start redeem , the linsting id is: " + listingId)
        console.log("start init marketplace canister agent")
        let marketplace = await getMarketplaceCanister();

        console.log("finish init marketplace canister ")
        // try {
        console.log("start redeem ")
        let redeemRes = await marketplace.redeem({ id: Number(listingId) })
        console.log("redeem result is : " + JSON.stringify(redeemRes))
        if (redeemRes.hasOwnProperty("Ok")) {
            setRedeemStatus("completed")
            redeemError = null;
            console.log("the api return Ok")
        } else {
            setRedeemStatus("Error")
            redeemError = redeemRes.Err
        }
    };
    const fetchNfts = async () => {
        BigInt.prototype.toJSON = function () { return this.toString() };
        console.log("request init sharing canister")
        let nftCanister = await getSharingCanister();

        console.log("request : initSharing finished. ")
        const userPrincipal = await window.ic?.plug?.agent?.getPrincipal()
        console.log("request tokens start")
        let nftsRes = await nftCanister.getUserTokens(userPrincipal);
        console.log("result is : " + JSON.stringify(nftsRes));
        return nftsRes;
    };

    //const [nfts, setNfts] = React.useState([])
    let res = useAsync(fetchNfts, []);

    return (<div>
        <div className="tabs tabs-boxed">
            <Link className="tab lg: tab-lg " to="/dashboard/idle">
                Idle
            </Link>
            <Link className="tab lg: tab-lg " to="/dashboard/listed">
                Listed
            </Link>
            <Link className="tab lg: tab-lg" to="/dashboard/rented">
                Redeemed
            </Link>

            <Link className="tab lg: tab-lg" to="/dashboard/unft">
                UNFT
            </Link>
            <Link className="tab lg: tab-lg tab-active" to="/dashboard/rnft">
                RNFT
            </Link>
        </div>
        {res.result && (res.result = res.result.filter((item, index, array) => {
            return item["metadata"][0]["attributes"][0]["value"] == "wNFT"
        })) && ""}
        {res.result && console.log(JSON.stringify(res))}
        {res.loading && <Progress></Progress>}
        {res.error && <Error errorMsg={res.error.message}></Error>}
        {res.result && (res.result.length == 0) && <NoData></NoData>}
        {res.result && (res.result.length != 0) && (
            <>
                <div className="flex flex-row flex-wrap justify-center gap-10 mb-500">
                    {
                        res.result.filter((item, index, array) => {
                            console.log("nft in filter is: " + JSON.stringify(item))
                            return item["metadata"][0]["attributes"][0]["value"] == "wNFT"
                        })

                            .map((e, index) => {
                                let attributes =
                                    function adapter (nft) {
                                        let attributes = {};
                                        if (nft.metadata.length !== 0) {
                                            nft.metadata[0].attributes.forEach(element => {
                                                attributes[element.key] = element.value;
                                            });
                                        }
                                        return attributes;
                                    }(e);

                                return (
                                    <div key={index}>
                                        <div className="card w-80 bg-base-100 shadow-xl">
                                            <figure className="px-5 pt-7">
                                                <img src={e.metadata[0].location.Web} alt="img" className="rounded-xl" />
                                            </figure>
                                            <div className="card-body items-center text-center">
                                                <h2 className="card-title">"Your RNFT"</h2>
                                                <p>can use this nft to redeem you original nft.</p>
                                                <p>original nft contract is: {attributes.canisterId}</p>
                                                <p>original nft id is: {attributes.originalNft}</p>
                                            </div>
                                            <label for="redeem-modal" onClick={async () => { redeem(attributes.listingId) }} className="btn modal-button">Redeem</label>
                                        </div>
                                        <input type="checkbox" id="redeem-modal" className="modal-toggle" />
                                        <div className="modal">
                                            <div className="modal-box">
                                                {
                                                    {
                                                        "Pending": (
                                                            <div >
                                                                <h3 className="font-bold text-lg">The original NFT is being redeemed</h3>
                                                                <progress className="progress w-56 ml-20"></progress>
                                                            </div>),
                                                        "completed": (
                                                            <div>
                                                                <h3 className="font-bold text-lg">Redemption completed, you can view the original NFT in dashboard Idle panel.</h3>
                                                                <div className="modal-action">
                                                                    <label for="redeem-modal" className="btn">Close</label>
                                                                </div>
                                                            </div>),
                                                        "Error":
                                                            (<div>
                                                                <div className="alert alert-error">
                                                                    <div>
                                                                        <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current flex-shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                                                        <span>{JSON.stringify(redeemError)}</span>
                                                                    </div>
                                                                </div>
                                                                <div className="modal-action">
                                                                    <label for="redeem-modal" className="btn">Close</label>
                                                                </div>
                                                            </div>),
                                                    }[redeemStatus]
                                                }
                                            </div>
                                        </div>
                                    </div>
                                )
                            })
                    }
                </div>
            </>
        )}
    </div>)
}