import createCanister from "./createCanisterFromPlug";
import canisterIds from "../../../.dfx/local/canister_ids.json"
import { idlFactory } from "../../canisters/sharing/sharing.did.js"

export default async function getSharingCanister () {
    const marketplaceCanisterId = canisterIds["sharing"]["local"];
    return await createCanisterFromPlug(marketplaceCanisterId, idlFactory);
}