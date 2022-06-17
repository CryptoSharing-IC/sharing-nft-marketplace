import createCanisterFromPlug from "./createCanisterFromPlug";
import canisterIds from "../../.dfx/local/canister_ids.json"
import { idlFactory } from "../../.dfx/local/canisters/marketplace/marketplace.did.js"

export default async function getMarketplaceCanister () {
    const marketplaceCanisterId = canisterIds["marketplace"]["local"];
    return await createCanisterFromPlug(marketplaceCanisterId, idlFactory);
}