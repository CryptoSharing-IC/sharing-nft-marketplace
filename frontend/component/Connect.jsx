import {
  ConnectButton,
  ConnectDialog,
  Connect2ICProvider,
  useConnect,
} from "@connect2ic/react"

export default function Connect () {
  const { isConnected, principal, provider
  } = useConnect({
    onConnect: () => {
      // Signed in, todo
    },
    onDisconnect: () => {
      // Signed out todo
    },
  })

  return (
    <>
      <ConnectButton />
      <ConnectDialog dark={false} />
    </>
  )
}
