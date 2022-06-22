import React from 'react'
import { AppContext } from "../../App"
import canisterIds from "../../../canister_ids.json"


export default function LendingStep (props) {
    const { initMarketplace } = React.useContext(AppContext);

    let [state, setState] = React.useState(
        {
            availableUtil: "",
            minPeriod: 1,
            price: 1
        }
    )
    let [show, setShow] = React.useState("");

    const handleChange = e => {
        setState({
            ...state,
            [e.target.name]: e.target.value
        }
        )
    }

    async function onSubmit () {
        //点击下一步 先提示本次操作的结果, 如果成功就进入下一步
        //TODO, add validater code
        console.log("canisters ids is: " + JSON.stringify(canisterIds))
        let dip721CanisteId = canisterIds["dip721"]["ic"];
        if (!state.availableUtil || !state.minPeriod || !state.price) {
            //temp code, 
            alert("输入不合法!");
            return
        }
        setShow("PROGRESS");
        let preListingArg = {
            canisterId: dip721CanisteId,
            nftId: props.nftData.index,
            name: props.nftData.name,
            desc: props.nftData.desc,
            web: props.nftData.Web,
            availableUtil: Date.parse(state.availableUtil) / 1000,
            price: { decimals: Math.trunc(state.price * 100000000), symbol: "ICP" },
            minPeriod: state.minPeriod
        }
        console.log("perListingArg: " + JSON.stringify(preListingArg))

        let marketplace = await initMarketplace();

        let reponse = await marketplace.preListingNFT(preListingArg)
        // check the result 
        console.log(reponse)
        if (reponse?.Ok) {
            props.setListId(reponse.Ok);
            props.nextStep();
        } else {
            setShow("ERROR_RESULT")
        }

    }
    return (
        <div className='flex flex-col'>
            <ul className="steps justify-center">
                <li className="step step-primary" >Listing</li>
                <li className="step">Staking</li>
                <li className="step">Mint</li>
                <li className="step">Finished</li>
            </ul>
            <div className="card card-side bg-base-50 ">
                <figure className="grow "><img src={props.nftData.Web} alt="img" /></figure>
                <div className="card-body">
                    <h2 className="card-title">{props.nftData.name}</h2>
                    <p>{props.nftData.desc}</p>
                    <label className="label">
                        <span className="label-text">Available util:</span>
                    </label>
                    <input type="datetime-local" className=" input-bordered  input w-full max-w-xs" name="availableUtil" value={state.availableUtil} onChange={handleChange} />

                    <label className="label">
                        <span className="label-text">lend period(day):</span>
                    </label>
                    <div className='flex flex-row items-center'>
                        <input type="number" className=" input-bordered  input w-20 max-w-xs" name="minPeriod" value={state.minPeriod} onChange={handleChange} />
                        <span>hour</span>
                    </div>


                    <label className="label">
                        <span className="label-text">Price(ICP/hour):</span>
                    </label>
                    <input type="text" className=" input-bordered  input w-full max-w-xs" name="price" value={state.price} onChange={handleChange} />

                    {
                        {

                            "PROGRESS": (<progress className="progress w-56"></progress>),
                            "ERROR_RESULT": (<div className="alert alert-error shadow-lg">
                                <div>
                                    <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current flex-shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                    <span>Listing NFT failed!</span>
                                </div>
                            </div>)
                        }[show]
                    }
                    <div className="modal-action justify-end">
                        <label htmlFor="listing-step" className="btn" disabled={show == "PROGRESS" ? "disabled" : ""}>Cancel</label>
                        <button className="btn" onClick={async () => { onSubmit() }} disabled={show == "PROGRESS" ? "disabled" : ""}>Next</button>
                        <div />
                    </div>
                </div>
            </div>
        </div>
    )
}
