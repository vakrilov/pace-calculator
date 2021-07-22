import {
  createStyles,
  TextField,
  makeStyles,
  Theme,
  Typography,
} from "@material-ui/core";
import { ToggleButton, ToggleButtonGroup } from "@material-ui/lab";
import InputMask from "react-input-mask";
import React from "react";

import "./App.css";
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

const strToSpeed = (str: string): number => {
  const [mins, secs] = str.split(":");
  return Number(mins) * 60 + Number(secs);
};
const speedToStr = (val: number): string => {
  const secs = val % 60;
  const mins = Math.floor(val / 60);
  return `${twoDigit(mins)}:${twoDigit(secs)}`;
};

const timeToStr = (time: number): string => {
  time = Math.round(time);
  const secs = time % 60;
  const mins = Math.floor(time / 60) % 60;
  const hours = Math.floor(time / 3600);

  return `${twoDigit(hours)}:${twoDigit(mins)}:${twoDigit(secs)}}`;
};
const strToTime = (str: string): number => {
  const [hours, mins, secs] = str.split(":");
  return Number(hours) * 3600 + Number(mins) * 60 + Number(secs);
};

const inputAttrs = { inputMode: "decimal" };
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    input: {
      width: 120,
      "& input": {
        textAlign: "right",
        fontSize: "30px",
      },
    },
    distToggle: {
      width: 60,
    },
  })
);

function App() {
  const classes = useStyles();
  const [speed, setSpeed] = React.useState<number>(defaultSpeed); // in seconds per KM
  const [dist, setDist] = React.useState<number>(defaultDist);
  const time = speed * dist;

  const PaceInput = () => (
    <InputMask
      value={speedToStr(speed)}
      mask="99:99"
      maskChar="0"
      className={classes.input}
      onChange={(event) => setSpeed(strToSpeed(event.target.value))}
    >
      {(inputProps: any) => (
        <TextField {...inputProps} inputProps={inputAttrs} />
      )}
    </InputMask>
  );

  const TimeInput = () => (
    <InputMask
      value={timeToStr(time)}
      mask="99:99:99"
      maskChar="0"
      className={classes.input}
      onChange={(event) => setSpeed(strToTime(event.target.value) / dist)}
    >
      {(inputProps: any) => (
        <TextField {...inputProps} inputProps={inputAttrs} />
      )}
    </InputMask>
  );

  return (
    <div className="App">
      <Typography variant="h5">Distance</Typography>
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
          <TextField
            variant="outlined"
            size="small"
            {...inputProps}
            inputProps={inputAttrs}
          />
        )}
      </InputMask>

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
          <PaceInput />
          <TimeInput />
        </div>
      </div>
    </div>
  );
}

export default App;
