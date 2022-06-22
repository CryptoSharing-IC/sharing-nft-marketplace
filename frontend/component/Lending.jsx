import React from 'react'
import { Link } from "react-router-dom"
import { Actor, HttpAgent } from "@dfinity/agent";
import { marketplace } from '../../.dfx/ic/canisters/marketplace/index.js';

import { AppContext } from "../App"
import { useAsync } from 'react-async-hook';
import RentFlow from './RentFlow';
import NoData from './NoData';
import Error from './Error';
import Progress from './Progress';

export default function Lending () {

  const { initMarketplace } = React.useContext(AppContext);

  const fetchNfts = async () => {
    BigInt.prototype.toJSON = function () { return this.toString() };
    console.log("request init marketplace canister")
    //let marketplace = await initMarketplace();
    console.log("request : marketplace finished. ")
    console.log("request tokens start")
    console.log("marketplace default canister is : " + Buffer.from(await marketplace.accountId()).toString("hex"))
    let listedResult = await marketplace.pageListings({
      user: [],
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
    <div className='bg-gray-100 min-h-500'>
      {res.loading && <Progress></Progress>}
      {res.error && (<Error errorMsg={res.error.message}></Error>)}
      {res.result && res.result.data.length == 0 && (<NoData></NoData>)}
      {res.result && res.result.data.length != 0 && (
        <div>
          <div className='flex justify-center text-xl'>
            <h1 className='text-lg'>Explore Lenging NFT Collections</h1>
          </div>
          <div className="flex flex-row flex-wrap justify-center gap-10">
            {
              res.result.data.map((e, index) => {

                console.log(new Date((+ e.availableUtil.toString()) * 1000).toISOString())
                return (
                  <div key={index}>
                    <div className="card w-80 bg-base-100 shadow-xl">
                      <figure className="px-5 pt-7">
                        <img src={e.web} alt="img" className="rounded-xl" />
                      </figure>
                      <div className="card-body items-center grow">
                        <h2 className="card-title">{e.name}</h2>
                        {/* <div className='flex flex-col grow justify-center justify-items-start '> */}

                        <p>{e.desc}</p>
                        <p>Price: {+ e.price.decimals.toString() / 100000000 + " icp/hour"}</p>

                        <p>Available Util:{new Date((+ e.availableUtil.toString()) * 1000).toISOString().substring(0, 16)} </p>
                        {/* </div> */}


                        <div className="card-actions">
                          <label htmlFor="rent-step" className="btn modal-button">Rent</label>
                        </div>
                      </div>
                    </div>
                    <RentFlow key={index} listing={e}></RentFlow>
                  </div>
                )
              })
            }
          </div>
        </div>
      )}
    </div>)
}
