import React from 'react'
import FinishListingStep from './FinishListingStep';
import LengingStep from './LengingStep'
import MintStep from './MintStep';
import StakeStep from './StakeStep';

export default function ListingFlow (props) {
    let [currentStep, setCurrentStep] = React.useState(1);
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
                            1: <LengingStep nftData={props.nftData} nextStep={nextStep}></LengingStep>,
                            2: <StakeStep nftData={props.nftData} nextStep={nextStep}></StakeStep>,
                            3: <MintStep nftData={props.nftData} nextStep={nextStep}></MintStep>,
                            4: <FinishListingStep nftData={props.nftData} nextStep={nextStep}></FinishListingStep>
                        }[currentStep]
                    }
                </div>
            </div>

        </>
    )
}
