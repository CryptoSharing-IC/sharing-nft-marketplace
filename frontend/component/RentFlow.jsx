/* eslint-disable react/prop-types */
import React from 'react'
import RentStep from "./RentStep"
import PayStep from './PayStep';
import MintUseNftStep from './MintUseNftStep';
import FinishRentStep from './FinishRentStep';

export default function RentFlow (props) {
    let [lend, setLend] = React.useState(null);
    let [currentStep, setCurrentStep] = React.useState(1);
    let [listId, setListId] = React.useState(-1); //init a invalid number
    let [height, setHeight] = React.useState(null);
    let nextStep = () => {
        setCurrentStep(currentStep++ % 4 + 1)
    }
    return (
        <>
            <input type="checkbox" id="rent-step" className="modal-toggle" />
            <div className="modal">
                <div className="modal-box">
                    {
                        {
                            1: <RentStep listing={props.listing} lend={lend} setLend={setLend} nextStep={nextStep}></RentStep>,
                            2: <PayStep listing={props.listing} lend={lend} setLend={setLend} height={height} setHeight={setHeight} nextStep={nextStep}></PayStep>,
                            3: <MintUseNftStep listing={props.listing} lend={lend} setLend={setLend} height={height} nextStep={nextStep}></MintUseNftStep>,
                            4: <FinishRentStep listing={props.listing} lend={lend} setLend={setLend} nextStep={nextStep}></FinishRentStep>
                        }[currentStep]
                    }
                </div>
            </div>

        </>
    )
}


