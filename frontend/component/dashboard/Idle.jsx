import React from "react"
import { Link } from "react-router-dom"
import { marketplace } from "canisters/marketplace"



import NftCard from "./Dip721Card"
import Dip721IdleCardList from "./Dip721CardList"

export default function IdleList () {







  return (
    <>
      <div className="tabs tabs-boxed">
        <Link className="tab lg: tab-lg" to="/dashboard/all">
          All
        </Link>
        <Link className="tab lg: tab-lg tab-active" to="/dashboard/idle">
          Idle
        </Link>
        <Link className="tab lg: tab-lg " to="/dashboard/listed">
          Listed
        </Link>
        <Link className="tab lg: tab-lg" to="/dashboard/rented">
          Rented
        </Link>
      </div>
      <div className="flex flex-row flex-wrap justify-center">
        <Dip721IdleCardList className="grow"></Dip721IdleCardList>
      </div>



    </>


  )
}
