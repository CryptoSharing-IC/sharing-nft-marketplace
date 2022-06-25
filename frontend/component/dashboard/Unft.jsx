import React from 'react'
import { Link } from "react-router-dom"
import ListingFlow from './ListingFlow';

import { AppContext } from "../../App"
import { useAsync } from 'react-async-hook';
import Progress from "../Progress"
import Error from "../Error"
import NoData from '../NoData';
import getSharingCanister from "../../utils/getSharingCanister";

export default function Unft () {


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

            <Link className="tab lg: tab-lg tab-active" to="/dashboard/unft">
                UNFT
            </Link>
            <Link className="tab lg: tab-lg" to="/dashboard/rnft">
                RNFT
            </Link>
        </div>
        {res.loading && <Progress></Progress>}
        {res.error && <Error errorMsg={res.error.message}></Error>}
        {res.result && res.result.length == 0 && <NoData></NoData>}
        {res.result && res.result.length != 0 && (
            <>

                <div className="flex flex-row flex-wrap justify-center gap-10 mb-500">
                    {
                        res.result.filter((item, index, array) => {
                            console.log("nft in filter is: " + JSON.stringify(item))
                            return item["metadata"][0]["attributes"][0]["value"] == "uNFT"
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
                                                <h2 className="card-title">"Your uNFT"</h2>
                                                <p>this nft can on behalf of the original nft.</p>
                                                <p>rent start: {new Date(Number(attributes.start) * 1000).toISOString().substring(0, 16)} </p>
                                                <p>rent end: {new Date(Number(attributes.end) * 1000).toISOString().substring(0, 16)} </p>

                                                <p>total amount: {Number(attributes.amount) / 100000000} icp </p>

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