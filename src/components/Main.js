import React, { Component } from 'react'
import BuyForm from './BuyForm'
import SellForm from './SellForm'

class Main extends Component {
  constructor(props) {
    super(props)
    this.state = {
        currentForm: 'buy'
    }
  }

  render() {
    let content

    if (this.state.currentForm === 'buy') {
      content = <BuyForm 
        ethBalance={this.props.ethBalance}
        cattoBalance={this.props.cattoBalance}
        buyCatto={this.props.buyCatto}
      />
    } else {
      content = <SellForm
        ethBalance={this.props.ethBalance}
        cattoBalance={this.props.cattoBalance}
        sellCatto={this.props.sellCatto}
      />
    }

    return (
      <div id="content" className="mt-3">
        
        <div className="d-flex justify-content-between mb-3">
          <button 
            className="btn btn-light"
            onClick={(event) => {
              this.setState({ currentForm: 'buy' })
            }}  
          >
            Buy
          </button>
          <span className="text-muted">&lt; &nbsp; &gt;</span>
          <button 
            className="btn btn-light"
            onClick={(event) => {
              this.setState({ currentForm: 'sell' })
            }}  
          >
            Sell
          </button>
        </div>

        <div className="card mb-4" >

        <div className="card-body">

          { content }

        </div>

        </div>

      </div>
    );
  }
}

export default Main;
