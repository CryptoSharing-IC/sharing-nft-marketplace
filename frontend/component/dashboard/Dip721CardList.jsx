import React from 'react'
import Dip721Card from './Dip721Card'
import AppContext from "../../AppContext"
import { Principal } from "@dfinity/principal"
import { dip721 } from "canisters/dip721"

export default function Dip721IdleCardList () {
    const { userPrincipal } = React.useContext(AppContext)
    const [nfts, setNfts] = React.useState([])

    async function fetch (userPrincipal) {
        if (!userPrincipal) {
            return []
        }
        let tokenIds = await dip721.getTokenIdsForUserDip721(Principal.fromText(userPrincipal))
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
        <div className="flex flex-row flex-wrap justify-between gap-1">
            {
                nfts.map((e, index) => (<Dip721Card key={index} nftData={e}></Dip721Card>))
            }
        </div>
    )
}
