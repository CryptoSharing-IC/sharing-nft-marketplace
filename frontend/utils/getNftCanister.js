import createCanister from "./createCanisterFromPlug";
import canisterIds from "../../../.dfx/local/canister_ids.json"
import { idlFactory } from "../../canisters/nft/dip721.did.js"

export default async function getSharingCanister () {
    const marketplaceCanisterId = canisterIds["dip721"]["local"];
    return await createCanisterFromPlug(marketplaceCanisterId, idlFactory);
}