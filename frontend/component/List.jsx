import React from "react"
import { useEffect, useState } from "react"

export default function List (props) {
  let [queryData, setQueryData] = useState(props)

  let [nfts, setNfts] = useState([])

  useEffect(() => {
    //todo
    //setNfts((await fetch("", queryData))
  }, [queryData])

  return (
    <div className="flex">
      <aside className="w-96 bg-cyan-500 order-0">
        <h3>Fliter</h3>
        <ul>
          <li>
            <a href="#">topic 1</a>
          </li>
          <li>
            <a href="#">topic 1</a>
          </li>
          <li>
            <a href="#">topic 1</a>
          </li>
          <li>
            <a href="#">topic 1</a>
          </li>
        </ul>
      </aside>
      <main className="flex flex-col grow bg-gray-100 bg-pink-300 p-1">
        <div className="text-3xl font-bold  pb-4 text-center">
          NFT Collections
        </div>
        <div className="grid lg:grid-cols-3 gap-6 xl:gap-x-12 bg-blue-500 p-4">
          <div className="flex flex-col bg-black-500 rounded-lg  p-1 w-60 h-60">
            <img
              src="https://mdbcdn.b-cdn.net/img/new/standard/city/024.webp"
              className="rounded-lg w-full"
            />
            <div className="flex justify-start">
              <div>nft's name</div>
            </div>
            <div className="flex justify-between">
              <div>Rental Period</div>
              <div>100 days</div>
            </div>
            <div className="flex justify-between">
              <div>price</div>
              <div>10 icp</div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
