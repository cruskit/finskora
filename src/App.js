import React from 'react';
import './App.css';
import Container from 'react-bootstrap/Container'
import Navbar from 'react-bootstrap/Navbar'
import Nav from 'react-bootstrap/Nav'
import Button from 'react-bootstrap/Button'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Table from 'react-bootstrap/Table'

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
      <div>
        <Navbar bg="light" expand='true'>
          <Navbar.Brand href="#home">Finskora</Navbar.Brand>
          <Nav.Link href="#home">New Game</Nav.Link>
        </Navbar>

        <Container fluid>

          <LeaderBoard
            playerNames={this.state.players}
            playerTotals={this.state.playerTotals}
            currentPlayer={this.state.currentPlayer}
            winner={this.state.winner}
          />

          <ScorePad
            onScoreEntered={(s) => this.handleScoreEntered(s)}
            onUndo={() => this.handleUndo()}
          />

          <Row>
            <Col>
              <PlayerHistory
                player={this.state.players[0]}
                scores={this.state.turnScores[0]}
              />
            </Col>
            <Col>
              <PlayerHistory
                player={this.state.players[1]}
                scores={this.state.turnScores[1]}
              />
            </Col>
          </Row>
        </Container>
      </div>
    );
  }

}

class LeaderBoard extends React.Component {

  renderScores() {
    const scores = this.props.playerNames.map((name, number) => {
      return (
        <Col>
          <Row>
            <Col>
              {name}
            </Col>
          </Row>
          <Row>
            <Col>
              {this.props.playerTotals[number]}
              {this.props.winner === number ? 'Winner' : ''}
            </Col>
          </Row>
        </Col>
      );
    });

    return scores;
  }

  render() {
    return (
      <Container fluid>
        <Row className="text-center">
          {this.renderScores()}
        </Row>
      </Container>
    );
  }

}

class ScorePad extends React.Component {

  renderEntryButton(scoreValue) {
    return (
      <Button
        onClick={() => this.props.onScoreEntered(scoreValue)}
        variant="primary btn-circle btn-md"
      >
        {scoreValue}
      </Button>
    );
  }

  renderUndoButton() {
    return (
      <Button
        onClick={() => this.props.onUndo()}
        variant="warning btn-circle btn-md"
      >
        &lt;=
      </Button>

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
        <tr class="text-center">
          <td>{round + 1}</td>
          <td>{scores.score}</td>
          <td>{scores.total}</td>
        </tr>
      );

    });
    return scoreList;
  }

  render() {
    return (
      <div>
        <p class="text-center">{this.props.player}</p>
        <Table bordered size="sm">
          <thead>
            <tr class="text-center">
              <th>#</th>
              <th>Score</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            {this.renderScores()}
          </tbody>
        </Table>

      </div>
    );
  }

}


export default App;
