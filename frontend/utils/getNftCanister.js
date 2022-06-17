import createCanisterFromPlug from "./createCanisterFromPlug";
import canisterIds from "../../.dfx/local/canister_ids.json"
import { idlFactory } from "../../.dfx/local/canisters/dip721/dip721.did.js"

export default async function getNftCanister () {
    const marketplaceCanisterId = canisterIds["dip721"]["local"];
    return await createCanisterFromPlug(marketplaceCanisterId, idlFactory);
}