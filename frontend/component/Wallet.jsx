import React from "react"
import PlugConnect from "@psychedelic/plug-connect"
import shortPrincipal from "../utils/short-principal"
import { AppContext } from "../App"
import cansiterIds from "../../canister_ids.json"


let whitelist = [cansiterIds["marketplace"]["ic"], cansiterIds["dip721"]["ic"], cansiterIds["sharing"]["ic"]];
let host = "https://mainnet.dfinity.network";

export default function Wallet () {
    const { connected, setConnected } = React.useContext(AppContext);

    const [title, setTitle] = React.useState("login with plug")

    React.useEffect(async () => {
        if (connected) {

            const principal = await window.ic.plug.agent.getPrincipal()

            if (principal) {
                setTitle(shortPrincipal(principal.toText()))
            }

        } else {
            setTitle("login with plug");
        }
    }, [connected])
    return connected ? (<div>{title}</div>) : (
        <PlugConnect
            dark
            title={title}
            host={host}
            whitelist={whitelist}
            onConnectCallback={() => setConnected(true)}
        />
    )
}
