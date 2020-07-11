import Web3 from "web3";

async function loadWeb3() {
  if (window.ethereum) {
    // this is the new way clients like Metamask Expose their provider
    window.web3 = new Web3(window.ethereum);
    await window.ethereum.enable();
  } else if (window.web3) {
    // this is for legacy dapp browsers
    window.web3 = new Web3(window.web3.currentProvider);
  } else {
    window.alert(
      "Non-Ethereum browser detected. You should consider trying MetaMask!"
    );
  }
}

export { loadWeb3 };
