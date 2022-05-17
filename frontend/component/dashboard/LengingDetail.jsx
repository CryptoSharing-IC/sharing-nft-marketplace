import React from 'react'

export default function LengingDetail (props) {

    let [state, setState] = React.useState(
        {
            nftData: props.nftData,
            available: "",
            period: "",
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
    return (
        <div className="modal" id="lenging">
            <div className="modal-box w-full max-w-4xl">

                <div className="card card-side bg-base-100">
                    <figure><img src={props.nftData.location} alt="img" /></figure>
                    <div className="card-body">
                        <h2 className="card-title">{props.nftData.name}</h2>
                        <p>{props.nftData.desc}</p>
                        <input type="text" placeholder="available util:" class=" input-bordered  input w-full max-w-xs" name="available" value={state.available} />
                        <input type="text" placeholder="lend period: " class=" input-bordered  input w-full max-w-xs" name="period" value={state.period} />
                        <input type="text" placeholder="price:" class=" input-bordered  input w-full max-w-xs" name="price" value={state.price} />
                        <div className="modal-action justify-end">
                            <a href="#" className="btn">取消</a>
                            <a href="#" className="btn">确定</a>
                        </div>
                    </div>
                </div>


            </div>
        </div>
    )
}
