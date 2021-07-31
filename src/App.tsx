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

const mileToKm = 1.609344;

const minSpeed = 10 * 60;
const maxSpeed = 2 * 60;
const defaultSpeed = 5 * 60;
const defaultDist = 5;

const distanceMarks = [
  { value: mileToKm, label: "1mi" },
  { value: 5, label: "5k" },
  { value: 10, label: "10k" },
  { value: 21.1, label: "1/2 M" },
  { value: 42.2, label: "M" },
];

const twoDigit = (str: number) => str.toFixed(0).padStart(2, "0");

const strToDist = (str: string, unit: DistanceUnit): number => {
  let result = defaultDist;
  if (str) {
    result = Number(str);
  }

  return unit === "mi" ? result * mileToKm : result;
};

const distToStr = (val: number, unit: DistanceUnit): string => {
  val = unit === "mi" ? val / mileToKm : val;

  return val.toFixed(2).padStart(5, "0");
};

const formatSpeed = (val: number, unit: DistanceUnit) => {
  val *= unit === "mi" ? mileToKm : 1;
  val = Math.round(val * 100) / 100;

  const cent = (val * 100) % 100;
  const secs = Math.floor(val % 60);
  const mins = Math.floor(val / 60);

  return {
    mins: mins.toString(),
    secs: twoDigit(secs),
    cents: twoDigit(cent),
    unit: unit === "mi" ? "min/mi" : "min/km",
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
      width: 64,
      fontSize: "18px",
    },
    unitGroup: {
      verticalAlign: "bottom",
      marginLeft: "12px",
    },
    unitToggle: {
      width: 64,
      fontSize: "18px",
    },
  })
);

type DistanceUnit = "km" | "mi";

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
  const [unit, setUnit] = React.useState<DistanceUnit>("km");
  const time = speed * dist;

  const goUp = () => {
    let changeSpeed = 0;
    if (unit === "mi") {
      const speedInMiles = round2(speed * mileToKm);
      changeSpeed = Math.floor(speedInMiles + 1) / mileToKm;
    } else {
      changeSpeed = Math.floor(speed + 1);
    }

    const timeStep = getTimeStep(dist);
    const changeTime = (Math.floor(round2(time) / timeStep) + 1) * timeStep;

    setSpeed(Math.min(changeSpeed, changeTime / dist));
  };

  const goDown = () => {
    let changeSpeed = 0;
    if (unit === "mi") {
      const speedInMiles = round2(speed * mileToKm);
      changeSpeed = Math.ceil(speedInMiles - 1) / mileToKm;
    } else {
      changeSpeed = Math.ceil(speed - 1);
    }

    const timeStep = getTimeStep(dist);
    const changeTime = (Math.ceil(round2(time) / timeStep) - 1) * timeStep;

    setSpeed(Math.max(changeSpeed, changeTime / dist));
  };

  const timeFmt = formatTime(time);
  const speedFmt = formatSpeed(speed, unit);

  return (
    <ThemeProvider theme={theme}>
      <div className="App">
        <h1 className="header">Distance</h1>

        <ToggleButtonGroup
          value={dist}
          defaultValue={defaultDist}
          exclusive
          onChange={(event: any, value: any) => value && setDist(Number(value))}
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

        <div>
          <InputMask
            value={distToStr(dist, unit)}
            mask="99.99"
            maskChar="0"
            className={classes.input}
            onChange={(event) => setDist(strToDist(event.target.value, unit))}
          >
            {(inputProps: any) => (
              <TextField size="small" {...inputProps} inputProps={inputAttrs} />
            )}
          </InputMask>

          <ToggleButtonGroup
            value={unit}
            defaultValue="km"
            exclusive
            className={classes.unitGroup}
            onChange={(event: any, value: any) => value && setUnit(value)}
          >
            <ToggleButton
              value="km"
              aria-label="km"
              size="small"
              className={classes.unitToggle}
            >
              km
            </ToggleButton>
            <ToggleButton
              value="mi"
              aria-label="mile"
              size="small"
              className={classes.unitToggle}
            >
              mile
            </ToggleButton>
          </ToggleButtonGroup>
        </div>

        <h1 className="header">Pace and Time</h1>

        <div className="pace-time">
          <div className="pace-time-slider">
            {/* use negative values to "reverse" the slider */}
            <RoundSlider
              sliderType="min-range"
              update={(e: { value: any }) => setSpeed(-Number(e.value))}
              value={-speed}
              startAngle="140"
              endAngle="40"
              radius="160"
              width="6"
              handleSize="36"
              animation="false"
              min={-minSpeed}
              max={-maxSpeed}
              step="1"
              lineCap="round"
              borderWidth="0"
              rangeColor="#B7BDE3"
              pathColor="#3F51B5"
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
              <span className="digit">:</span>
              <span className="digit">{speedFmt.secs}</span>
              <sup className="metric">{speedFmt.cents}</sup>
              <span className="metric"> {speedFmt.unit}</span>
            </div>
          </div>

          <div className="go-faster">
            <IconButton onClick={goDown} color="primary">
              <RemoveIcon />
            </IconButton>
          </div>
          <div className="go-slower">
            <IconButton onClick={goUp} color="primary">
              <AddIcon />
            </IconButton>
          </div>

          <div className="slow">slow</div>
          <div className="fast">fast</div>
        </div>
        <div id="copyright">© 2021 Alexander Vakrilov</div>
      </div>
    </ThemeProvider>
  );
}

export default App;
