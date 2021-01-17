import React from 'react';
import logo from './logo.svg';
import './App.css';

class App extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      players: ['Seb', 'Ewan'],
      numTurns: 0,
      turnScores: [Array(0), Array(0)],
    };
  }

  handleScoreEntered(userScore) {

    console.log("Handling entered score: " + userScore);

    const currentPlayer = this.state.numTurns % this.state.players.length;

    const newState = JSON.parse(JSON.stringify(this.state));

    const turnScores = this.state.turnScores[currentPlayer];
    const currentTotal = turnScores.length === 0 ? 0 : turnScores[turnScores.length - 1].total;

    newState.turnScores[currentPlayer].push({
      score: userScore,
      total: currentTotal + userScore,
    });
    newState.numTurns = this.state.numTurns + 1;
    newState.previousState = this.state;

    this.setState(newState);
  }

  handleUndo() {
    console.log("Undoing last scoring action");
    this.setState(this.state.previousState);
  }

  render() {
    return (
      <div>
        <header>
          <p>
            Scoreboard
        </p>

        </header>
        <div>
          <LeaderBoard />
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
      </div>
    );
  }

}

class LeaderBoard extends React.Component {


  render() {
    return (
      <div>
        <p>LeaderBoard</p>
      </div>
    );
  }

}

function EntryButton(props) {
  return (
    <button
      className="entryButton"
      onClick={props.onClick}
    >
      {props.description}
    </button>
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
        description="Undo"
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
