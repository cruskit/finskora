import React from 'react';
import './App.css';
import Container from 'react-bootstrap/Container'
import Navbar from 'react-bootstrap/Navbar'
import Nav from 'react-bootstrap/Nav'
import Button from 'react-bootstrap/Button'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Table from 'react-bootstrap/Table'
import Card from 'react-bootstrap/Card'
import Image from 'react-bootstrap/Image'
//import PinImage from './finska_pin_icon.png'
import PinImage from './finska_pin_icon_35.png'

class App extends React.Component {

  constructor(props) {
    super(props);

    this.state = this.createNewGameState();
  }

  createNewGameState(){

    const numPlayers = 2;
    const playerNames = Array(0);
    const turnScores = Array(0);
    for (let i = 0; i < numPlayers; i++) {
      playerNames.push(`Player ${i + 1}`);
      turnScores.push(Array(0));
    }

    let newState = {
      players: playerNames,
      playerTotals: Array(numPlayers).fill(0),
      currentPlayer: 0,
      numTurns: 0,
      turnScores: turnScores,
      winner: -1,
    };

    return newState;
  }

  handleStartNewGame(){
    this.setState(this.createNewGameState());
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
        <Navbar bg="primary" variant="dark" expand='true'>
          <Navbar.Brand href="#home">Finskora</Navbar.Brand>
          <Nav>
            <Nav.Link href="#home" variant="dark" onClick={() => this.handleStartNewGame()}>New Game</Nav.Link>
          </Nav>
        </Navbar>

        <Container fluid>

          <br />

          <LeaderBoard
            playerNames={this.state.players}
            playerTotals={this.state.playerTotals}
            currentPlayer={this.state.currentPlayer}
            winner={this.state.winner}
          />

          <br />

          <ScorePad
            onScoreEntered={(s) => this.handleScoreEntered(s)}
            onUndo={() => this.handleUndo()}
            isScoringEnabled={this.state.winner === -1}
          />

          <br />

          <PlayerHistory
            players={this.state.players}
            turnScores={this.state.turnScores}
          />
        </Container>
      </div>
    );
  }

}

class LeaderBoard extends React.Component {

  getScoreClass(playerNum) {
    if (playerNum === this.props.currentPlayer) {
      return "leaderboard-score-current";
    }
    // TODO: handle eliminated players
    return "leaderboard-score";
  }

  getNameClass(playerNum) {
    if (playerNum === this.props.currentPlayer) {
      return "leaderboard-name-current";
    }
    // TODO: handle eliminated players
    return "leaderboard-name";
  }

  renderScores() {
    const scores = this.props.playerNames.map((name, number) => {
      return (
        <Col>
          <Card>
            <Card.Header className={this.getNameClass(number)}>
              {name} &nbsp;
              <Image src={PinImage} className={number === this.props.currentPlayer ? "visible" : "invisible"} />
            </Card.Header>
            <Card.Text
              className={this.getScoreClass(number)}
            >
              {this.props.winner === number ? 'Win!' : this.props.playerTotals[number]}
            </Card.Text>
          </Card>
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
        variant="primary btn-circle btn-xl"
        className={this.props.isScoringEnabled ? "visible" : "d-none"}
      >
        {scoreValue}
      </Button>
    );
  }

  renderUndoButton() {
    return (
      <Button
        onClick={() => this.props.onUndo()}
        variant="warning btn-circle btn-xl"
      >
        Undo
      </Button>

    );

  }

  render() {

    return (
      <div className="text-center">
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

  renderScores(turnScores) {
    if (!turnScores) {
      return;
    }

    // Ensure scores are displayed with the most recent score first
    const scoreList = turnScores.slice().reverse().map((scores, round) => {
      return (
        <tr className="text-center">
          <td>{turnScores.length - round}</td>
          <td>{scores.score}</td>
          <td>{scores.total}</td>
        </tr>
      );
    });
    return scoreList;
  }

  renderPlayers() {
    const scoreTables = this.props.players.map((player, index) => {
      return (
        <Col>
          <p className="text-center font-weight-bold">{player}</p>
          <Table bordered size="sm">
            <thead>
              <tr className="text-center">
                <th>#</th>
                <th>Score</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              {this.renderScores(this.props.turnScores[index])}
            </tbody>
          </Table>
        </Col>
      );
    });
    return scoreTables;
  }

  render() {
    return (
      <Row>
        {this.renderPlayers()}
      </Row>
    );
  }

}


export default App;
