import React from "react";
import {
    BrowserRouter as Router,
    Routes,
    Route,
    Link
} from "react-router-dom";
import landscape from './systemLandscape.png';
import docker_ss from './docker_ps_ss.png';
import fibbo_ss from './fibbo_ss.png';

export default function App() {
    return (
        <Router>
            <div>
                <nav>
                    <ul>
                        <li>
                            <Link to="/">Home</Link>
                        </li>
                        <li>
                            <Link to="/fibonacci">Fibonacci</Link>
                        </li>
                    </ul>
                </nav>
                <Routes>
                    <Route exact path="/" element={<Home/>}/>
                    <Route path="/fibonacci" element={<Fibo/>}/>
                </Routes>
            </div>
        </Router>
    );
}

function Home() {
    return (
        <div>
            <h2>PFSwChO – Project 1</h2>
            <h3>Autor: Mateusz Legieć</h3>
            <h3>Grupa: 2.2.3</h3>
            <h3>System landscape</h3>
            <img src={landscape} width="500px" alt="system landscape"/>
            <h3>Components</h3>
            <ul>
                <li>react-application: User interface</li>
                <li>main-service: Main application service</li>
                <li>redis: Store used for caching fibonacci sequence values</li>
                <li>postgres: Database used for inserting and reading audit data</li>
                <li>rabbitMQ: Message broker</li>
                <li>worker-service: Service responsible for fibonacci sequence calculation</li>
            </ul>
            <h3>Running production evn</h3>
            <h4>To run this project in production mode your will need</h4>
            <ul>
                <li>Docker</li>
            </ul>
            <h4>Instructions</h4>
            <ul>
                <li>Go to root project folder</li>
                <li>Type `docker compose up`</li>
                <li>Go to http://localhost/fibonacci to perform calculations</li>
                <li>Go to http://localhost to see documentation</li>
            </ul>
            <h3>Running development evn</h3>
            <h4>To run this project in development mode your will need</h4>
            <ul>
                <li>Docker</li>
            </ul>
            <h4>Instructions</h4>
            <ul>
                <li>Go to main-service project folder</li>
                <li>Type `mvnw spring-boot:build-image`</li>
                <li>Go to worker-service project folder</li>
                <li>Type `mvnw spring-boot:build-image`</li>
                <li>Go to root project folder</li>
                <li>Type `docker compose -f docker-compose-dev.yml up`</li>
                <li>Go to http://localhost:3000/fibonacci to perform calculations</li>
                <li>Go to http://localhost:3000 to see documentation</li>
            </ul>
            <h3>How hot reloading works?</h3>
            <h4>JavaScript</h4>
            <div>
                webpack-dev-server - development server that provides live reloading.<br/>

                Instead of creating a bundled file in dist folder, it creates a bundled file in memory.<br/>
                It then serves that information to express, and then express creates a web socket connection to render that on the browser on a certain port.
            </div>
            <h4>SpringBoot</h4>
            <div>
                spring-boot-devtools is tool that enables automatically restart whenever files on the classpath change.<br/>

                Remote devtools support is provided in two parts<br/>
                - server side endpoint that accepts connections<br/>
                - client application that you run in your IDE.<br/>

                The remote client application is designed to be run from within your IDE.<br/>
                It will monitor your application classpath for changes in the same way as the local restart.<br/>
                Any updated resource will be pushed to the remote application and (if required) trigger a restart.<br/>
            </div>

            <h3>ScreenShots</h3>

            <h4>Docker ps command execution result</h4>
            <img src={docker_ss} width="1500px" alt="docker ps ss"/>

            <h4>Fibonacci page</h4>
            <img src={fibbo_ss} width="500px" alt="Fibonacci ss"/>

        </div>
    );
}

class Fibo extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            value: '',
            calculations: []
        };
        fetch(`main-service/calculations`, { method: 'GET' })
            .then(response => response.json())
            .then(it => this.setState({
                value: '',
                calculations: it.reverse()
            }));

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(event) {
        this.setState({value: event.target.value});
    }

    handleSubmit(event) {
        let value = this.state.value;

        const requestOptions = {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
        };

        fetch(`main-service/${this.state.value}`, requestOptions)
            .then(response => response.json())
            .then(() => fetch(`main-service/calculations`, { method: 'GET' }))
            .then(response => response.json())
            .then(it => this.setState({
                value: value,
                calculations: it.reverse()
            }));

        event.preventDefault();
    }

    render() {
        return (
            <div>
                <div>
                    <input min="0" max="20" type="number" value={this.state.value} onChange={this.handleChange}/>
                    <button onClick={this.handleSubmit}>Calculate</button>
                </div>
                {this.state.calculations.map(it => <div key={it.id}>Fibonacci sequence for value {it.key} equals {it.value}.</div>)}
            </div>
        );
    }

}
