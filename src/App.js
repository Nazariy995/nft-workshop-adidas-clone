import { useState, useEffect } from 'react'
import './App.css'
import backgroundVideo from "./assets/background.mp4";
import nftVideo from "./assets/nft.mp4";
import { ethers } from "ethers";
import abi from "./contracts/contract.json"
import { InProgress } from './components/InProgress';
import { Minting } from './components/Minting';
const CONTRACT_ADDRESS = "0xc917b9Bfc19AD91DD7F1BeaCfB9C9D756947ceAb";

function App() {
  const [account, setAccount] = useState();
  const [provider, setProvider] = useState()
  const [contract, setContract] = useState();
  const [minted, setMinted] = useState();
  const [inProgress, setInProgress] = useState(false)
  const [mintingStart, setMintingStart] = useState(true)
  const [hash, setHash ] = useState();


  const connectWallet = async () => {
    const accounts = await provider.send("eth_requestAccounts", []);
    // const signer = provider.getSigner();
    setAccount(accounts[0]);
  }

  const startOver = async () => {
    setAccount(null);
  }

  const checkEtherscan = () => {
    const url = `https://rinkeby.etherscan.io/tx/${hash}`;
    window.open(url, '_blank');
  }

  const mint = async () => {
    // const signer = provider.getSigner();
    // console.log(signer);
    // contract.connect(signer);
    let tx = await contract.mint(1);
    console.log("miting");
    setHash(tx.hash);
    setInProgress(true);
    setMintingStart(false);
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
    const contractInstance = new ethers.Contract(CONTRACT_ADDRESS, abi, signer);
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
          { inProgress && 
            <InProgress 
              checkEtherscan={checkEtherscan}
            />}
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
