import React from 'react';
import './PlayerSelection.css';
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button'

class PlayerSelection extends React.Component {

    constructor(props) {
        super(props);

        const playerNames = ['Player 1', 'Player 2'];

        this.state = {
            selectedPlayers: playerNames,
            recentPlayers: Array(0),
        }
    }

    displaySelectedPlayers() {
        const playerList = this.state.selectedPlayers.map((name, number) => {
            return (
                <p key={name}>{name}</p>
            );
        });
        return playerList;
    }

    addPlayer(){
        const players = this.state.selectedPlayers.slice();
        players.push("Player " + (players.length + 1));
        this.setState({selectedPlayers: players})
    }

    deletePlayer(){
        const players = this.state.selectedPlayers.slice(0,this.state.selectedPlayers.length-1);
        this.setState({selectedPlayers: players})
    }

    startGame(){
        console.log("Request to start game with players: " + this.state.selectedPlayers);
        this.props.onStartGame(this.state.selectedPlayers);
    }


    render() {
        return (
            <Container fluid>
                <h1>Choose Players / Teams</h1>

                {this.displaySelectedPlayers()}

                <Button variant="primary" onClick={() => this.addPlayer()}>
                    Add Player
                </Button>
                <Button variant="primary" onClick={() => this.deletePlayer()}>
                    Delete Player
                </Button>
                <Button variant="primary" onClick={() => this.startGame()}>
                    Start Game with selected players
                </Button>
            </Container>
        );
    }

}

export default PlayerSelection;