import React from 'react'
import { AppContext } from "../App"
import canisterIds from "../../canister_ids.json"
import { error } from 'daisyui/src/colors';


export default function PayStep (props) {
    const { initMarketplace } = React.useContext(AppContext);
    let [show, setShow] = React.useState("");
    let [error, setError] = React.useState(null);

    let amount = + props.lend["amount"].toString() / 100000000;


    async function onSubmit () {
        //点击下一步 先提示本次操作的结果, 如果成功就进入下一步

        console.log("lend is: " + JSON.stringify(props.lend))
        setShow("PROGRESS");
        let marketplace = await initMarketplace();

        let payArg = {
            to: Buffer.from(props.lend.accountIdentifier).toString("hex"),
            amount: +props.lend.amount.toString(),
            memo: props.lend.id + ""
        }
        try {
            console.log("pay args is: " + JSON.stringify(payArg))
            const payResult = await window.ic.plug.requestTransfer(payArg);
            console.log("pay result is " + JSON.stringify(payResult));
            props.setHeight(payResult["height"]);
            props.nextStep();

        } catch (error) {
            console.log("error message is: " + error.message)
            setError(error.message + 'you can click Pay button to retry.')
            setShow("ERROR_RESULT")
        }
    }
    return (
        <div className='flex flex-col'>
            <ul className="steps justify-center">
                <li className="step step-primary" >Lending Info</li>
                <li className="step step-primary">Pay</li>
                <li className="step">Mint</li>
                <li className="step">Finished</li>
            </ul>
            <div className="card card-side bg-base-50 ">
                <div className="card-body">

                    <h2 className="card-title">Pay icp?</h2>
                    <p>total icp amount is: {amount}</p>
                    {
                        {

                            "PROGRESS": (<progress className="progress w-56"></progress>),
                            "ERROR_RESULT": (<div className="alert alert-error shadow-lg">
                                <div>
                                    <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current flex-shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                    <span>{error}</span>
                                </div>
                            </div>)
                        }[show]
                    }
                    <div className="modal-action justify-end">
                        <label htmlFor="rent-step" className="btn" disabled={show == "PROGRESS" ? "disabled" : ""}>cancel</label>
                        <button className="btn" onClick={async () => { onSubmit() }} disabled={show == "PROGRESS" ? "disabled" : ""}>Pay</button>
                        <div />
                    </div>
                </div>
            </div>
        </div>
    )
}
