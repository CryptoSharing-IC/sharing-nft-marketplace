import React from 'react'
import Dip721Card from './Dip721Card'
import AppContext from "../../AppContext"

export default function Dip721IdleCardList () {
    const { userPrincipal } = React.useContext(AppContext)
    const [nfts, setNfts] = React.useState([])

    return (
        <div className="flex flex-row flex-wrap">
            {
                idleNfts.map((e, index) => (<Dip721Card key={index} location={e.location}></Dip721Card>))
            }
        </div>
    )
}
