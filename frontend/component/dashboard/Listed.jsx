import React from 'react'
import { Link } from "react-router-dom"

import { AppContext } from "../../App"
import { useAsync } from 'react-async-hook';
import Progress from '../Progress';
import Error from '../Error';
import NoData from '../NoData';

export default function Listed () {

  const { initMarketplace } = React.useContext(AppContext);

  const fetchNfts = async () => {
    BigInt.prototype.toJSON = function () { return this.toString() };
    console.log("request init marketplace canister")
    let marketplace = await initMarketplace();
    console.log("request : marketplace finished. ")
    const userPrincipal = await window.ic?.plug?.agent?.getPrincipal()
    console.log("request tokens start")
    let listedResult = await marketplace.pageListings({
      user: [userPrincipal],
      pageNum: 0,
      pageSize: 10,
      status: { Enable: null }
    });
    console.log("result is : " + JSON.stringify(listedResult));
    return listedResult;
  };

  //const [nfts, setNfts] = React.useState([])
  let res = useAsync(fetchNfts, []);

  return (
    <div>
      <div className="tabs tabs-boxed">
        <Link className="tab lg: tab-lg" to="/dashboard/idle">
          Idle
        </Link>
        <Link className="tab lg: tab-lg tab-active" to="/dashboard/listed">
          Listed
        </Link>
        <Link className="tab lg: tab-lg" to="/dashboard/rented">
          Redeemed
        </Link>

        <Link className="tab lg: tab-lg" to="/dashboard/unft">
          UNFT
        </Link>
        <Link className="tab lg: tab-lg" to="/dashboard/rnft">
          RNFT
        </Link>
      </div>
      {res.loading && <Progress></Progress>}
      {res.error && <Error errorMsg={res.error.message}></Error>}
      {res.result && res.result.data.length == 0 && <NoData></NoData>}
      {res.result && res.result.data.length != 0 && (
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
                    {/* <ListingFlow nftData={{ ...attributes, index: e.index, Web: e.metadata[0].location.Web }}></ListingFlow> */}
                  </div>
                )
              })
            }
          </div>
        </>
      )}
    </div>)
}
