import React from 'react'

export default function NftCard (props) {
    return (
        <>
            <div className="card w-96 bg-base-100 shadow-xl">
                <figure className="px-10 pt-10">
                    <img src={props.location} alt="img" className="rounded-xl" />
                </figure>
                <div className="card-body items-center text-center">
                    <h2 className="card-title">{props.name}</h2>
                    <p>{props.desc}</p>
                    <div className="card-actions">
                        <button href="#lenging" className="btn btn-primary">Lending</button>
                    </div>
                </div>
            </div>

            <div class="modal" id="lenging">
                <div class="modal-box">
                    <h3 class="font-bold text-lg">Congratulations random Interner user!</h3>
                    <p class="py-4">You've been selected for a chance to get one year of subscription to use Wikipedia for free!</p>
                    <div class="modal-action">
                        <a href="#" class="btn">Yay!</a>
                    </div>
                </div>
            </div>
        </>
    )
}
