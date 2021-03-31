import React from 'react';
import './App.css';
var moment = require('moment');
moment().format();

const Header = () => <h1 className="header">Pomodoro Clock</h1>;

const SetTimer = ({ type, value, handleClick }) => (
  <div className="SetTimer">
    <h3 id={`${type}-label`}>
      {type === "session" ? "Session" : "Break "} length
    </h3>
    <div className="SetTimer-controls">
      <button
        id={`${type}-decrement`}
        onClick={() => handleClick(false, `${type}Value`)}
      >
        &#8897;
      </button>
      <h2 id={`${type}-length`}>{value}</h2>
      <button
        id={`${type}-increment`}
        onClick={() => handleClick(true, `${type}Value`)}
      >
        &#8896;
      </button>
    </div>
  </div>
);

const Timer = ({ title, time }) => (
  <div className="Timer">
    <h2 id="timer-label">{title === "session" ? "Session" : "Break"}</h2>
    <h2 id="time-left" className="time">
      {time}
    </h2>
  </div>
);

const Controls = ({ running, handleStartStop, handleReset }) => (
  <div className="controls">
    <button id="start_stop" onClick={handleStartStop}>
      {running ? <span>&#10074;&#10074;</span> : <span>&#9658;</span>}
    </button>
    <button id="reset" onClick={handleReset}>
      &#8635;
    </button>
  </div>
);

class Clock extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      breakValue: 5,
      sessionValue: 25,
      title: 'session',
      time: 25 * 60 * 1000,
      running: false,
      change: false
    };
  }
  
  componentDidUpdate(prevProps, prevState) {
    if (prevState.time === 0 && prevState.title === 'session') {
      this.setState({time: this.state.breakValue * 60 * 1000, title: 'break'})
      this.audio.play()
    }
    if (prevState.time === 0 && prevState.title === 'break') {
      this.setState({time: this.state.sessionValue * 60 * 1000, title: 'session'})
      this.audio.play()
    }
  }

  handleSetTime = (action, type) => {
    if (this.state[type] === 60 && action) return;
    if (this.state[type] === 1 && !action) return;
    this.setState({
      [type]: this.state[type] + (action ? 1 : -1)
    });
  };

  handleReset = () => {
    this.setState({
      breakValue: 5,
      sessionValue: 25,
      title: 'session',
      time: 25 * 60 * 1000,
      running: false,
      valueChange: false
    });
    clearInterval(this.countdown);
    this.audio.pause()
    this.audio.currentTime = 0
  };

  handleStartStop = () => {
    if (this.state.running) {
      clearInterval(this.countdown);
      this.setState({ running: false });
    } else {
      if (this.state.valueChange) {
        this.countdown = setInterval(() => this.setState({ time: this.state.time - 1000 }), 1000);
        this.setState({ running: true });
      } else {
        this.setState(
          {
            time: this.state.sessionValue * 60 * 1000,
            valueChange: true,
            running: true
          },
          () => (this.countdown = setInterval(() => this.setState({ time: this.state.time - 1000 }), 1000))
        );
      }
    }
  };

  render() {
    return (
      <div>
        <Header />
        <div className="clock">
          <SetTimer
            type="break"
            value={this.state.breakValue}
            handleClick={this.handleSetTime}
          />
          <SetTimer
            type="session"
            value={this.state.sessionValue}
            handleClick={this.handleSetTime}
          />
        </div>
        <Timer
          title={this.state.title}
          time={moment(this.state.time).format('mm:ss')}
        />
        <Controls
          running={this.state.running}
          handleStartStop={this.handleStartStop}
          handleReset={this.handleReset}
        />
        <audio 
          id='beep'
          src='https://onlineclock.net/audio/options/cuckoo-clock.mp3'
          ref={ref => this.audio = ref}>
        </audio>
      </div>
    );
  }
}

export default Clock;
