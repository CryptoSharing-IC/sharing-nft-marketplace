import React from "react"
import { Link } from "react-router-dom"
import { marketplace } from "canisters/marketplace"
import { dip721 } from "canisters/dip721"
import AppContext from "../../AppContext"
import { Principal } from "@dfinity/principal"
import { Nat64 } from "@dfinity/candid/lib/cjs/idl"

export default function IdleList () {
  const { userPrincipal, setUserPrincipal } = React.useContext(AppContext)
  const [idleNfts, setIdleNfts] = React.useState([])
  //setUserPrincipal("t5f3o-4jc2c-kedu6-zkclt-jygbq-llpj7-o5sjc-nlwal-l6mis-zk4mq-jae")

  function fetchNftFromDip721 (userPrincipal) {
    userPrincipal = Principal.fromText("t5f3o-4jc2c-kedu6-zkclt-jygbq-llpj7-o5sjc-nlwal-l6mis-zk4mq-jae")
    console.log("user principal is: " + userPrincipal.toText())
    let uniDip721Nfts = [];
    dip721.getTokenIdsForUserDip721(userPrincipal)
      .then(tokenIds => {
        Promise.all(tokenIds.map(id => dip721.getMetadataDip721(id)))
          .then(metadatasDip721 => {
            metadatasDip721.map(metadata => uniDip721Nft(metadata))
              .forEach(element => {
                uniDip721Nfts.push(element)
              });

          })
      })
      .catch(err => console.log(err))
    return uniDip721Nfts;
  }
  function uniDip721Nft (metadataDip721) {

    if (!metadataDip721.Ok) return null
    let uniData = {}
    let metadata = metadataDip721.Ok[0];
    uniData.data = metadata.data
    uniData.purpose = metadata.purpose
    metadata.key_val_data.forEach(e => {
      uniData[e.key] = e.val.TextContent
    })
    return metadataDip721
  }
  React.useEffect(() => {
    //TODO, 针对每一个第三方nft项目实现一个子类,来做差异化处理
    if (true) {
      let nfts = fetchNftFromDip721(userPrincipal)
      setIdleNfts([...idleNfts, ...nfts])
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
      <div>idle</div>
    </>
  )
}
