/* eslint-disable react/prop-types */
import React from 'react'
import FinishListingStep from './FinishListingStep';
import MintStep from './MintStep';
import StakeStep from './StakeStep';
import LendingStep from './LendingStep';

export default function ListingFlow (props) {

    let [currentStep, setCurrentStep] = React.useState(1);
    let [listId, setListId] = React.useState(-1); //init a invalid number
    let nextStep = () => {
        setCurrentStep(currentStep++ % 4 + 1)
    }
    return (
        <>
            <input type="checkbox" id="listing-step" className="modal-toggle" />
            <div className="modal">
                <div className="modal-box">
                    {
                        {
                            1: <LendingStep nftData={props.nftData} nextStep={nextStep} listId={listId} setListId={setListId}></LendingStep>,
                            2: <StakeStep nftData={props.nftData} nextStep={nextStep} listId={listId} setListId={setListId}></StakeStep>,
                            3: <MintStep nftData={props.nftData} nextStep={nextStep} listId={listId} setListId={setListId}></MintStep>,
                            4: <FinishListingStep nftData={props.nftData} nextStep={nextStep} listId={listId} setListId={setListId}></FinishListingStep>
                        }[currentStep]
                    }
                </div>
            </div>

        </>
    )
}


