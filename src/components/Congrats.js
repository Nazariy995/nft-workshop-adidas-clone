import React from 'react'

export const Congrats = (props) => {
  return (
    <>
        <h2>CONGRATULATIONS</h2>
        <div>All set! Your transaction is confirmed and you NFT has been minted. It will appear in you wallet shortly.</div>
        <div className='description'>You minted 1 NFT</div>
        <div className='actions'>
            <button onClick={props.checkEtherscan} className="filled-button">Check Etherscan</button>
        </div>
    </>
  )
}
