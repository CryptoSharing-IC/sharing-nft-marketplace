import React from 'react'

import { AppContext } from "../App"
import cansiterIds from "../../canister_ids.json"
import { idlFactory as idlFactoryMarketplace } from "../canisters/marketplace/marketplace.did.js"

export default async function useMarketplace () {

    const { connected, setConnected } = React.useContext(AppContext);
    const { marketplace, setMarketplace } = React.useContext(AppContext);

    let whitelist = [cansiterIds["marketplace"]["ic"], cansiterIds["dip721"]["ic"], cansiterIds["sharing"]["ic"]];
    let host = "https://mainnet.dfinity.network";


    React.useEffect(async () => {
        if (!connected) {
            try {
                await window.ic.plug.requestConnect({ whitelist, host });
                setConnected(true);
            } catch (error) {
                return null;
            }
        }
        if (!marketplace) {
            setMarketplace(await window.ic.plug.createActor({
                canisterId: cansiterIds["marketplace"]["ic"],
                interfaceFactory: idlFactoryMarketplace,
            }));
        }
    }, []);

    return marketplace;
}
