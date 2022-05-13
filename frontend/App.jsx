import React from "react"
import AppContext from "./AppContext"
import bg from "./assets/bg.png"

import { Outlet } from "react-router-dom"
import TopNav from "./component/TopNav"
import Footer from "./component/Footer"


function App () {
  const [connected, setConnected] = React.useState(false)
  const [userPrincipal, setUserPrincipal] = React.useState()
  return (
    <AppContext.Provider
      value={{ connected, setConnected, userPrincipal, setUserPrincipal }}
    >
      <div className="lg:container flex flex-col flex-nowrap mx-auto">
        <TopNav></TopNav>
        <div>
          <img src={bg} alt="bg"></img>
        </div>

        <Outlet></Outlet>

        <Footer></Footer>
      </div>
    </AppContext.Provider>
  )
}

export { App, AppContext }
