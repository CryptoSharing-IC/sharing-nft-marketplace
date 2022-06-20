/* eslint-disable react/prop-types */
import React from "react"
import { marketplace } from "canisters/marketplace"

export default function List (props) {
  BigInt.prototype.toJSON = function () { return this.toString() }
  let [pageData, setPageData] = React.useState(null)

  React.useEffect(() => {
    (async () => {
      console.log(props.status)
      let pageData = await marketplace.pageListings({
        pageSize: props.pageSize || 10,
        pageNum: props.pageNum || 1,
        status: props.status
      });
      console.log("listing page data is: " + JSON.stringify(pageData));

    })()
  }, [props.pageSize, props.pageNum])

  return (
    <div className="flex grow">
      <main className="flex flex-col grow rounded-xl   p-1">
        <div className="text-3xl font-bold  pb-4 text-center">
          Explore Collections
        </div>
        <div className="grid lg:grid-cols-3 gap-6 xl:gap-x-12  p-4">
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
