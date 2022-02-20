import { useState, useEffect } from 'react'
import './App.css'
import backgroundVideo from "./assets/background.mp4";
import nftVideo from "./assets/nft.mp4";
import { ethers } from "ethers";
import abi from "./contracts/contract.json"
import { InProgress } from './components/InProgress';
import { Minting } from './components/Minting';
const CONTRACT_ADDRESS = "0x57cd010687515bC066c00abD518A4f245B24071D";

function App() {
  const [account, setAccount] = useState();
  const [provider, setProvider] = useState()
  const [contract, setContract] = useState();
  const [minted, setMinted] = useState();
  const [inProgress, setInProgress] = useState(true)
  const [mintingStart, setMintingStart] = useState(false)


  const connectWallet = async () => {
    const accounts = await provider.send("eth_requestAccounts", []);
    // const signer = provider.getSigner();
    setAccount(accounts[0]);
  }

  const startOver = async () => {
    setAccount(null);
  }

  const mint = async () => {
    let tx = await contract.mint(1, { value: 1000000000000000 });
    console.log("miting");
    console.log(tx.hash);
    await tx.wait(3).then((receipt)=>{
      console.log(receipt, "all good")
    }, (error) => {
      error.checkCall().then((error) => {
        console.log("Error", error);
      });
    });
  }

  useEffect(async ()=>{
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const accounts = await provider.listAccounts();
    const signer = provider.getSigner();
    const contractInstance = new ethers.Contract(CONTRACT_ADDRESS, abi, provider);
    // let totalSupplyHex = await contractInstance.totalSupply();
    // let totalSupply = totalSupplyHex.toNumber();

    if(accounts.length > 0){
      setAccount(accounts[0])
    }
    setProvider(provider);
    setContract(contractInstance)
    // setSupply(contractInstance.total)
    // setMinted(totalSupply);
  }, [])

  return (
    <div className="App">
      <video className='background-video' src={backgroundVideo} width="600" height="300" playsInline={true} muted={true} autoPlay={true} loop={true}/>
      <div className='main'>
        <div className='main-left-nft'>
          <video className='nft-video' src={nftVideo} width="400" height="400" playsInline={true} muted={true} autoPlay={true} loop={true}/>
        </div>
        <div className='main-right-minting'>
          { inProgress && <InProgress />}
          { mintingStart &&  
              <Minting 
                minted={minted} 
                mint={mint} 
                account={account}
                startOver={startOver} 
                connectWallet={connectWallet}  /> }
        </div>
      </div>
    </div>
  )
}

export default App
