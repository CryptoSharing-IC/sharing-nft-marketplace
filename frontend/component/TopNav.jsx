import React from "react"
import logo from "../assets/logo.jpg"
import { Link } from "react-router-dom"
import Wallet from "./Wallet"
import Connect from "./Connect.jsx"
// import Wallet from "./Wallet"
export default function TopNav () {
  return (
    <header className="flex flex-row flex-wrap items-center justify-between bg-green-500 p-6">
      <div className="flex items-center flex-shrink-0 text-white mr-6">
        <Link to="/home" className="flex flex-row items-center">
          <img className="h-10 w-10" src={logo}></img>
          <span className="font-semibold text-xl tracking-tight ml-2">
            cryptosharing
          </span>
        </Link>
      </div>
      <div className="w-full text-lg flex-grow flex justify-center w-auto">
        <Link
          to="/lending"
          className=" mt-4 lg:inline-block lg:mt-0 text-teal-200 hover:text-white mr-8"
        >
          Lending
        </Link>
        <Link
          to="/rented"
          className=" mt-4 lg:inline-block lg:mt-0 text-teal-200 hover:text-white mr-8"
        >
          Rented
        </Link>
        <Link
          to="/dashboard"
          className=" mt-4 lg:inline-block lg:mt-0 text-teal-200 hover:text-white"
        >
          My Dashboard
        </Link>
      </div>
      <div>
        <Wallet></Wallet>
      </div>
    </header>
  )
}
