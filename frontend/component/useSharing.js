import React from 'react'

import { AppContext } from "../App"
import cansiterIds from "../../canister_ids.json"
import { idlFactory as idlFactorySharing } from "../../.dfx/ic/canisters/sharing/sharing.did"
export default async function useSharing () {

    const { connected, setConnected } = React.useContext(AppContext);
    const { sharing, setSharing } = React.useContext(AppContext);

    let whitelist = [cansiterIds["sharing"]["ic"], cansiterIds["dip721"]["ic"], cansiterIds["sharing"]["ic"]];
    let host = "https://mainnet.dfinity.network";
    if (!connected) {
        try {
            let publicKey = await window.ic.plug.requestConnect({ whitelist, host });
            setConnected(true);
        } catch (error) {
            return null;
        }
    }
    if (!sharing) {
        setSharing(await window.ic.plug.createActor({
            canisterId: cansiterIds["sharing"]["ic"],
            interfaceFactory: idlFactorySharing,
        }));
    }
    return sharing;
}