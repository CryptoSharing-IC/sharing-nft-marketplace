import React from "react";
import AppContext from "../../AppContext";
import { idlFactory } from "./dip721.did.js"

const { canisters } = React.useContext(AppContext);
const whitelist = [...canisters];


let nftCanister;
(async () => {
    await window?.ic?.plug?.requestConnect({
        whitelist,
    });

    nftCanister = await window.ic.plug.createActor({
        canisterId: canisters.nftCanisterId,
        interfaceFactory: idlFactory,
    });
})()
export default nftCanister;