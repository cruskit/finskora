import React from 'react';
import './iconoo.min.css';
import './PlayerSelection.css';
import FlipMove from 'react-flip-move';
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

            // Don't add if they are already playing - would be duplicate
            if (players.includes(this.state.newPlayerName)) {
                return;
            }

            players.push(this.state.newPlayerName);
            this.setState({ selectedPlayers: players, newPlayerName: "" })

            // If the player name was in the recent list get rid of them
            // as they're now a current player and we don't want duplicates
            const recentPlayers = this.state.recentPlayers.slice();
            if (recentPlayers.includes(this.state.newPlayerName)) {
                recentPlayers.splice(recentPlayers.indexOf(this.state.newPlayerName), 1);
                this.setState({ recentPlayers: recentPlayers });
            }
        }
    }

    addFromRecentPlayers(index) {
        const players = this.state.selectedPlayers.slice();
        players.push(this.state.recentPlayers[index]);
        const recentPlayers = this.state.recentPlayers.slice();
        recentPlayers.splice(index, 1);
        this.setState({ selectedPlayers: players, recentPlayers: recentPlayers });
    }

    deletePlayer(index) {
        let recentPlayers = [this.state.selectedPlayers[index]].concat(this.state.recentPlayers.slice());
        // Only keep the 5 most recent players
        recentPlayers = recentPlayers.slice(0, 5);
        const players = this.state.selectedPlayers.slice();
        players.splice(index, 1);
        this.setState({ selectedPlayers: players, recentPlayers: recentPlayers });
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


    shufflePlayers() {
        console.log("Request player order shuffling");
        let players = this.shuffleArray(this.state.selectedPlayers.slice());

        // Make sure the order of the players always changes
        if (players.length > 1){
            while (this.arraysEqual(this.state.selectedPlayers, players)) {
                players = this.shuffleArray(players);
            }
            this.setState({ selectedPlayers: players });
        }
    }

    arraysEqual(a, b) {
        if (a === b) return true;
        if (a == null || b == null) return false;
        if (a.length !== b.length) return false;

        for (var i = 0; i < a.length; ++i) {
            if (a[i] !== b[i]) return false;
        }
        return true;
    }

    shuffleArray(a) {
        for (let i = a.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [a[i], a[j]] = [a[j], a[i]];
        }
        return a;
    }

    displaySelectedPlayers() {

        if (this.state.selectedPlayers.length === 0) {
            return (<li key="noPlayers" className=""><h3>Please add some players</h3></li>);
        }

        const playerList = this.state.selectedPlayers.map((name, number) => {
            return (
                <li key={name} className="mb-2.5 font-medium p-2 pl-4 border-sky-500 border rounded-full shadow-md">
                    <div className="flex justify-between">

                        <div className="text-3xl">
                        {name}&nbsp;&nbsp;
                        </div>

                        <div>
                            <span className={number === 0 ? "invisible" : "visible"}>
                                &nbsp; <span className="iconoo-caretUpCircle"
                                    onClick={() => this.movePlayer(number, -1)}></span>
                            </span>
                            &nbsp; &nbsp;
                            <span className={number === this.state.selectedPlayers.length - 1 ? "invisible" : "visible"}>
                                <span className="iconoo-caretDownCircle"
                                    onClick={() => this.movePlayer(number, 1)}></span>
                            </span>
                            &nbsp; &nbsp;
                            <span className="iconoo-crossCircle"
                                onClick={() => this.deletePlayer(number)}></span>
                        </div>
                    </div>
                </li>
            );
        });
        return playerList;
    }

    displayRecentPlayers() {

        if (this.state.recentPlayers.length === 0) {
            return (<li key="noPlayers" className="list-group-item"><h3>No recent players</h3></li>);
        }

        const recentPlayerList = this.state.recentPlayers.map((name, number) => {
            return (
                <li key={name} className="mb-2.5 font-medium p-2 pl-4 border-sky-500 border rounded-full shadow-md">

                    <div className="flex justify-between">
                        <div className="text-3xl">
                            {name}&nbsp;&nbsp;
                        </div>
                        <span className="iconoo-plusCircle"
                            onClick={() => this.addFromRecentPlayers(number)}></span>
                    </div>
                </li>
            );
        });
        return recentPlayerList;
    }

    render() {
        return (
            <div class="items-center justify-center text-center">
                <br />
                <div class="flex flex-row justify-center ">
                        <h1>Select Players</h1>


                </div>

                <br />

                <div className="flex justify-center">
                    <ul>
                        <FlipMove>
                            {this.displaySelectedPlayers()}
                        </FlipMove>
                    </ul>
                </div>

                <form onSubmit={e => e.preventDefault()}>
                    <input type="text" placeholder="New Player Name" 
                        value={this.state.newPlayerName}
                        onChange={(e) => this.setState({ newPlayerName: e.target.value })}
                    />
                    <button type="submit" onClick={() => this.addPlayer()}
                        class="text-xl font-medium h-10 px-3 m-2 text-white transition-colors duration-150 bg-blue-500 rounded-lg focus:shadow-outline hover:bg-blue-700">
                        Add
                    </button>

                        <button onClick={() => this.shufflePlayers()}
                            class="text-xl font-medium h-10 px-3 m-2 text-white transition-colors duration-150 bg-blue-500 rounded-lg focus:shadow-outline hover:bg-blue-700">
                            Shuffle
                        </button>
                </form>

                <br />

                <div>
                        <button onClick={() => this.startGame()}
                            class="text-2xl font-bold h-14 px-5 m-2 text-white text-opacity-25 transition-colors duration-150 bg-blue-500 rounded-lg focus:shadow-outline hover:bg-blue-700">
                            Start Game
                        </button>
                </div>

                <br />
                <h3>Recent Players</h3>
                <br />
                <div className="flex justify-center">
                    <ul>
                        {this.displayRecentPlayers()}
                    </ul>
                </div>
                <br />
                
            </div>
        );
    }

}

export default PlayerSelection;