import React from 'react'
import ReactLoading from "react-loading"

export const InProgress = (props) => {
  return (
    <>
        <h2>TRANSACTION IN PROGRESS</h2>
        <div className='description'>Your NFT is being minted. Please wait.</div>
        <ReactLoading type={"bubbles"} color={"#fff"} height={30} />
        <div className='actions'>
            <button onClick={props.checkEtherscan} className="filled-button">Check Etherscan</button>
        </div>
    </>
  )
}
