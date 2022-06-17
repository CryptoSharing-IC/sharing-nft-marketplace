import createCanister from "./createCanisterFromPlug";
import canisterIds from "../../../.dfx/local/canister_ids.json"
import { idlFactory } from "../../canisters/marketplace/marketplace.did.js"

export default async function getMarketplaceCanister () {
    const marketplaceCanisterId = canisterIds["marketplace"]["local"];
    return await createCanisterFromPlug(marketplaceCanisterId, idlFactory);
}