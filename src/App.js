import { useState, useEffect } from 'react'
import './App.css'
import backgroundVideo from "./assets/background.mp4";
import nftVideo from "./assets/nft.mp4";
import { ethers } from "ethers";
import abi from "./contracts/contract.json"
import { InProgress } from './components/InProgress';
import { Minting } from './components/Minting';
import { Congrats } from './components/Congrats';
import { useMoralis } from "react-moralis";
const CONTRACT_ADDRESS = "0xc917b9Bfc19AD91DD7F1BeaCfB9C9D756947ceAb";

function App() {
  const { authenticate, isAuthenticated, enableWeb3, user, logout, Moralis } = useMoralis();
  const [minted, setMinted] = useState();
  const [inProgress, setInProgress] = useState(false)
  const [mintingStart, setMintingStart] = useState(true)
  const [congratsState, setCongratsState] = useState(false)
  const [hash, setHash ] = useState();

  const checkEtherscan = () => {
    if(!hash) return;
    const url = `https://rinkeby.etherscan.io/tx/${hash}`;
    window.open(url, '_blank');
  }

  const mint = async () => {
    const tx = await Moralis.executeFunction({
      contractAddress: CONTRACT_ADDRESS,
      functionName: "mint",
      abi: abi,
      params: {
        amount: 1
      }
    });
    console.log("miting");
    setHash(tx.hash);
    setInProgress(true);
    setMintingStart(false);
    await tx.wait(3).then((receipt)=>{
      setInProgress(false);
      setCongratsState(true)
    }, (error) => {
      error.checkCall().then((error) => {
        console.log("Error", error);
      });
    });
  }

  useEffect(async ()=>{
    if(isAuthenticated){
      const web3Provider = await enableWeb3();
      const contractInstance = new ethers.Contract(CONTRACT_ADDRESS, abi, web3Provider);
      let totalSupplyHex = await contractInstance.totalSupply(0);
      let totalSupply = totalSupplyHex.toNumber();
      setMinted(totalSupply);
    }
  }, [user, isAuthenticated])

  return (
    <div className="App">
      <video className='background-video' src={backgroundVideo} width="600" height="300" playsInline={true} muted={true} autoPlay={true} loop={true}/>
      <div className='main'>
        <div className='main-left-nft'>
          <video className='nft-video' src={nftVideo} width="400" height="400" playsInline={true} muted={true} autoPlay={true} loop={true}/>
        </div>
        <div className='main-right-minting'>
          { inProgress && 
            <InProgress 
              checkEtherscan={checkEtherscan}
            />}
          { mintingStart &&  
              <Minting 
                minted={minted} 
                mint={mint} 
                account={user}
                startOver={logout} 
                connectWallet={authenticate}  /> }
          { congratsState && 
              <Congrats 
                checkEtherscan={checkEtherscan}
              />}
        </div>
        <div className='info'>MINTING NOW</div>
      </div>
    </div>
  )
}

export default App
