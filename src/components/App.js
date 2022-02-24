import React, { Component } from 'react'
import Web3 from 'web3'
import CattoToken from '../abis/CattoToken.json'
import EthSwap from '../abis/EthSwap.json'
import Navbar from './Navbar'
import Main from './Main'
import './App.css'

class App extends Component {

  async componentWillMount() {
    await this.loadWeb3()
    await this.loadBlockchainData()
  }

  async loadBlockchainData() {
    const web3 = window.web3

    // Get user MetaMask address
    const accounts = await web3.eth.getAccounts()
    this.setState({ account: accounts[0] })

    // Get user Ether balance
    const ethBalance = await web3.eth.getBalance(this.state.account)
    this.setState({ ethBalance: ethBalance })

    // Load CattoToken
    const networkId = await web3.eth.net.getId()
    const cattoData = CattoToken.networks[networkId]
    if (cattoData) { 
      const cattoToken = new web3.eth.Contract(CattoToken.abi, cattoData.address)
      this.setState({ cattoToken : cattoToken })
      let cattoBalance = await cattoToken.methods.balanceOf(this.state.account).call()
      this.setState({ cattoBalance : cattoBalance.toString() })
    } else {
      window.alert('Token contract not deployed to detected network.')
    }

    // Load EthSwap
    const ethSwapData = EthSwap.networks[networkId]
    if (ethSwapData) { 
      const ethSwap = new web3.eth.Contract(EthSwap.abi, ethSwapData.address)
      this.setState({ ethSwap : ethSwap })
      console.log("ethSwap: ", ethSwap)
    } else {
      window.alert('EthSwap contract not deployed to detected network.')
    }

    this.setState({ loading : false })
  }

  // Connect to browser Wallet
  async loadWeb3() {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum)
      await window.ethereum.enable()
    }
    else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider)
    }
    else {
      window.alert('Non-Ethereum browser detected.')
    }
  }

  buyCatto = (etherAmount) => {
    this.setState({ loading: true })
    this.state.ethSwap.methods.buyCatto().send({ value: etherAmount, from: this.state.account }).on('confirmation', (confirmation, receipt) => {
      this.setState({ loading: false })
      window.location.reload(true)
    })
  }

  sellCatto = (cattoAmount) => {
    this.setState({ loading: true })
    this.state.cattoToken.methods.approve(this.state.ethSwap.address, cattoAmount).send({ from: this.state.account }).on('transactionHash', (hash) => {
      this.state.ethSwap.methods.sellCatto(cattoAmount).send({ from: this.state.account }).on('confirmation', (confirmation, receipt) => {
        this.setState({ loading: false })
        window.location.reload(true)
      })
    })
  }

  constructor(props) {
    super(props)
    this.state = {
      account: '',
      cattoToken: {},
      ethSwap: {},
      cattoBalance: '0',
      ethBalance: '0',
      loading: true
    }
  }

  render() {
    let content

    if (this.state.loading) {
      content = <p id="loader" className="text-center">Loading...</p>
    } else {
      content = <Main
        ethBalance={this.state.ethBalance}
        cattoBalance={this.state.cattoBalance}
        buyCatto={this.buyCatto}
        sellCatto={this.sellCatto}
      />
    }
    return (
      <div>
        <Navbar account={this.state.account} />
        <div className="container-fluid mt-5">
          <div className="row">
            <main role="main" className="col-lg-12 ml-auto mr-auto" style={{ maxWidth: '600px'}}>
              <div className="content mr-auto ml-auto">
                <a
                  href="#"
                  rel="noopener noreferrer"
                >
                </a>
                { content }
              </div>
            </main>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
