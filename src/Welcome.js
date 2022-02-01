import React from 'react';
import './PlayerSelection.css';
import PinSetupImage from './FinskaPinSetup.png';

class Welcome extends React.Component {


    render() {
        return (
            <div class="items-center justify-center text-center">

                <br />
                <h1>Finskora</h1>
                <br />
                <h3>The easy way to score your game of&nbsp;
                 <a href="https://finska.com.au">Finska</a></h3>

                <br />

                <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full"
                    onClick={() => this.props.onStartGame()}
                    variant="primary btn-lg"
                >
                    Start Scoring
                </button>

                <br />

                <br />
                <img class="mx-auto" src={PinSetupImage} alt="Pin Setup" />
                <br />
                <br />
                <br />
                <p>
                <a href="https://twitter.com/messages/compose?recipient_id=390692530"
                    class="twitter-dm-button" data-size="large" data-screen-name="@thecruskit"
                    data-text="Finskora is ">
                    Feedback @thecruskit</a>

                </p>
                <p><small>Finskora is not affiliated or associated with <a href="https://finska.com.au">Finska</a></small></p>
            </div>
        )
    }

}

export default Welcome;