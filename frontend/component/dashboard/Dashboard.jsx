import React from "react"
import Rented from "./Rented"
import { Link } from "react-router-dom"

export default function Dashboard() {
  return (
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
  )
}
