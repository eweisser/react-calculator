class App extends React.Component {
  sendSymbolToDisplay(symbol) {
    this.answerDisplay.receiveSymbol(symbol);
  }
  evaluateDisplay() {
    this.answerDisplay.evaluateDisplay();
  }
  backspaceDisplay() {
    this.answerDisplay.backspaceDisplay();
  }
  clearDisplay() {
    this.answerDisplay.clearDisplay();
  }
  
  render() {
    return (
      <div id="bigGrid">
        <AnswerDisplay ref={answerDisplay => this.answerDisplay = answerDisplay}/>
        
        <div id="keyPad">
          <Button symbol="(" gridclass="kpCol1" colorGroup="medGray" onClick={() => this.sendSymbolToDisplay("(")} />
          <Button symbol=")" gridclass="kpCol2" colorGroup="medGray" onClick={() => this.sendSymbolToDisplay(")")} />
          <Button symbol="^" gridclass="kpCol3" colorGroup="medGray" onClick={() => this.sendSymbolToDisplay("^")} />
          <Button symbol="√" gridclass="kpCol4" colorGroup="medGray" onClick={() => this.sendSymbolToDisplay("√")} />
          <Button symbol="" gridclass="kpCol5" colorGroup="medGray" />

          <Button symbol="7" gridclass="kpCol1" colorGroup="offWhite" onClick={() => this.sendSymbolToDisplay("7")} />
          <Button symbol="8" gridclass="kpCol2" colorGroup="offWhite" onClick={() => this.sendSymbolToDisplay("8")} />
          <Button symbol="9" gridclass="kpCol3" colorGroup="offWhite" onClick={() => this.sendSymbolToDisplay("9")} />
          
          <Button symbol="÷" gridclass="kpCol4" colorGroup="ltGray" onClick={() => this.sendSymbolToDisplay("/")} />
          <Button symbol="Cl." gridclass="kpCol5" cssId="clearButton" onClick={() => this.clearDisplay()} />
          
          <Button symbol="4" gridclass="kpCol1" colorGroup="offWhite" onClick={() => this.sendSymbolToDisplay("4")} />
          <Button symbol="5" gridclass="kpCol2" colorGroup="offWhite" onClick={() => this.sendSymbolToDisplay("5")} />
          <Button symbol="6" gridclass="kpCol3" colorGroup="offWhite" onClick={() => this.sendSymbolToDisplay("6")} />
          <Button symbol="*" gridclass="kpCol4" colorGroup="ltGray" onClick={() => this.sendSymbolToDisplay("*")} />
          
          <Button symbol="1" gridclass="kpCol1" colorGroup="offWhite" onClick={() => this.sendSymbolToDisplay("1")} />
          <Button symbol="2" gridclass="kpCol2" colorGroup="offWhite" onClick={() => this.sendSymbolToDisplay("2")} />
          <Button symbol="3" gridclass="kpCol3" colorGroup="offWhite" onClick={() => this.sendSymbolToDisplay("3")} />
          <Button symbol="–" gridclass="kpCol4" colorGroup="ltGray" onClick={() => this.sendSymbolToDisplay("-")} />
          <Button symbol="=" gridclass="kpCol5" cssId="equalsButton" onClick={() => this.evaluateDisplay()} />
          
          <Button symbol="0" gridclass="kpCol1" colorGroup="offWhite" onClick={() => this.sendSymbolToDisplay("0")} />
          <Button symbol="." gridclass="kpCol2" colorGroup="medGray" onClick={() => this.sendSymbolToDisplay(".")} />
          <Button symbol="←" gridclass="kpCol3" colorGroup="medGray" onClick={() => this.backspaceDisplay()} />
          <Button symbol="+" gridclass="kpCol4" colorGroup="ltGray" onClick={() => this.sendSymbolToDisplay("+")} />
          
        </div>
      </div>
    );
  }
}

class AnswerDisplay extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      displayedExpression: "0"
    };
  }
  
  receiveSymbol(newSymbol) {
    var current = this.state.displayedExpression;
    if (current==="0" && !".+*/^√".includes(newSymbol)) {
      this.setState({       // replace 0 with the new symbol
        displayedExpression: newSymbol
      });
    } else if (/(\+|\*|\/|\^|√|\-|\()$/.test(current) && "+*/^√)".includes(newSymbol)) {
          // do nothing--invalid input sequence e.g. ++, +), -+, -), (+, ()
    } else if (/(\)|\.)$/.test(current) && newSymbol===".") {
          // do nothing--invalid input sequence: ). or ..
    } else if (current.slice(-1)===")" && /\d/.test(newSymbol)) {
          // do nothing--invalid input sequence: e.g. )3
    } else if (/(\d|\)|\.)$/.test(current) && newSymbol==="(") {
       this.setState({        // special cases assuming the user intends multiplication
        displayedExpression: current + "*("
      });     
    } else {
      this.setState({       // append the new symbol
      displayedExpression: current + newSymbol
    });
    }
  }
  
  evaluateDisplay() {
    var current = this.state.displayedExpression;
    // first loop necessitated by parentheses--when has the expression reached its final simplified form? ! Note: this leads to infinite loops with bad user input
    while (/(\+|(?<!^)\-|\*|\/|\^|√|\(|\))/.test(current)) {
      current = current.replace(/\+\-/g,"-");
      current = current.replace(/\-\-/g,"+");
      while (/\d+\.?\d*(\^|√)\d+\.?\d*/.test(current)) {    // handle exponents, roots
        var searchExpRad = /\d+\.?\d*(\^|√)\d+\.?\d*/.exec(current);
        var thisEval = searchExpRad[0].split(searchExpRad[1])
        if (searchExpRad[1]==="^") {
          thisEval = Math.pow(parseFloat(thisEval[0]),parseFloat(thisEval[1]));
        } else {
          thisEval = Math.pow(parseFloat(thisEval[0]),1/parseFloat(thisEval[1]));
        }
        current = current.replace(searchExpRad[0],thisEval.toString());
      }
      while (/\d+\.?\d*(\*|\/)\d+\.?\d*/.test(current)) {   // handle multiplication, division
        console.log(current);
        var searchExpRad = /\d+\.?\d*(\*|\/)\d+\.?\d*/.exec(current);
        var thisEval = searchExpRad[0].split(searchExpRad[1])
        if (searchExpRad[1]==="*") {
          thisEval = parseFloat(thisEval[0]) * parseFloat(thisEval[1]);
        } else {
          thisEval = parseFloat(thisEval[0]) / parseFloat(thisEval[1]);
        }
        current = current.replace(searchExpRad[0],thisEval.toString());
      }
      while (/\d+\.?\d*(\+|\-)\d+\.?\d*/.test(current)) {       // handle addition, subtraction
        var searchExpRad = /\d+\.?\d*(\+|\-)\d+\.?\d*/.exec(current);
        var thisEval = searchExpRad[0].split(searchExpRad[1])
        if (searchExpRad[1]==="+") {
          thisEval = parseFloat(thisEval[0]) + parseFloat(thisEval[1]);
        } else {
          thisEval = parseFloat(thisEval[0]) - parseFloat(thisEval[1]);
        }
        current = current.replace(searchExpRad[0],thisEval.toString());
      }

      while (/\(\-?\d+\.?\d*\)/.exec(current)) {      // eliminate superfluous parentheses
        var searchExpRad = /\(\-?\d+\.?\d*\)/.exec(current);
        var simplified = searchExpRad[0].slice(1,-1);
        // console.log(searchExpRad);
        current = current.replace(searchExpRad[0],simplified);
      }
    }
    
    this.setState({
        displayedExpression: current
    });
    
  }   // end of evaluateDisplay function
  
  backspaceDisplay() {
    var current = this.state.displayedExpression;
    current = current.slice(0,-1);
    if (current.length < 1) {
      current = "0"
    }
    this.setState({
        displayedExpression: current
    });
  }
  
  clearDisplay() {
    this.setState({
      displayedExpression: "0"
    });
  }
  
  render() {
    return (
     <div id={`answerDisplay`}>
        {this.state.displayedExpression}
     </div>
    );
  }
}

class Button extends React.Component {

  render() {
    return (
      <div id={`${this.props.cssId}`} className={`${this.props.gridclass} ${this.props.colorGroup} kpButton`} onClick={this.props.onClick}>
        {this.props.symbol}
     </div>
    );
  }
}

ReactDOM.render(
  <App />,
  document.getElementById("root")
);
