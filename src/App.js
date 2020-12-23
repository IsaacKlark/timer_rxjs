import './App.css';
import { useRef, useState, useEffect } from 'react';
import { interval } from 'rxjs';

function App() {
  const [timerStart, setTimerStart] = useState(false);
  const [time, setTime] = useState(0);
  const hoursDom = useRef(null);
  const minutesDom = useRef(null);
  const secundsDom = useRef(null);

  const source = interval(100);
  let subscribeTimer;
  let timeMemory = 0;

  const subscribeFunc = () => {
    subscribeTimer = source.subscribe(val => {
      let timeSum = 0;
      let hours = 0;
      let minutes = 0;
      let secunds = 0;

      if (val % 10 === 0) {
        timeSum += (val / 10) + time;
        hours = Math.trunc(timeSum / 3600);
        minutes = Math.trunc(timeSum / 60);
        secunds = timeSum;
        timeMemory = timeSum;

        while (minutes >= 60) {
          minutes -= 60;
        }

        while (secunds >= 60) {
          secunds -= 60;
        }

        if (secundsDom) secundsDom.current.innerHTML = secunds < 10 ? `0${secunds}` : secunds;
        if (minutesDom) minutesDom.current.innerHTML = minutes < 10 ? `0${minutes}:` : minutes + ":";
        if (hoursDom) hoursDom.current.innerHTML = hours < 10 ? `0${hours}:` : hours + ":";
      }
    })
  }

  useEffect(() => {
    if (timerStart) subscribeFunc();
  })

  const startStopButtonClicked = () => {
    if (subscribeTimer) subscribeTimer.unsubscribe();

    if (timerStart) {
      setTime(0);
      secundsDom.current.innerHTML = "00";
      minutesDom.current.innerHTML = "00:";
      hoursDom.current.innerHTML = "00:";
    }

    setTimerStart(!timerStart);
  }

  const resetClick = () => {
    if (subscribeTimer) subscribeTimer.unsubscribe();
    if (subscribeTimer && time) setTime(0);
    if (!time) subscribeFunc();
  }

  let redyToDoubleClick = false;

  const waitClick = () => {
    if (!redyToDoubleClick) {
      redyToDoubleClick = true;

      setTimeout(() => {
        redyToDoubleClick = false;
      }, 300);

      return;
    }

    if (subscribeTimer) subscribeTimer.unsubscribe();

    if (timerStart) setTime(timeMemory);
    setTimerStart(false);
  }

  return (
    <div className="App">
      <div className="timer">
        <div className="display">
          <p className="time" ref={hoursDom}>00:</p>
          <p className="time" ref={minutesDom}>00:</p>
          <p className="time" ref={secundsDom}>00</p>
        </div>

        <div className="buttonsWrapper">
          <button type="button" className="start" onClick={startStopButtonClicked}>
            {timerStart ? "Stop" : "Start"}
          </button>
          <button type="button" className="wait" onClick={resetClick}>
            Reset
          </button>
          <button type="button" className="wait" onClick={waitClick}>
            Wait
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
