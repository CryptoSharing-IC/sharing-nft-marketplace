import React from "react"

import { AppContext } from "../App"
import cansiterIds from "../../canister_ids.json"
import { idlFactory as idlFactoryMarketplace } from "../canisters/marketplace/marketplace.did.js"
import { idlFactory as idlFactorySharing } from "../canisters/sharing/sharing.did.js"
import { idlFactory as idlFactoryDip721 } from "../canisters/nft/dip721.did.js"

export default async function useConnect () {

    const { connected, setConnected } = React.useContext(AppContext);
    const { userPrincipal, setUserPrincipal } = React.useContext(AppContext);
    const { marketplace, setMarketplace } = React.useContext(AppContext);
    const { sharing, setSharing } = React.useContext(AppContext);
    const { dip721, setDip721 } = React.useContext(AppContext);

    const connectedVerify = await window.ic.plug.isConnected();


    let whitelist = [cansiterIds["marketplace"]["ic"], cansiterIds["dip721"]["ic"], cansiterIds["sharing"]["ic"]];
    let host = "https://mainnet.dfinity.network";
    setConnected(connectedVerify)

    if (!connectedVerify) {
        await window.ic.plug.requestConnect({ whitelist, host })
    }

    if (connectedVerify && !window.ic.plug.agent) {
        // window.ic.plug.createAgent({ whitelist, host })
        setMarketplace(await window.ic.plug.createActor({
            canisterId: cansiterIds["marketplace"]["ic"],
            interfaceFactory: idlFactoryMarketplace,
        }));
        setSharing(await window.ic.plug.createActor({
            canisterId: cansiterIds["sharing"]["ic"],
            interfaceFactory: idlFactorySharing,
        }));
        setDip721(await window.ic.plug.createActor({
            canisterId: cansiterIds["dip721"]["ic"],
            interfaceFactory: idlFactoryDip721,
        }));
    }
    React.useEffect(() => {
    
    });
}
