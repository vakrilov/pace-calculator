import { Grid, Input, makeStyles, Slider, Typography } from "@material-ui/core";
import React from "react";

import "./App.css";

const minSpeed = 10 * 60;
const maxSpeed = 2 * 60;
const defaultSpeed = 5 * 60;

const minDist = 1;
const maxDist = 50;
const defaultDist = 5;

const minTime = 60;
const maxTime = 10 * 60 * 60;

const useStyles = makeStyles({
  root: {
    width: 250,
  },
  input: {
    width: 42,
  },
});

function App() {
  const classes = useStyles();

  const [speed, setSpeed] = React.useState<number>(defaultSpeed); // in seconds per KM
  const [dist, setDist] = React.useState<number>(defaultDist);
  const time = speed * dist;

  const handleDistSliderChange = (event: any, newValue: any) => {
    setDist(Number(newValue));
  };

  const handleDistInputChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setDist(event.target.value === "" ? 0 : Number(event.target.value));
  };

  const handleDistBlur = () => {
    //TODO Validate
  };

  const handleSpeedSliderChange = (event: any, newValue: any) => {
    setSpeed(Number(newValue));
  };

  const handleSpeedInputChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setSpeed(event.target.value === "" ? 0 : Number(event.target.value));
  };

  const handleSpeedBlur = () => {
    //TODO Validate
  };

  const handleTimeSliderChange = (event: any, newValue: any) => {
    const newTime = Number(newValue);
    setSpeed(newTime / dist);
  };

  const handleTimeInputChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const newTime = event.target.value === "" ? 0 : Number(event.target.value);
    setSpeed(newTime / dist);
  };

  const handleTimeBlur = () => {
    //TODO Validate
  };

  return (
    <div className="App">
      <div>
        <Typography id="dist-slider" gutterBottom>
          Distance
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs>
            <Slider
              min={minDist}
              max={maxDist}
              value={dist}
              onChange={handleDistSliderChange}
              aria-labelledby="dist-slider"
            />
          </Grid>
          <Grid item>
            <Input
              className={classes.input}
              value={dist}
              margin="dense"
              onChange={handleDistInputChange}
              onBlur={handleDistBlur}
              inputProps={{
                step: 1,
                min: { minDist },
                max: { maxDist },
                type: "number",
                "aria-labelledby": "dist-slider",
              }}
            />
          </Grid>
        </Grid>
      </div>
      <div>
        <Typography id="speed-slider" gutterBottom>
          Speed
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs>
            <Slider
              min={maxSpeed}
              max={minSpeed}
              value={speed}
              onChange={handleSpeedSliderChange}
              aria-labelledby="speed-slider"
            />
          </Grid>
          <Grid item>
            <Input
              className={classes.input}
              value={speed}
              margin="dense"
              onChange={handleSpeedInputChange}
              onBlur={handleSpeedBlur}
              inputProps={{
                step: 1,
                min: { maxSpeed },
                max: { minSpeed },
                type: "number",
                "aria-labelledby": "speed-slider",
              }}
            />
          </Grid>
        </Grid>
      </div>
      <div>
        <Typography id="time-slider" gutterBottom>
          Time
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs>
            <Slider
              min={minTime}
              max={maxTime}
              value={time}
              onChange={handleTimeSliderChange}
              aria-labelledby="time-slider"
            />
          </Grid>
          <Grid item>
            <Input
              className={classes.input}
              value={time}
              margin="dense"
              onChange={handleTimeInputChange}
              onBlur={handleTimeBlur}
              inputProps={{
                step: 1,
                min: { maxSpeed },
                max: { minSpeed },
                type: "number",
                "aria-labelledby": "time-slider",
              }}
            />
          </Grid>
        </Grid>
      </div>
    </div>
  );
}

export default App;
