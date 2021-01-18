import React from 'react';
import logo from './logo.svg';
import './App.css';
import Container from 'react-bootstrap/Container'
import Navbar from 'react-bootstrap/Navbar'
import Nav from 'react-bootstrap/Nav'
import Button from 'react-bootstrap/Button'

class App extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      players: ['Seb', 'Ewan'],
      playerTotals: [0, 0],
      currentPlayer: 0,
      numTurns: 0,
      turnScores: [Array(0), Array(0)],
      winner: -1,
    };
  }

  handleScoreEntered(userScore) {

    console.log("Handling entered score: " + userScore);

    const currentPlayer = this.state.numTurns % this.state.players.length;

    const newState = JSON.parse(JSON.stringify(this.state));

    const turnScores = this.state.turnScores[currentPlayer];
    const currentTotal = turnScores.length === 0 ? 0 : turnScores[turnScores.length - 1].total;

    let newTotal = currentTotal + userScore;
    if (newTotal > 50) {
      newTotal = 25;
    }

    newState.turnScores[currentPlayer].push({
      score: userScore,
      total: newTotal,
    });
    newState.playerTotals[currentPlayer] = newTotal;
    newState.numTurns = this.state.numTurns + 1;
    newState.currentPlayer = newState.numTurns % newState.players.length;
    newState.previousState = this.state;

    if (newTotal === 50) {
      newState.winner = currentPlayer;
    }

    this.setState(newState);
  }

  handleUndo() {
    console.log("Undoing last scoring action");
    this.setState(this.state.previousState);
  }

  render() {
    return (
      <Container fluid>
        <Navbar expand='true'>
          <Navbar.Brand href="#home">Finskora</Navbar.Brand>
          <Nav.Link href="#home">New Game</Nav.Link>
        </Navbar>


        <div>
          <LeaderBoard
            playerNames={this.state.players}
            playerTotals={this.state.playerTotals}
            currentPlayer={this.state.currentPlayer}
            winner={this.state.winner}
          />
        </div>
        <div>
          <ScorePad
            onScoreEntered={(s) => this.handleScoreEntered(s)}
            onUndo={() => this.handleUndo()}
          />
        </div>
        <div>
          <PlayerHistory
            player={this.state.players[0]}
            scores={this.state.turnScores[0]}
          />
          <PlayerHistory
            player={this.state.players[1]}
            scores={this.state.turnScores[1]}
          />
        </div>
      </Container>
    );
  }

}

class LeaderBoard extends React.Component {

  renderScores() {
    const scores = this.props.playerNames.map((name, number) => {
      return (
        <div>
          <div>{name}</div>
          <div>{this.props.playerTotals[number]}</div>
          <div>{this.props.winner === number ? 'Winner' : ''}</div>
        </div>
      );
    });

    return scores;
  }

  render() {
    return (
      <div>
        {this.renderScores()}
      </div>
    );
  }

}

function EntryButton(props) {
  return (
    <Button
      className="entryButton"
      onClick={props.onClick}
      variant="primary btn-circle btn-md"
    >
      {props.description}
    </Button>
  );
}

class ScorePad extends React.Component {

  renderEntryButton(scoreValue) {
    return (
      <EntryButton
        onClick={() => this.props.onScoreEntered(scoreValue)}
        description={scoreValue}
      />
    );

  }

  renderUndoButton() {
    return (
      <EntryButton
        onClick={() => this.props.onUndo()}
        description={'\u238C'}
      />
    );

  }

  render() {

    return (
      <div>
        {this.renderEntryButton(0)}
        {this.renderEntryButton(1)}
        {this.renderEntryButton(2)}
        {this.renderEntryButton(3)}
        {this.renderEntryButton(4)}
        {this.renderEntryButton(5)}
        {this.renderEntryButton(6)}
        {this.renderEntryButton(7)}
        {this.renderEntryButton(8)}
        {this.renderEntryButton(9)}
        {this.renderEntryButton(10)}
        {this.renderEntryButton(11)}
        {this.renderEntryButton(12)}
        {this.renderUndoButton()}
      </div>

    );
  }
}


class PlayerHistory extends React.Component {

  renderScores() {
    const scoreList = this.props.scores.map((scores, round) => {

      return (
        < li key={round} >
          {scores.score} | {scores.total}
        </li >
      );

    });
    return scoreList;
  }

  render() {
    return (
      <div>
        <p>{this.props.player}</p>
        <ul>
          {this.renderScores()}
        </ul>

      </div>
    );
  }

}


export default App;
