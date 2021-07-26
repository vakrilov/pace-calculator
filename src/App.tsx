import {
  createStyles,
  TextField,
  makeStyles,
  IconButton,
  Theme,
  createTheme,
  ThemeProvider,
} from "@material-ui/core";
import { ToggleButton, ToggleButtonGroup } from "@material-ui/lab";
import InputMask from "react-input-mask";
import React from "react";
import AddIcon from "@material-ui/icons/Add";
import RemoveIcon from "@material-ui/icons/Remove";

import "./App.scss";
import RoundSlider from "./RoundSlider";

const minSpeed = 10 * 60;
const maxSpeed = 2 * 60;
const defaultSpeed = 5 * 60;
const defaultDist = 5;

const distanceMarks = [
  // { value: 0.4, label: "400m" },
  // { value: 0.8, label: "800m" },
  { value: 1, label: "1km" },
  // { value: 1.6, label: "1mi" },
  { value: 5, label: "5k" },
  { value: 10, label: "10k" },
  { value: 21.1, label: "1/2 M" },
  { value: 42.2, label: "M" },
];

const twoDigit = (str: number) => str.toString().padStart(2, "0");

const strToDist = (str: string): number => (str === "" ? 0 : Number(str));
const distToStr = (val: number): string => val.toFixed(2).padStart(5, "0");

const formatSpeed = (val: number) => {
  const ms = Math.round((val * 100) % 100);
  const secs = Math.floor(val % 60);
  const mins = Math.floor(val / 60);

  return {
    mins: mins.toString(),
    secs: twoDigit(secs),
    ms: twoDigit(ms),
    metric: "min/km",
  };
};

const formatTime = (time: number) => {
  time = Math.round(time);
  const secs = time % 60;
  const mins = Math.floor(time / 60) % 60;
  const hours = Math.floor(time / 3600);

  return {
    hours: hours + "",
    mins: hours ? twoDigit(mins) : mins.toString(),
    secs: twoDigit(secs),
  };
};

const theme = createTheme({
  typography: {
    fontFamily: ["Titillium Web", "sans-serif"].join(","),
  },
});

const inputAttrs = { inputMode: "decimal" };
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    input: {
      marginTop: "12px",
      width: 80,
      "& input": {
        textAlign: "right",
        fontSize: "32px",
      },
    },
    distToggle: {
      width: 60,
    },
  })
);

const getTimeStep = (dist: number) => {
  if (dist < 10) return 5;
  if (dist < 25) return 10;
  return 30;
};
const round2 = (num: number) => Math.round(num * 100) / 100;

function App() {
  const classes = useStyles();
  const [speed, setSpeed] = React.useState<number>(defaultSpeed); // in seconds per KM
  const [dist, setDist] = React.useState<number>(defaultDist);
  const time = speed * dist;

  const goUp = () => {
    const changeSpeed = Math.floor(speed + 1);

    const timeStep = getTimeStep(dist);
    const changeTime = (Math.floor(round2(time) / timeStep) + 1) * timeStep;

    setSpeed(Math.min(changeSpeed, changeTime / dist));
  };

  const goDown = () => {
    const changeSpeed = Math.ceil(speed - 1);

    const timeStep = getTimeStep(dist);
    const changeTime = (Math.ceil(round2(time) / timeStep) - 1) * timeStep;

    setSpeed(Math.max(changeSpeed, changeTime / dist));
  };

  const timeFmt = formatTime(time);
  const speedFmt = formatSpeed(speed);

  return (
    <ThemeProvider theme={theme}>
      <div className="App">
        <h1 className="header">Distance</h1>

        <ToggleButtonGroup
          value={dist}
          exclusive
          onChange={(event: any, value: any) => setDist(Number(value))}
        >
          {distanceMarks.map(({ value, label }) => (
            <ToggleButton
              key={value}
              value={value}
              aria-label={label}
              size="small"
              className={classes.distToggle}
            >
              {label}
            </ToggleButton>
          ))}
        </ToggleButtonGroup>

        <InputMask
          value={distToStr(dist)}
          mask="99.99"
          maskChar="0"
          className={classes.input}
          onChange={(event) => setDist(strToDist(event.target.value))}
        >
          {(inputProps: any) => (
            <TextField size="small" {...inputProps} inputProps={inputAttrs} />
          )}
        </InputMask>

        <h1 className="header">Pace and Time</h1>

        <div className="pace-time">
          <div className="pace-time-slider">
            <RoundSlider
              sliderType="min-range"
              update={(e: { value: any }) => setSpeed(Number(e.value))}
              value={speed}
              startAngle="320"
              endAngle="220"
              radius="160"
              width="6"
              handleSize="+24"
              animation="false"
              min={maxSpeed}
              max={minSpeed}
              step="1"
              lineCap="round"
              borderWidth="0"
              rangeColor="#3F51B5"
              pathColor="#B7BDE3"
              showTooltip="false"
            />
          </div>

          <div className="pace-time-inputs">
            <div>
              {timeFmt.hours !== "0" && (
                <>
                  <span className="digit">{timeFmt.hours}</span>
                  <span className="metric">h </span>
                </>
              )}
              <span className="digit">{timeFmt.mins}</span>
              <span className="metric">m </span>
              <span className="digit">{timeFmt.secs}</span>
              <span className="metric">s</span>
            </div>
            <span className="metric">with</span>
            <div>
              <span className="digit">{speedFmt.mins}</span>
              <span className="metric">m </span>
              <span className="digit">{speedFmt.secs}</span>
              <span className="metric">s</span>
            </div>
          </div>

          <div className="go-faster">
            <IconButton onClick={goDown}>
              <AddIcon />
            </IconButton>
          </div>
          <div className="go-slower">
            <IconButton onClick={goUp}>
              <RemoveIcon />
            </IconButton>
          </div>

          <div className="slow">slow</div>
          <div className="fast">fast</div>
        </div>
      </div>
    </ThemeProvider>
  );
}

export default App;
