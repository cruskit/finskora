import React from 'react';
import './iconoo.min.css';
import './PlayerSelection.css';
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

class PlayerSelection extends React.Component {

    constructor(props) {
        super(props);

        let playerNames, recentPlayers;

        try {
            playerNames = JSON.parse(localStorage.getItem("selectedPlayers"));
        } catch (error) {
            playerNames = Array(0);
        }

        try {
            recentPlayers = JSON.parse(localStorage.getItem("recentPlayers"));
        } catch (error) {
            recentPlayers = Array(0);
        }

        if (!Array.isArray(playerNames)) {
            playerNames = Array(0);
        }
        if (!Array.isArray(recentPlayers)) {
            recentPlayers = Array(0);
        }

        this.state = {
            selectedPlayers: playerNames,
            recentPlayers: recentPlayers,
            newPlayerName: "",
        }
    }

    addPlayer() {
        if (this.state.newPlayerName.length > 0) {
            const players = this.state.selectedPlayers.slice();
            players.push(this.state.newPlayerName);
            this.setState({ selectedPlayers: players, newPlayerName: "" })
        }
    }

    addFromRecentPlayers(index) {
        const players = this.state.selectedPlayers.slice();
        players.push(this.state.recentPlayers[index]);
        const recentPlayers = this.state.recentPlayers.slice();
        recentPlayers.splice(index, 1);
        this.setState({ selectedPlayers: players, recentPlayers: recentPlayers })
    }

    deletePlayer(index) {
        let recentPlayers = [this.state.selectedPlayers[index]].concat(this.state.recentPlayers.slice());
        // Only keep the 5 most recent players
        recentPlayers = recentPlayers.slice(0, 5);
        const players = this.state.selectedPlayers.slice();
        players.splice(index, 1);
        this.setState({ selectedPlayers: players, recentPlayers: recentPlayers })
    }

    movePlayer(index, numSpots) {
        const players = this.state.selectedPlayers.slice();
        const newIndex = index + numSpots;
        if (newIndex < 0 || newIndex >= players.length) {
            console.log(`Attempt to move players outside array bounds, index: ${index}, numSpots: ${numSpots}`);
            return;
        }

        // Swap the players around
        const prev = players[newIndex];
        players[newIndex] = players[index];
        players[index] = prev;

        this.setState({ selectedPlayers: players })
    }

    startGame() {
        console.log("Request to start game with players: " + this.state.selectedPlayers);

        // Keep a copy of the players so they user can start with same selections
        localStorage.setItem("selectedPlayers", JSON.stringify(this.state.selectedPlayers));
        localStorage.setItem("recentPlayers", JSON.stringify(this.state.recentPlayers));

        this.props.onStartGame(this.state.selectedPlayers);
    }

    displaySelectedPlayers() {

        if (this.state.selectedPlayers.length === 0) {
            return (<li key="noPlayers" className="list-group-item">No players chosen - please add a player</li>);
        }

        const playerList = this.state.selectedPlayers.map((name, number) => {
            return (
                <li key={name} className="list-group-item">
                    <strong>
                        {name}
                    &nbsp; <span className={number === 0 ? "hidden" : "iconoo-caretUpCircle"}
                            onClick={() => this.movePlayer(number, -1)}></span>
                        <span className={number === 0 ? "hidden" : ""}>&nbsp;</span>
                        <span className={number === this.state.selectedPlayers.length - 1 ? "hidden" : "iconoo-caretDownCircle"}
                            onClick={() => this.movePlayer(number, 1)}></span>
                        <span className={this.state.selectedPlayers.length - 1 ? "hidden" : ""}>&nbsp;</span>
                        <span className="iconoo-crossCircle"
                            onClick={() => this.deletePlayer(number)}></span>
                    </strong>
                </li>
            );
        });
        return playerList;
    }

    displayRecentPlayers() {

        if (this.state.recentPlayers.length === 0) {
            return (<li key="noPlayers" className="list-group-item">No recent players</li>);
        }

        const recentPlayerList = this.state.recentPlayers.map((name, number) => {
            return (
                <li key={name} className="list-group-item">
                    {name}
                    &nbsp; <span className="iconoo-plusCircle"
                        onClick={() => this.addFromRecentPlayers(number)}></span>
                </li>
            );
        });
        return recentPlayerList;
    }

    render() {
        return (
            <Container>
                <br />
                <Row>
                    <Col>
                        <h1>Selected Players </h1>
                    </Col>
                    <Col>
                        <Button variant="primary btn-lg" onClick={() => this.startGame()}>
                            Start Game
                        </Button>
                    </Col>
                </Row>

                <br />

                <Row>
                    <ul className="list-item">
                        {this.displaySelectedPlayers()}
                    </ul>
                </Row>

                <br />

                <Form>
                    <Form.Row>
                        <Col>
                            <Form.Control size="lg" type="text" placeholder="New Player Name"
                                value={this.state.newPlayerName}
                                onChange={(e) => this.setState({ newPlayerName: e.target.value })}
                            />
                        </Col>
                        <Col>
                            <Button variant="primary" className="btn-lg" type="submit" onClick={() => this.addPlayer()}>
                                Add Player
                            </Button>
                        </Col>
                    </Form.Row>
                </Form>
                <br />
                <Row>
                    <h3>Recent Players</h3>
                </Row>
                <br />
                <Row>
                    <ul className="list-item">
                        {this.displayRecentPlayers()}
                    </ul>
                </Row>
            </Container>
        );
    }

}

export default PlayerSelection;