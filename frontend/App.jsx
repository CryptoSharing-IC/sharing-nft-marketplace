import React from "react"
import AppContext from "./AppContext"
import bg from "./assets/bg.png"

import { Outlet } from "react-router-dom"
import TopNav from "./component/TopNav"
import Footer from "./component/Footer"


function App () {
  const [connected, setConnected] = React.useState(false)
  const [marketplace, setMarketplace] = React.useState(null);
  const [sharing, setSharing] = React.useState(null);
  const [dip721, setDip721] = React.useState(null);

  return (
    <AppContext.Provider
      value={{ connected, setConnected, marketplace, setMarketplace, sharing, setSharing, dip721, setDip721 }}
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
