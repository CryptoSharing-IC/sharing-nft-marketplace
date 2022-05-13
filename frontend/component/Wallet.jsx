import React from "react"
import PlugConnect from "@psychedelic/plug-connect"
import wallet_icon from "../assets/wallet.png"
import { useEffect, useState, useContext } from "react"
import shortPrincipal from "../utils/short-principal"
import { AppContext } from "../App"

export default function Wallet () {
    const { connected, setConnected } = React.useContext(AppContext);
    const { userPrincipal, setUserPrincipal } = React.useContext(AppContext);
    const [title, setTitle] = useState("login with plug")

    useEffect(async () => {
        if (connected) {
            const principal = await window.ic.plug.agent.getPrincipal()

            if (principal) {
                setUserPrincipal(principal.toText())
                setTitle(shortPrincipal(principal.toText()))
            }

        } else {
            setTitle("login with plug")
        }
    }, [connected])
    return connected ? (<div>{title}</div>) : (
        <PlugConnect
            dark
            title={title}
            host="http://127.0.0.1:8000"
            whitelist={["r7inp-6aaaa-aaaaa-aaabq-cai", "ryjl3-tyaaa-aaaaa-aaaba-cai"]}
            onConnectCallback={() => setConnected(true)}
        />
    )
}
