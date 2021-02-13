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
import TrophyImage from './trophies.png';
import Modal from 'react-bootstrap/Modal';
import PlayerSelection from './PlayerSelection';
import Welcome from './Welcome';
import PinSetupImage from './FinskaPinSetup.png';
import Toast from 'react-bootstrap/Toast';

// import ReactDom from 'react-dom';

class App extends React.Component {

  constructor(props) {
    super(props);

    const newState = this.createNewGameState([]);
    newState.showWelcomePanel = true;
    newState.showSelectPlayersPanel = false;
    newState.showPlayingPanel = false;
    newState.showToast = false;

    this.state = newState;
  }

  // Set of modes to define what is visible on screen
  static MODE_WELCOME = 1; // When game first loads
  static MODE_PLAYER_SELECTION = 2; // Player selection for the game
  static MODE_SCORING = 3 // While we are playing a game and scoring

  static STRIKES_UNCONFIRMED = 1; // No-one has been eliminated for three strikes yet
  static STRIKES_APPLIED = 2; // Strike out is being applied for this game
  static STRIKES_IGNORED = 3; // Stike out is being ignored for this game

  createNewGameState(playerList) {

    let numPlayers = 2;
    let playerNames = Array(0);
    let activePlayerOrder = Array(0);
    let scoreRefs = Array(0);
    numPlayers = playerList.length;
    playerNames = playerList;

    const turnScores = Array(0);
    for (let i = 0; i < numPlayers; i++) {
      activePlayerOrder[i] = i;
      turnScores.push(Array(0));
      scoreRefs.push(React.createRef());
    }

    let newState = {
      players: playerNames,
      playerTotals: Array(numPlayers).fill(0),
      activePlayerOrder: activePlayerOrder,
      currentPlayer: 0,
      numTurns: 0,
      turnScores: turnScores,
      scoreRefs: scoreRefs,
      winner: -1,
      strikeOutMode: App.STRIKES_UNCONFIRMED,
      showNewGameConfirmModal: false,
      showWinnerModal: false,
      showToast: false,
      showStrikeoutConfirmationModal: false,
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
  handleScoreEntered(userScore, updatedStrikeoutMode) {

    console.log("Handling entered score: " + userScore);

    // This is a hack because we get modal confirmation that isn't applied to the state yet
    let strikeoutMode = updatedStrikeoutMode ? updatedStrikeoutMode : this.state.strikeOutMode;

    const currentPlayer = this.state.currentPlayer;

    // Don't try and copy the refs as they give circular references
    const newState = JSON.parse(JSON.stringify(this.state, (key, value) => {
      return key === "scoreRefs" ? undefined : value;
    }));
    newState.scoreRefs = this.state.scoreRefs;
    newState.strikeOutMode = strikeoutMode;
    newState.showStrikeoutConfirmationModal = false;

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
    newState.previousState = this.state;

    // If this is the first elimination for three strikes we'll ask if applying this rule
    if (strikeoutMode === App.STRIKES_UNCONFIRMED
      && this.hasScoredThreeStrikes(newState.turnScores[currentPlayer])) {
      this.promptForStrikeoutConfirmation();
      return;
    }


    // Shuffle the player order so the current player is now at the end
    const playerOrder = this.state.activePlayerOrder.slice();
    playerOrder.push(playerOrder.shift());
    newState.currentPlayer = playerOrder[0];
    newState.activePlayerOrder = playerOrder;

    if (newTotal === 50) {
      newState.winner = currentPlayer;
      newState.showWinnerModal = true;
    }

    // Handle eliminations if three strikes scored
    if (strikeoutMode === App.STRIKES_APPLIED) {
      let isEliminated = this.hasScoredThreeStrikes(newState.turnScores[currentPlayer]);
      if (isEliminated) {
        console.log("Player index [" + this.state.currentPlayer + "] eliminated for 3 strikes");
        newState.activePlayerOrder.pop();

        // If only one player left then they have won
        if (newState.activePlayerOrder.length === 1) {
          newState.winner = newState.activePlayerOrder[0];
          newState.showWinnerModal = true;
        }
      }
    }

    // Find the current player's score on screen so we can display a toast next to it with the value added
    //console.log("Bounding box: " + JSON.stringify(this.state.scoreRefs[currentPlayer].current.getBoundingClientRect()));
    let scorePos = this.state.scoreRefs[currentPlayer].current.getBoundingClientRect();

    // Make sure we don't offset the toast too far on small screens
    let xOffset = 50, yOffset = 8;
    if (scorePos.height < 80) {
      xOffset = 25;
      yOffset = 4;
    }
    let toastPosX = scorePos.x + (scorePos.width / 2) + xOffset;
    let toastPosY = scorePos.y + yOffset;

    //console.log("toastPosX: " + toastPosX + ", toastPosY: " + toastPosY);

    newState.toastPosX = toastPosX;
    newState.toastPosY = toastPosY;
    newState.lastScore = userScore;
    newState.showToast = true;

    this.setState(newState);
    this.hideToastAfterDelay();
  }

  promptForStrikeoutConfirmation() {
    console.log("User scored three strikes - prompting for confirmation on strikeout mode");
    this.setState({ showStrikeoutConfirmationModal: true });
  }

  handleIgnoreStrikeouts() {
    console.log("User specified to ignore strikeouts");
    this.handleScoreEntered(0, App.STRIKES_IGNORED);
  }

  handleApplyStrikeouts() {
    console.log("User specified to apply strikeouts");
    this.handleScoreEntered(0, App.STRIKES_APPLIED);
  }

  hasScoredThreeStrikes(playerScores) {
    if (playerScores.length < 3) {
      return false;
    }
    let allStrikes = true;
    for (let i = playerScores.length - 1; i > playerScores.length - 4; i--) {
      if (playerScores[i].score !== 0) {
        allStrikes = false;
      }
    }
    return allStrikes;
  }

  hideToastAfterDelay() {
    setTimeout(() => {
      this.setState({ showToast: false });
    }, 1000);
  }

  handleUndo() {
    console.log("Undoing last scoring action");
    this.setState(this.state.previousState);

    // Hide the elimination modal if the user was in the process of being prompted
    this.setState({ showStrikeoutConfirmationModal: false });
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
          scoreRefs={this.state.scoreRefs}
          enabledPlayers={this.state.activePlayerOrder}
        />

        <br />

        <ScorePad
          onScoreEntered={(s) => this.handleScoreEntered(s)}
          onUndo={() => this.handleUndo()}
          isScoringEnabled={this.state.winner === -1 && this.state.activePlayerOrder.length > 0}
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
      <Container>

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


        <UpdatedScoreToast
          show={this.state.showToast}
          x={this.state.toastPosX}
          y={this.state.toastPosY}
          score={this.state.lastScore}
        />

        <StrikeoutConfirmationModal
          show={this.state.showStrikeoutConfirmationModal}
          playerName={this.state.players[this.state.currentPlayer]}
          onIgnore={() => this.handleIgnoreStrikeouts()}
          onApply={() => this.handleApplyStrikeouts()}
        />

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

  getScore(playerNum) {

    if (this.props.winner === playerNum) {
      return "Win!";
    } else if (this.props.enabledPlayers.includes(playerNum)) {
      return this.props.playerTotals[playerNum];
    }
    return "Out"
  }

  renderScores() {
    const scores = this.props.playerNames.map((name, number) => {
      return (
        <Col key={name}>
          <Card>
            <Card.Header className={this.getNameClass(number)}>
              {name} &nbsp;
            </Card.Header>
            <Card.Text ref={this.props.scoreRefs[number]}
              className={this.getScoreClass(number)}
            >
              {this.getScore(number)}
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

function StrikeoutConfirmationModal(props) {

  return (
    <>
      <Modal centered show={props.show} onHide={props.cancel}>
        <Modal.Header className="text-center">
          <Modal.Title>
            <h3 className="modal-title w-100">
              {props.playerName} has three consecutive zeros!
            </h3>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body >
          <p>{props.playerName} has scored three consecutive zeros and will be
          eliminated.</p>
          <p>To ignore the three zeros rule and allow {props.playerName} to
          stay in the game, select "Ignore strikes" below.</p>
          <p>Your decision on three zeros will apply for the remainder of this game.
          </p>
        </Modal.Body>
        <Modal.Footer className="text-center">
          <Button variant="primary" onClick={props.onIgnore}>
            Ignore Strikes
          </Button>
          <Button onClick={props.onApply}>
            Eliminate {props.playerName}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

function UpdatedScoreToast(props) {

  return (
    <>
      <Toast show={props.show}
        style={{
          position: 'absolute',
          top: props.y,
          left: props.x,
        }}
      >
        <Toast.Body>
          <h2>+{props.score}</h2>
        </Toast.Body>
      </Toast>
    </>
  );
}

export default App;
