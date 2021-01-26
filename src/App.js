import React from 'react';
import './App.css';
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Table from 'react-bootstrap/Table';
import Card from 'react-bootstrap/Card';
import Image from 'react-bootstrap/Image';
import PinImage from './finska_pin_icon_35.png';
import TrophyImage from './trophies.png';
import Modal from 'react-bootstrap/Modal';
import PlayerSelection from './PlayerSelection';
import Welcome from './Welcome';
import PinSetupImage from './FinskaPinSetup.png';


// import Toast from 'react-bootstrap/Toast';
// import ReactDom from 'react-dom';

class App extends React.Component {

  constructor(props) {
    super(props);

    const newState = this.createNewGameState();
    newState.showWelcomePanel = true;
    newState.showSelectPlayersPanel = false;
    newState.showPlayingPanel = false;

    this.state = newState;
  }

  // Set of modes to define what is visible on screen
  static MODE_WELCOME = 1; // When game first loads
  static MODE_PLAYER_SELECTION = 2; // Player selection for the game
  static MODE_SCORING = 3 // While we are playing a game and scoring


  createNewGameState(playerList) {

    let numPlayers = 2;
    let playerNames = Array(0);
    if (playerList) {
      numPlayers = playerList.length;
      playerNames = playerList;
    } else {
      // TODO: Remove this once we've fixe the new game workflow
      for (let i = 0; i < numPlayers; i++) {
        playerNames.push(`Player ${i + 1}`);
      }
    }
    const turnScores = Array(0);
    for (let i = 0; i < numPlayers; i++) {
      turnScores.push(Array(0));
    }

    let newState = {
      players: playerNames,
      playerTotals: Array(numPlayers).fill(0),
      currentPlayer: 0,
      numTurns: 0,
      turnScores: turnScores,
      winner: -1,
      showNewGameConfirmModal: false,
      showWinnerModal: false,
    };

    return newState;
  }

  handleStateNewGameLink() {
    this.setState({ showNewGameConfirmModal: true });
  }

  handleStartNewGameLinkConfirmed() {
    this.setState({ showNewGameConfirmModal: false, showWinnerModal: false });
    this.setGameState(App.MODE_PLAYER_SELECTION);
  }

  handleStartGameWithPlayers(players) {
    console.log("Starting game with players: " + players);
    this.setState(this.createNewGameState(players));
    this.setGameState(App.MODE_SCORING);
  }

  setGameState(state) {
    switch (state) {

      case App.MODE_PLAYER_SELECTION:
        this.setState({
          showWelcomePanel: false,
          showSelectPlayersPanel: true,
          showPlayingPanel: false,
        });
        break;

      case App.MODE_SCORING:
        this.setState({
          showWelcomePanel: false,
          showSelectPlayersPanel: false,
          showPlayingPanel: true,
        });
        break;

      case App.MODE_WELCOME:
        this.setState({
          showWelcomePanel: true,
          showSelectPlayersPanel: false,
          showPlayingPanel: false,
        });
        break;

      default:
        console.warn("Unknown game state requested: " + state);
    }
  }

  handleCancelStartNewGame() {
    this.setState({ showNewGameConfirmModal: false });
  }

  handleCloseWinnerModal() {
    this.setState({ showWinnerModal: false });
  }

  handleClosePinSetupModal() {
    this.setState({ showPinSetupModal: false });
  }

  handleShowPinSetupModal() {
    this.setState({ showPinSetupModal: true });
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
      newState.showWinnerModal = true;
    }

    // Find the current players score so we can display a toast with the value added
    //console.log("Bounding box: " + JSON.stringify(ReactDom.findDOMNode("playerScore_0").getBoundingClientRect()));

    this.setState(newState);
  }

  handleUndo() {
    console.log("Undoing last scoring action");
    this.setState(this.state.previousState);
  }

  renderPlayingPanel() {
    return (
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
    );
  }

  renderSelectPlayersPanel() {
    return (
      <Container fluid>

        <PlayerSelection
          onStartGame={(p) => this.handleStartGameWithPlayers(p)} />

      </Container>
    );
  }

  renderWelcomePanel() {
    return (
      <Welcome
        onStartGame={() => this.setGameState(App.MODE_PLAYER_SELECTION)}
      />
    );
  }

  render() {
    return (
      <>
        <Navbar bg="primary" variant="dark">
          <Navbar.Brand href="#home">Finskora</Navbar.Brand>
          <Nav className="ml-auto mr-1 justify-content-end">
            <Nav.Item>
              <Nav.Link href="#home" variant="dark" onClick={() => this.handleStateNewGameLink()}>New Game</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link href="#home" variant="dark" onClick={() => this.handleShowPinSetupModal()}>Pin Setup</Nav.Link>
            </Nav.Item>
          </Nav>
        </Navbar>

        { this.state.showWelcomePanel && this.renderWelcomePanel()}

        { this.state.showSelectPlayersPanel && this.renderSelectPlayersPanel()}

        { this.state.showPlayingPanel && this.renderPlayingPanel()}

        <NewGameConfirmationModal
          show={this.state.showNewGameConfirmModal}
          confirmed={() => this.handleStartNewGameLinkConfirmed()}
          cancel={() => this.handleCancelStartNewGame()}
        />

        <WinnerModal
          show={this.state.showWinnerModal}
          newGame={() => this.handleStartNewGameLinkConfirmed()}
          cancel={() => this.handleCloseWinnerModal()}
          undo={() => this.handleUndo()}
          winner={this.state.players[this.state.winner]}
        />

        <PinSetupModal
          show={this.state.showPinSetupModal}
          cancel={() => this.handleClosePinSetupModal()}
        />


        {/* <UpdatedScoreToast /> */}

      </>
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
        <Col key={name}>
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
        <tr className="text-center" key={round}>
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
        <Col key={player}>
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

function NewGameConfirmationModal(props) {

  return (
    <>
      <Modal show={props.show} onHide={props.cancel}>
        <Modal.Header closeButton>
          <Modal.Title>Start new game</Modal.Title>
        </Modal.Header>
        <Modal.Body>Do you want to start a new game? All scores will be reset.</Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={props.confirmed}>
            New Game
          </Button>
          <Button variant="secondary" onClick={props.cancel}>
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

function WinnerModal(props) {

  return (
    <>
      <Modal centered show={props.show} onHide={props.cancel}>
        <Modal.Header closeButton className="text-center">
          <Modal.Title>
            <h1 className="modal-title w-100">
              {props.winner} Wins!
            </h1>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-center">
          <Image src={TrophyImage} width="255" height="320" />
        </Modal.Body>
        <Modal.Footer className="text-center">
          <Button variant="primary" onClick={props.newGame}>
            Start new game
          </Button>
          <Button variant="secondary" onClick={props.undo}>
            Undo last score
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

function PinSetupModal(props) {

  return (
    <>
      <Modal centered show={props.show} onHide={props.cancel}>
        <Modal.Header closeButton className="text-center">
          <Modal.Title>
            <h3 className="modal-title w-100">
              Starting Pin Setup
            </h3>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-center">
          <Image src={PinSetupImage} />
        </Modal.Body>
        <Modal.Footer className="text-center">
          <Button variant="primary" onClick={props.cancel}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

// function UpdatedScoreToast(props) {

//   return (
//     <>
//       <Toast
//         style={{
//           position: 'absolute',
//           top: 20,
//           right: 0,
//         }}
//       >
//         <Toast.Body>
//           <h2>Player 1 +6</h2>
//         </Toast.Body>
//       </Toast>
//     </>
//   );
// }

export default App;
