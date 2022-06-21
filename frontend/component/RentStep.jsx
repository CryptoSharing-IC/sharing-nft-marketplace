import React from 'react'
import { AppContext } from "../App"
import canisterIds from "../../canister_ids.json"
import DatePicker from "react-datepicker";


export default function LendingStep (props) {
    const { initMarketplace } = React.useContext(AppContext);

    let [state, setState] = React.useState(
        {
            start: "",
            end: ""
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

        console.log("canisters ids is: " + JSON.stringify(canisterIds))


        if (!state.start || !state.end) {
            //temp code, 
            alert("输入不合法!");
            return
        }
        setShow("PROGRESS");


        let preLendArg = {
            listingId: props.listing.id,
            start: Date.parse(state.start) / 1000,
            end: Date.parse(state.end) / 1000
        }

        let marketplace = await initMarketplace();
        console.log("preLend nft start")
        let reponse = await marketplace.preLendNFT(preLendArg)
        // check the result 
        console.log("preLend result is: " + JSON.stringify(reponse))

        if (reponse?.Ok) {
            props.setLend(reponse.Ok);
            props.nextStep();
        } else {
            setShow("ERROR_RESULT")
        }

    }
    return (
        <div className='flex flex-col'>
            <ul className="steps justify-center">
                <li className="step step-primary" >Lending Info</li>
                <li className="step">Pay</li>
                <li className="step">Mint</li>
                <li className="step">Finished</li>
            </ul>
            <div className="card card-side bg-base-50 ">
                <figure className="grow "><img src={props.listing.web} alt="img" /></figure>
                <div className="card-body">
                    <h2 className="card-title">{props.listing.name}</h2>
                    <p>{props.listing.desc}</p>
                    <label className="label">
                        <span className="label-text">Rent start time: </span>
                    </label>

                    {/* <DatePicker selected={new Date()} showTimeSelect timeIntervals={60} onChange={(start) => { setState(preState => ({ ...preState, start })) }} ></DatePicker> */}
                    <input type="datetime-local" className=" input-bordered  input w-full max-w-xs" name="start" value={state.start} onChange={handleChange} />

                    <label className="label">
                        <span className="label-text">Rent end time: </span>
                    </label>
                    {/* <DatePicker name="end" showTimeSelect timeIntervals={60} onChange={(end) => { setState(preState => ({ ...preState, end })) }} ></DatePicker> */}
                    <input type="datetime-local" className=" input-bordered  input w-full max-w-xs" name="end" value={state.end} onChange={handleChange} />

                    <label className="label">
                        <span className="label-text">Total cost: {(state.start && state.end) ? ((Date.parse(state.end) - (Date.parse(state.start))) / 1000 / 3600 * props.listing.price.decimals.toString() / 100000000) : "- -" + "icp"}</span>
                    </label>
                    {
                        {

                            "PROGRESS": (<progress className="progress w-56"></progress>),
                            "ERROR_RESULT": (<div className="alert alert-error shadow-lg">
                                <div>
                                    <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current flex-shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                    <span>Renting NFT failed!</span>
                                </div>
                            </div>)
                        }[show]
                    }
                    <div className="modal-action justify-end">
                        <label htmlFor="rent-step" className="btn" disabled={show == "PROGRESS" ? "disabled" : ""}>Cancel</label>
                        <button className="btn" onClick={async () => { onSubmit() }} disabled={show == "PROGRESS" ? "disabled" : ""}>Next</button>
                        <div />
                    </div>
                </div>
            </div>
        </div>
    )
}
