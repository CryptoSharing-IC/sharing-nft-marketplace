import React from 'react'

import { AppContext } from "../App"
import cansiterIds from "../../canister_ids.json"
    import { idlFactory as idlFactoryDip721 } from "../../.dfx/ic/canisters/dip721/dip721.did"

export default function useDip721 () {

    const { connected, setConnected } = React.useContext(AppContext);
    const { dip721, setDip721 } = React.useContext(AppContext);

    let whitelist = [cansiterIds["marketplace"]["ic"], cansiterIds["dip721"]["ic"], cansiterIds["sharing"]["ic"]];
    let host = "https://mainnet.dfinity.network";
    if (!connected) {
        try {
            let publicKey = await window.ic.plug.requestConnect({ whitelist, host });
            setConnected(true);
        } catch (error) {
            return null;
        }
    }
    if (!dip721) {
        setDip721(await window.ic.plug.createActor({
            canisterId: cansiterIds["dip721"]["ic"],
            interfaceFactory: idlFactoryDip721,
        }));
    }
    return dip721;
}