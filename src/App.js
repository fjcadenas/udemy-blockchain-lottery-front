import React, { useEffect, useState } from "react";
import logo from "./logo.svg";
import "./App.css";

import { loadWeb3 } from "./web3Utils";
import { address, abi } from "./lottery";

function App() {
  const [web3, setWeb3] = useState(null);
  const [accounts, setAccounts] = useState(null);
  const [contract, setContract] = useState(null);
  const [lottery, setLottery] = useState(null);
  const [value, setValue] = useState(0);
  const [message, setMessage] = useState(null);
  const [winner, setWinner] = useState(null);

  useEffect(() => {
    const prepareBlockchain = async () => {
      await loadWeb3();
      setWeb3(window.web3);
    };
    prepareBlockchain();
  }, []);

  useEffect(() => {
    const getAccounts = async () => {
      const accounts = await web3.eth.getAccounts();
      setAccounts(accounts);
    };
    if (web3) {
      getAccounts();
      const contract = new web3.eth.Contract(abi, address);
      setContract(contract);
    }
  }, [web3]);

  useEffect(() => {
    const getLotteryProperties = async () => {
      // No need to specify from at call() because we are using MetaMask
      const manager = await contract.methods.manager().call();
      const players = await contract.methods.getPlayers().call();
      const balance = await web3.eth.getBalance(contract.options.address);
      setLottery({ manager, players, balance });
    };
    if (contract) getLotteryProperties();
  }, [contract, web3]);

  const onSubmit = async (event) => {
    event.preventDefault();
    setMessage("Waiting on transaction success...");
    await contract.methods.enter().send({
      from: accounts[0],
      value: web3.utils.toWei(`${value}`, "ether"),
    });
    setMessage("You have entered!");
  };

  const onClick = async (event) => {
    setWinner("Waiting for transaction success...");
    await contract.methods.pickWinner().send({
      from: accounts[0],
    });
    setWinner("A winner has been picked!");
  };

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          <code>Lottery Contract</code>
        </p>
      </header>
      <div className="App-body">
        {web3 === null && <p>Waiting to initialize Blockchain...</p>}
        {web3 !== null && lottery ? (
          <>
            <div>
              This contract is managed by <b>{lottery.manager}</b>
            </div>
            <div>
              <p>
                There are currently <b>{lottery.players.length} players </b>{" "}
                competing to win a total of{" "}
                <b>{web3.utils.fromWei(lottery.balance, "ether")}</b>
                <b>Ether!</b>
              </p>
            </div>
            <hr style={{ width: "80%" }} />
            <div>
              <form onSubmit={onSubmit}>
                <h4> Try luck!</h4>
                <div>
                  <label> Amount fo ether to enter: </label>
                  <input
                    value={value}
                    type="number"
                    onChange={(event) => setValue(event.target.value)}
                  />
                </div>
                <button>Enter</button>
              </form>
              {message && <h1>{message}</h1>}
            </div>
            <hr style={{ width: "80%" }} />
            <div>
              <div>
                <h4>Ready to pick a winner?</h4>
                <button onClick={onClick}>Pick Winner!</button>
              </div>
              {winner && <h1>{winner}</h1>}
            </div>
            <div></div>
          </>
        ) : (
          <p>Loading contract...</p>
        )}
      </div>
    </div>
  );
}

export default App;
