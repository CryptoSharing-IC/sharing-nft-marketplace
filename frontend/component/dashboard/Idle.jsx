import React from "react"
import { Link } from "react-router-dom"
import { marketplace } from "canisters/marketplace"
import { dip721 } from "canisters/dip721"

import { Principal } from "@dfinity/principal"
import NftCard from "./Dip721Card"
import Dip721IdleCardList from "./Dip721IdleCardList"

export default function IdleList () {
  
  
  //setUserPrincipal("t5f3o-4jc2c-kedu6-zkclt-jygbq-llpj7-o5sjc-nlwal-l6mis-zk4mq-jae")

  async function fetchNftFromDip721 (userPrincipal) {
    userPrincipal = Principal.fromText("t5f3o-4jc2c-kedu6-zkclt-jygbq-llpj7-o5sjc-nlwal-l6mis-zk4mq-jae")
    console.log("user principal is: " + userPrincipal.toText())
    let uniDip721Nfts = [];
    let tokenIds = await dip721.getTokenIdsForUserDip721(userPrincipal)
    return (await Promise.all(tokenIds.map(id => dip721.getMetadataDip721(id))))
      .map(e => dip721Adapter(e))
  }
  function dip721Adapter (metadataDip721) {

    if (!metadataDip721.Ok) return null
    let uniData = {}
    let metadata = metadataDip721.Ok[0];
    uniData.data = metadata.data
    uniData.purpose = metadata.purpose
    metadata.key_val_data.forEach(e => {
      uniData[e.key] = e.val.TextContent
    })
    return uniData
  }
  React.useEffect(() => {
    //TODO, 针对每一个第三方nft项目实现一个子类,来做差异化处理
    if (true) {
      (async () => {
        let nfts = await fetchNftFromDip721(userPrincipal)
        setIdleNfts(nfts)
        console.log("data:" + JSON.stringify(nfts))
      })()
    }

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
      <div className="flex flex-row flex-wrap">
        <Dip721IdleCardList></Dip721IdleCardList>
      </div>



    </>


  )
}
