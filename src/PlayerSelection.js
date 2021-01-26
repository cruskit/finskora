import React from 'react';
import './iconoo.min.css';
import './PlayerSelection.css';
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
class PlayerSelection extends React.Component {

    constructor(props) {
        super(props);

        const playerNames = ['Player 1', 'Player 2'];

        this.state = {
            selectedPlayers: playerNames,
            recentPlayers: Array(0),
            newPlayerName: "",
        }
    }

    displaySelectedPlayers() {
        const playerList = this.state.selectedPlayers.map((name, number) => {
            return (
                <p key={name}>
                    {name}
                    &nbsp; <span className="iconoo-caretUpCircle"
                        onClick={() => this.movePlayer(number, -1)}></span>
                    &nbsp; <span className="iconoo-caretDownCircle"
                        onClick={() => this.movePlayer(number, 1)}></span>
                    &nbsp; <span className="iconoo-crossCircle"
                        onClick={() => this.deletePlayer(number)}></span>
                </p>
            );
        });
        return playerList;
    }

    addPlayer() {
        if (this.state.newPlayerName.length > 0) {
            const players = this.state.selectedPlayers.slice();
            players.push(this.state.newPlayerName);
            this.setState({ selectedPlayers: players, newPlayerName: "" })
        }
    }

    deletePlayer(index) {
        const players = this.state.selectedPlayers.slice();
        players.splice(index, 1);
        this.setState({ selectedPlayers: players })
    }

    movePlayer(index, numSpots) {
        const players = this.state.selectedPlayers.slice();
        const newIndex = index + numSpots;
        if (newIndex < 0 || newIndex >= players.length){
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
        this.props.onStartGame(this.state.selectedPlayers);
    }


    render() {
        return (
            <Container fluid>
                <br />
                <h1>Choose Players / Teams</h1>

                {this.displaySelectedPlayers()}

                <Form>

                    <Form.Control size="lg" type="text" placeholder="Player or Team Name"
                        value={this.state.newPlayerName}
                        onChange={(e) => this.setState({ newPlayerName: e.target.value })}
                    />
                    <Button variant="primary" onClick={() => this.addPlayer()}>
                        Add Player
                    </Button>
                </Form>

                <Button variant="primary" onClick={() => this.startGame()}>
                    Start Game with selected players
                </Button>
            </Container>
        );
    }

}

export default PlayerSelection;