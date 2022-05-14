import React from 'react'
import Dip721Card from './Dip721Card'
import AppContext from "../../AppContext"
import { Principal } from "@dfinity/principal"
import { dip721 } from "canisters/dip721"

export default function Dip721IdleCardList () {
    const { userPrincipal } = React.useContext(AppContext)
    const [nfts, setNfts] = React.useState([])

    async function fetch (userPrincipal) {
        let tokenIds = await dip721.getTokenIdsForUserDip721(userPrincipal)
        return (await Promise.all(tokenIds.map(id => dip721.getMetadataDip721(id))))
            .map(e => adapter(e))
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
        return nft
    }
    React.useEffect(() => {

        userPrincipal = Principal.fromText("t5f3o-4jc2c-kedu6-zkclt-jygbq-llpj7-o5sjc-nlwal-l6mis-zk4mq-jae")
            (async () => {
                let nfts = await fetch(userPrincipal)
                setIdleNfts(nfts)
                console.log("data:" + JSON.stringify(nfts))
            })()


    }, [userPrincipal])

    return (
        <div className="flex flex-row flex-wrap">
            {
                nfts.map((e, index) => (<Dip721Card key={index} location={e.location}></Dip721Card>))
            }
        </div>
    )
}
