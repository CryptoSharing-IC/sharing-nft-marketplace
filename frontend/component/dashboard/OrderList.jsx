import React from 'react'
import { AppContext } from "../App"
import { useAsync } from 'react-async-hook';
import NoData from './NoData';
import Error from './Error';
import Progress from './Progress';
import getMarketplaceCanister from '../../utils/getMarketplactCanister';

export default function OrderList () {

    const fetchNfts = async () => {
        BigInt.prototype.toJSON = function () { return this.toString() };
        console.log("request init marketplace canister")
        let marketplace = await getMarketplaceCanister();
        console.log("request : marketplace finished. ")
        console.log("request tokens start")

        let enableLendRes = await marketplace.pageEnableLend(
            10,
            0,
        );
        console.log("enable lend list result is : " + JSON.stringify(enableLendRes));
        return enableLendRes;
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
                        <h1 className='text-[30px]'>Explore Rented NFT Collections</h1>
                    </div>
                    <div className="flex flex-row flex-wrap justify-center gap-10">
                        {
                            res.result.data.map((e, index) => {
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

                                                <p>rent start: {new Date(Number(e.start) * 1000).toISOString().substring(0, 16)} </p>
                                                <p>rent end: {new Date(Number(e.end) * 1000).toISOString().substring(0, 16)} </p>
                                                <p>create at: {new Date(Number(e.createdAt) / 1000000000).toISOString().substring(0, 16)} </p>
                                                <p>total amount: {Number(e.amount) / 100000000} icp </p>
                                                <p>uNFT ID is: {e.uNFTId[0]}</p>
                                            </div>

                                        </div>
                                    </div>
                                )
                            })
                        }
                    </div>
                </div>
            )}
        </div>)
}
