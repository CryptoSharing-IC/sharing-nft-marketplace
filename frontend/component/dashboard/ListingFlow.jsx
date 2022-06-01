import React from 'react'
import FinishListingStep from './FinishListingStep';
import LengingStep from './LengingStep'
import MintStep from './MintStep';
import StakeStep from './StakeStep';

export default function ListingFlow (props) {
    let [currentStep, setCurrentStep] = React.useState(1);
    return (
        <>
            <input type="checkbox" id="listing-step" className="modal-toggle" />
            <div className="modal">
                <div className="modal-box">
                    {
                        {
                            1: <LengingStep nftData={props.nftData} setCurrentStep={setCurrentStep}></LengingStep>,
                            2: <StakeStep nftData={props.nftData} setCurrentStep={setCurrentStep}></StakeStep>,
                            3: <MintStep nftData={props.nftData} setCurrentStep={setCurrentStep}></MintStep>,
                            4: <FinishListingStep nftData={props.nftData}></FinishListingStep>
                        }[currentStep]
                    }
                </div>
            </div>

        </>
    )
}
