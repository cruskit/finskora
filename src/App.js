import React from 'react';
import logo from './logo.svg';
import './App.css';

class App extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      players: ['Seb', 'Ewan'],
      numTurns: 0,
      turnScores: [ // Just putting in some dummy data for testing
        [{ score: 5, total: 5 }],
        [{ score: 10, total: 10 }]
      ],
    };
  }

  handleScoreEntered(userScore) {

    console.log("Handling entered score: " + userScore);

    const currentPlayer = this.state.numTurns % this.state.players.length;

    const newState = JSON.parse(JSON.stringify(this.state));

    const turnScores = this.state.turnScores[currentPlayer];
    const currentTotal = turnScores[turnScores.length - 1].total;

    newState.turnScores[currentPlayer].push({
      score: userScore,
      total: currentTotal + userScore,
    });
    newState.numTurns = this.state.numTurns + 1;


    this.setState(newState);
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
          <ScorePad
            onScoreEntered={(s) => this.handleScoreEntered(s)}
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
      </div>

    );
  }
}


class PlayerHistory extends React.Component {

  renderScores() {
    const scoreList = this.props.scores.map((scores, round) => {

      return (
        < li key={round} >
          {scores.total} | {scores.score}
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
