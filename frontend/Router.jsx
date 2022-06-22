import React from "react"
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import { App } from "./App"
import Lending from "./component/Lending"
import Rented from "./component/dashboard/Rented"
import { IdleCardList } from "./component/dashboard/IdleCardList"
import Listed from "./component/dashboard/Listed"
import RentedList from "./component/RentedList"
import Unft from "./component/dashboard/Unft"

const BaseRouter = () => (
  <BrowserRouter>
    <Routes>
    // in v6
      <Route path="/" element={<Navigate to="/lending" replace />} />

      <Route path="/" element={<App />}>
        <Route path="/lending" element={<Lending />}></Route>
        <Route path="/rented" element={<RentedList />}></Route>
        <Route path="/dashboard" element={<IdleCardList></IdleCardList>}></Route>
        <Route path="/dashboard/idle" element={<IdleCardList></IdleCardList>}></Route>
        <Route path="/dashboard/listed" element={<Listed></Listed>}></Route>
        <Route path="/dashboard/rented" element={<Rented></Rented>}></Route>
        <Route path="/dashboard/unft" element={<Unft></Unft>}></Route>
      </Route>
    </Routes>
  </BrowserRouter>
)
export default BaseRouter
