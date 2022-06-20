import React from 'react'
import { Link } from "react-router-dom"

import { AppContext } from "../App"
import { useAsync } from 'react-async-hook';

export default function RentedList () {

  const { initMarketplace } = React.useContext(AppContext);

  const fetchNfts = async () => {
    BigInt.prototype.toJSON = function () { return this.toString() };
    console.log("request init marketplace canister")
    let marketplace = await initMarketplace();
    console.log("request : marketplace finished. ")
    console.log("request tokens start")
    let listedResult = await marketplace.pageListings({
      user: [],
      pageNum: 0,
      pageSize: 10,
      status: { Redeemed: null }
    });
    console.log("result is : " + JSON.stringify(listedResult));
    return listedResult;
  };

  //const [nfts, setNfts] = React.useState([])
  let res = useAsync(fetchNfts, []);

  return (
    <div>
      {res.loading && <div>Loading</div>}
      {res.error && <div>Error: {res.error.message}</div>}
      {res.result && (
        <>

          <div className="flex flex-row flex-wrap justify-center gap-10">
            {
              res.result.data.map((e, index) => {
                return (
                  <div key={index}>
                    <div className="card w-80 bg-base-100 shadow-xl">
                      <figure className="px-5 pt-7">
                        <img src={e.web} alt="img" className="rounded-xl" />
                      </figure>
                      <div className="card-body items-center text-center">
                        <h2 className="card-title">{e.name}</h2>
                        <p>{e.desc}</p>
                        <div className="card-actions">
                          <label htmlFor="listing-step" className="btn modal-button">Take Down</label>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })
            }
          </div>
        </>
      )}
    </div>)
}
