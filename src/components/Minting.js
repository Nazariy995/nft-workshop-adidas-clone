import React from 'react'

export const Minting = (props) => {
    console.log(props);
  return (
    <>
        <h2>Adidos: INTO THE METAVERSE</h2>
          <div className='description'>
                {props.minted ? 
                    `${props.minted} minted / 300` :
                    "Please connect wallet to start minting."
                }
        </div>
          <div className='actions'>
            {props.account ?
              <>
                <button className="filled-button" onClick={props.mint}>Mint</button>
                <button className="transparent-button" onClick={props.startOver}>Start Over</button>
              </>
              :
              <>
                <button className="filled-button" onClick={props.connectWallet}>Connect Wallet</button>
                <button className="transparent-button">Learn More</button>
              </>
            }
        </div>
    </>
  )
}
