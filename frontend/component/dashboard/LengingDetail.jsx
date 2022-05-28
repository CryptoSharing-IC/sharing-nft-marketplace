import React from 'react'
import DatePicker from "react-datepicker";
import { marketplace } from "canisters/marketplace"
import { useForm } from "react-hook-form";


export default function LengingDetail (props) {
    const { register, errors, handleSubmit } = useForm()

    let [state, setState] = React.useState(
        {
            nftData: props.nftData,
            availableUtil: "",
            minPeriod: "",
            maxPeriod: "",
            price: ""
        }
    )
    const handleChange = e => {
        setState({
            ...state,
            [e.target.name]: e.target.value
        }
        )
    }

    async function onSubmit () {
        //TODO, add validater code
        let dip721CanisteId = "rrkah-fqaaa-aaaaa-aaaaq-cai"
        if (!state.availableUtil || !state.minPeriod || !state.price) {

            return
        }

        let reponse = await marketplace.listingNFT({
            canisterId: dip721CanisteId,
            nftId: state.nftData.id,
            name: state.nftData.name,
            availableUtil: state.availableUtil,
            minPeriod: state.minPeriod,
            price: state.price,
        })
        alert(reponse)
    }
    return (
        <form>
            <input type="checkbox" id="lending-modal" className="modal-toggle" />
            <div className="modal">

                <div className="modal-box w-full max-w-4xl">

                    <div className="card card-side bg-base-100">
                        <figure><img src={props.nftData.location} alt="img" /></figure>
                        <div className="card-body">
                            <h2 className="card-title">{props.nftData.name}</h2>
                            <p>{props.nftData.desc}</p>
                            <label className="label">
                                <span className="label-text">Available util:</span>
                            </label>
                            <input type="datetime-local" className=" input-bordered  input w-full max-w-xs" name="availableUtil" value={state.availableUtil} onChange={handleChange} {...register("availableUtil", { required: true })} />
                            {errors.availableUtil && (<div>最长有效期不合法!</div>)}
                            <label className="label">
                                <span className="label-text">lend period(day):</span>
                            </label>
                            <div className='flex flex-row items-center'>
                                <input type="number" className=" input-bordered  input w-20 max-w-xs" name="minPeriod" value={state.minPeriod} onChange={handleChange}  {...register("minPeriod", { required: true })} />
                                <span>天</span>
                            </div>
                            {errors.minPeriod && (<div>最小租赁周期输入不合法!</div>)}

                            <label className="label">
                                <span className="label-text">Price(ICP/day):</span>
                            </label>
                            <input type="text" className=" input-bordered  input w-full max-w-xs" name="price" value={state.price} onChange={handleChange} {...register("price", { pattern: /^\d+\.\d{0,4}$/g })} />
                            {errors.price && (<div>价格输入不合法!</div>)}
                            <div className="modal-action justify-end">
                                <label htmlFor="lending-modal" className="btn">取消</label>
                                <label htmlFor="lending-modal" className="btn" onClick={() => handleSubmit(onSubmit)}>确定</label>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </form>
    )
}
