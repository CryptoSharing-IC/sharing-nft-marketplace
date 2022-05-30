import React from 'react'
import Dip721Card from './NftCard'
import AppContext from "../../AppContext"
import { Principal } from "@dfinity/principal"
import { dip721 } from "canisters/dip721"
import { sharing } from "canisters/sharing"

export default function Dip721IdleCardList () {
    const { userPrincipal } = React.useContext(AppContext)
    const [nfts, setNfts] = React.useState([])

    async function fetch (userPrincipal) {
        if (!userPrincipal) {
            return []
        }
        let tokenIds = await dip721.getTokenInfo(345)
        console.log("token info: " + tokenIds)
        return (await Promise.all(tokenIds.map(id => dip721.getMetadataDip721(id))))
            .map(e => adapter(e))
            .map((e, index) => { return { ...e, ...{ id: tokenIds[index] } } })

    }
    function adapter (metadataDip721) {
        if (!metadataDip721.Ok) return null
        let nft = {}
        let metadata = metadataDip721.Ok[0];
        nft.data = metadata.data
        nft.purpose = metadata.purpose
        metadata.key_val_data.forEach(e => {
            nft[e.key] = e.val.TextContent
        })

        //todo for test
        nft.name = "test"
        nft.desc = "test description"
        return nft
    }
    React.useEffect(() => {
        (async () => {
            // let nfts = await fetch(userPrincipal)
            let nfts = await fetch("d3muz-iml3r-ou5hr-47nm2-hnnk5-aplkc-y2ql7-xehxt-kghb2-4dokl-gqe")
            setNfts(nfts)
        })()
    }, [userPrincipal])

    return (
        <>
            <div className="tabs tabs-boxed">
                <Link className="tab lg: tab-lg" to="/dashboard/all">
                    All
                </Link>
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
            <div className="flex flex-row flex-wrap justify-center">
                <IdleCardList className="grow"></IdleCardList>
            </div>
            <div className="flex flex-row flex-wrap justify-between gap-1">
                {
                    nfts.map((e, index) => (<Dip721Card key={index} nftData={e}></Dip721Card>))
                }
            </div>
        </>
    )
}