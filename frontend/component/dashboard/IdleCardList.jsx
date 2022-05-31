import React from 'react'
import NftCard from './NftCard'
import AppContext from "../../AppContext"
import { Principal } from "@dfinity/principal"
import { dip721 } from "canisters/dip721"
import { sharing } from "canisters/sharing"
import { Link } from "react-router-dom"

export default function IdleCardList () {
    const { userPrincipal } = React.useContext(AppContext)
    const [nfts, setNfts] = React.useState([])

    async function fetch (userPrincipal) {
        BigInt.prototype.toJSON = function () {
            return this.toString();
        };
        if (!userPrincipal) {
            return []
        }
        return await dip721.getUserTokens(userPrincipal)
    }
    React.useEffect(() => {
        (async () => {
            let nftsRes = await fetch(Principal.fromText("d3muz-iml3r-ou5hr-47nm2-hnnk5-aplkc-y2ql7-xehxt-kghb2-4dokl-gqe"))
            setNfts(nftsRes)
        })()
    }, [userPrincipal])

    return (
        <>
            <div className="tabs tabs-boxed">
                <Link className="tab lg: tab-lg tab-active" to="/dashboard/idle">
                    Idle
                </Link>
                <Link className="tab lg: tab-lg " to="/dashboard/listed">
                    Listed
                </Link>
                <Link className="tab lg: tab-lg" to="/dashboard/rented">
                    Rented
                </Link>
            </div>
            <div className="flex flex-row flex-wrap justify-center gap-10">
                {
                    nfts.map((e, index) => (<NftCard key={index} nftData={e}></NftCard>))
                }
            </div>
        </>
    )
}
