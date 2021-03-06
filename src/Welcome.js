import React from 'react';
import './PlayerSelection.css';
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button'
import Image from 'react-bootstrap/Image'
import PinSetupImage from './FinskaPinSetup.png';

class Welcome extends React.Component {


    render() {
        return (
            <Container fluid className="text-center">

                <br />
                <h1>Finskora</h1>
                <br />
                <h3>The easy way to score your game of&nbsp;
                 <a href="https://finska.com.au">Finska</a></h3>

                <br />

                <Button
                    onClick={() => this.props.onStartGame()}
                    variant="primary btn-lg"
                >
                    Start Scoring
                </Button>

                <br />

                <br />
                <Image src={PinSetupImage} />
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
            </Container>
        )
    }

}

export default Welcome;