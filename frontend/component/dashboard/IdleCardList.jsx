import React from 'react'
import { Link } from "react-router-dom"
import ListingFlow from './ListingFlow';
import EventBus from '../../utils/EventBus';

import { AppContext } from "../../App"
import { useAsync } from 'react-async-hook';
import Progress from "../Progress"
import Error from "../Error"
import { set } from 'react-hook-form';

export function IdleCardList () {

    const { initDip721 } = React.useContext(AppContext);
    let [res, setRes] = React.useState(null)

    const fetchNfts = async () => {
        BigInt.prototype.toJSON = function () { return this.toString() };
        console.log("request init dip721 canister")
        let nftCanister = await initDip721();
        console.log("request : initdip721 finished. ")
        const userPrincipal = await window.ic?.plug?.agent?.getPrincipal()
        console.log("request tokens start")
        let nftsRes = await nftCanister.getUserTokens(userPrincipal);
        console.log("result is : " + JSON.stringify(nftsRes));
        return nftsRes;
    };


    const init = () => {
        setRes(useAsync(fetchNfts, []))
    };
    React.useEffect(() => {
        EventBus.addListener("updateIdeleList", init)
        init();
    }, []);

    return (<div>
        <div className="tabs tabs-boxed">
            <Link className="tab lg: tab-lg tab-active" to="/dashboard/idle">
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
            <Link className="tab lg: tab-lg" to="/dashboard/rnft">
                RNFT
            </Link>
        </div>
        {res.loading && <Progress></Progress>}
        {res.error && <Error errorMsg={res.error.message}></Error>}
        {res.result && (
            <>

                <div className="flex flex-row flex-wrap justify-center gap-10">
                    {
                        res.result.map((e, index) => {
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
                                            <h2 className="card-title">{attributes.name}</h2>
                                            <p>{attributes.desc}</p>
                                            <div className="card-actions">
                                                <label htmlFor="listing-step" className="btn modal-button">Lending</label>
                                            </div>
                                        </div>
                                    </div>
                                    <ListingFlow nftData={{ ...attributes, index: e.index, Web: e.metadata[0].location.Web }}></ListingFlow>
                                </div>
                            )
                        })
                    }
                </div>
            </>
        )}
    </div>)
}