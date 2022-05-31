import React, { useState } from 'react'
import { marketplace } from "canisters/marketplace"
import { useForm } from "react-hook-form";


export default function LengingStep (props) {
    const { register, errors, handleSubmit } = useForm()

    let [state, setState] = React.useState(
        {
            availableUtil: "",
            minPeriod: "",
            maxPeriod: "",
            price: ""
        }
    )
    let [showProcess, setShowProcess] = useState(false);

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
        let dip721CanisteId = "rrkah-fqaaa-aaaaa-aaaaq-cai"
        if (!state.availableUtil || !state.minPeriod || !state.price) {
            //temp code, 
            alert("输入不合法!");
            return
        }
        setShowProcess(true);
        let reponse = await marketplace.preListingNFT({
            canisterId: dip721CanisteId,
            nftId: state.nftData.id,
            name: state.nftData.name,
            desc: state.nftData.desc,
            availableUtil: state.availableUtil,
            price: state.price,
            minPeriod: state.minPeriod,
            metadata: props.nftData
        })
        // check the result 
        console.log(reponse)
        props.setCurrentStep(2)
    }
    return (
        <form>
            <ul className="steps">
                <li className="step step-primary" >Listing</li>
                <li className="step">Staking</li>
                <li className="step">Mint</li>
                <li className="step">Finished</li>
            </ul>
            <div className="card card-side bg-base-100">
                <figure><img src={props.nftData.metadata[0].location.Web} alt="img" /></figure>
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
                        <span>天</span>
                    </div>


                    <label className="label">
                        <span className="label-text">Price(ICP/day):</span>
                    </label>
                    <input type="text" className=" input-bordered  input w-full max-w-xs" name="price" value={state.price} onChange={handleChange} />
                    {showProcess ? (<progress className="progress w-56"></progress>) :
                        (<div className="modal-action justify-end">
                            <label htmlFor="listing-step" className="btn">取消</label>
                            <button className="btn" onClick={async () => { onSubmit() }}>下一步</button>
                        </div>)}
                </div>
            </div>
        </form>
    )
}
