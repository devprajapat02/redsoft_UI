import { useState, useEffect } from 'react';
import logo from './logo.svg';
import './App.css';
const { ethers } = require("ethers");
const abi = require('./abi.json');

function App() {

  // create object with account details
  const [meta, setMeta] = useState({
    address: "0x000",
    stakeAmount: "0",
    stakeTime: {},
    balance: "0"
  });

  const [errorLog, setErrorLog] = useState("Logs...");
  const [isLoading, setIsLoading] = useState(false);


  // const network = "http://127.0.0.1:7545"
  // const contractAddress = "0x44d517AfC88C7a53d20E17Ec4DD7586c948135DB"
  const network = "https://rpc-mumbai.maticvigil.com/"
  const contractAddress = "0x32e2F17ef39636432c22A2dFb41C734402D2db77"
  
  function getTimestamp(timestamp) {

    if (timestamp == 0) return {
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0
    }

    const currentTimestamp = Math.floor(Date.now() / 1000); // Current timestamp in seconds
    // const seconds = ethers.BigNumber.from(timestamp).sub(currentTimestamp);
    const seconds = ethers.BigNumber.from(currentTimestamp).sub(timestamp);
    const days = seconds.div(86400); // 1 day = 24 hours * 60 minutes * 60 seconds
    const hours = seconds.mod(86400).div(3600); // 1 hour = 60 minutes * 60 seconds
    const minutes = seconds.mod(3600).div(60); // 1 minute = 60 seconds
    const remainingSeconds = seconds.mod(60);
  
    return {
      days: days.toNumber(),
      hours: hours.toNumber(),
      minutes: minutes.toNumber(),
      seconds: remainingSeconds.toNumber()
    };
  }

  const fetchMeta = async (address) => {
    // connect to smart contract
    const provider = new ethers.providers.JsonRpcProvider(network);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(contractAddress, abi, provider);
    const stakeData = await contract.get_stake_data(address)
    
    const multiple = ethers.BigNumber.from('1000000000000000000')
    let stakeAmount = ethers.BigNumber.from(stakeData.amount)
    stakeAmount = stakeAmount.div(multiple)
    const balance = await contract.balanceOf(address)
    const stakeTime = getTimestamp(stakeData.stakeTime)

    const newMeta = {
      address: address,
      stakeAmount: stakeAmount.toString(),
      stakeTime: {...stakeTime},
      balance: balance.toString()
    }
    setMeta({
      ...meta,
      ...newMeta
    })
    console.log("meta", meta)
  }

  

  const handleConnectClick = async () => {
    setIsLoading(true);
    try {
      // Request access to the user's Ethereum account
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      console.log('Connected to MetaMask!');
      
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = await provider.getSigner();
      const accounts = await provider.listAccounts();
      console.log('Connected account:', accounts[0]);
      
      const network = await provider.getNetwork();
      console.log('Connected network:', network.chainId);
      
      await fetchMeta(accounts[0]);
          
    } catch (error) {
      setErrorLog("Error while connecting to metamask! Make sure you have metamask installed and are on the correct network.\nError Log: " + error.toString())
      console.error('Error connecting to MetaMask:', error);
    }
    setIsLoading(false);
  };

  const handleMintClick = async () => {
    setIsLoading(true);
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = await provider.getSigner(meta.address);
      const contract = new ethers.Contract(contractAddress, abi, provider);
      const signedContract = await contract.connect(signer);
      const tx = await signedContract.mint(5);
      await tx.wait();
      console.log(tx)
      const balance = await contract.balanceOf(meta.address);
      setMeta({
        ...meta,
        balance: balance.toString()
      })
      console.log("minted!", balance.toString())
    } catch (e) {
      setErrorLog("Error while minting! Make sure you have connected to metamask.\nError Log: " + e.toString())
      console.log(e)
    }
    setIsLoading(false);
  }

  const handleStakeClick = async () => {
    const stakeAmount = parseInt(document.getElementById('stakeAmount').value);
    if (isNaN(stakeAmount)) {
      setErrorLog("Error while staking! Make sure you have entered a valid amount.")
      return;
    }
    setIsLoading(true);
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = await provider.getSigner(meta.address);
      const contract = new ethers.Contract(contractAddress, abi, provider);
      const signedContract = await contract.connect(signer);
      const tx = await signedContract.stake(stakeAmount);
      await tx.wait();
      await fetchMeta(meta.address);
      console.log("Staked!")
    } catch (e) {
      setErrorLog("Error while staking! Make sure you have connected to metamask and have not staked already.\nError Log: " + e.toString())
      console.log(e)
    }
    setIsLoading(false);
  }

  const handleUnstakeClick = async () => {
    setIsLoading(true);
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = await provider.getSigner(meta.address);
      const contract = new ethers.Contract(contractAddress, abi, provider);
      const signedContract = await contract.connect(signer);
      const tx = await signedContract.unstake();
      await tx.wait();
      await fetchMeta(meta.address);
      console.log("Unstaked!")
    } catch (e) {
      setErrorLog("Error while unstaking! Make sure you have staked some amount.\nError Log: " + e.toString())
      console.log(e)
    }
    setIsLoading(false);
  }

  return (
    <div className="App" style={{height: "100%"}}>
      
      {isLoading? 
        (<div className='loading_screen'>
          Loading...
        </div>):
        (<div className='col' style={{height:"20%", width:"90%", marginLeft:"5%", marginTop:"5%"}}>
          <div className='row' style={{fontFamily: "Arial", fontSize: "50px", color: "white"}}>
            <div className='col-1'>
              <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRuqlZCMj6qYaIFylDiB-va9RyPA05ZTV39Rg&usqp=CAU" height="100px" style={{borderRadius: "100px"}} />
            </div>
            <div className='col-6 mt-3 mb-2' style={{marginLeft: "30px", backgroundColor: "rgb(30, 30, 30)", border: "1px solid grey", borderRadius: "50px"}}>
              {meta.balance}
            </div>
            <div className='col-2 d-flex flex-grow-1 mt-3' style={{marginLeft: "10px", fontWeight: "bolder"}}>
              CAT
            </div>
            <div className='col-1'>
              <button className='btn btn-primary mt-4' onClick={() => {handleConnectClick()}}>Connect Metamask</button>
            </div>

            <div className='col-1'>
              <button className='btn btn-success mt-4' onClick={() => handleMintClick()}>Mint 5 CAT</button>
            </div>
          </div>

          <div className='row mt-5' style={{width: "50%", backgroundColor: "black", height: "250px", marginLeft: "25%", color: "white", fontSize: "20px", border: "1px solid grey", borderRadius: "50px"}}>
            <div className='col'>
              <div className='row mt-5' style={{marginLeft: "10px"}}>
                Address: {meta.address}
              </div>
              <hr />
              <div className='row' style={{marginLeft: "10px"}}>
                Stake Amount: {meta.stakeAmount} CAT
              </div>
              <hr />
              <div className='row' style={{marginLeft: "0px"}}>
                <div className='col'>
                  Stake Time: {meta.stakeTime.days} days {meta.stakeTime.hours} hours {meta.stakeTime.minutes} minutes {meta.stakeTime.seconds} seconds
                </div>
                <div className='col-2'>
                  <button className='btn btn-dark' style={{width: "90%"}} onClick={() => {fetchMeta(meta.address)}}>Refresh</button>
                </div>
            </div>

            </div>
          </div>

          <div className='row mt-5'>
            <div className='col-3' style={{paddingLeft: "10%", }}>
              <button className='btn btn-warning' style={{width: "100%"}} onClick={() => {handleStakeClick()}}>Stake</button>
              {/* text area to input amount to be staked */}
              
            </div>
            <div className='col-1 text-light mt-1' style={{marginLeft: "30px"}}> Amount: </div>
            <div className='col-1'>
              <textarea
                id='stakeAmount'
                style={{
                  backgroundColor: '#292929',
                  color: '#ffffff',
                  borderTop: 'none',
                  borderLeft: 'none',
                  borderRight: 'none',
                  borderBottom: '1px solid #555555',
                  borderRadius: '0px',
                  padding: '8px',
                  width: '100%',
                }}
                rows={1}
              />
            </div>
            <div className='col-6' style={{paddingLeft: "20%", marginLeft: "85px"}}>
              <button className='btn btn-warning' style={{width: "50%"}} onClick={() => {handleUnstakeClick()}}>Unstake</button>
            </div>
          </div>

          <div className='row mt-5'>
            <div className='col-12' style={{width: "60%", marginLeft: "20%", color: "white", border: "1px solid grey"}}>
              {errorLog}
            </div>
          </div>
          
        </div>)}
    </div>
  );
}

export default App;
