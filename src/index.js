import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import "./styles.css";
import { makeStyles } from "@material-ui/core/styles";
import {
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar
} from "@material-ui/core";
import ImageIcon from "@material-ui/icons/Image";
import WorkIcon from "@material-ui/icons/Work";
import BeachAccessIcon from "@material-ui/icons/BeachAccess";
import Divider from "@material-ui/core/Divider";
import moment from "moment";
import { usePosition } from "use-position";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import { Alert, AlertTitle } from "@material-ui/lab";

const axios = require("axios");

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    maxWidth: 360,
    backgroundColor: theme.palette.background.paper
  },
  paper: {
    height: 80,
    width: 330
  },
  control: {
    padding: theme.spacing(2)
  }
}));

const apikey = "48b776f6304fe46affed4a39f0a595ac";
const url = "https://api.openweathermap.org/data/2.5/onecall";

function WashingDay(props) {
  const classes = useStyles();
  const watch = true;
  const { latitude, longitude, timestamp, accuracy, error } = usePosition(
    watch
  );

  let [weather, setWeather] = useState([]);
  useEffect(() => {
    var sortable = [];
    if (weather.length > 0) {
      for (var weath in weather) {
        sortable.push([weath, weather[weath]]);
    }
    }
  }, []);
  let [data, setData] = useState([]);
  useEffect(() => {
    axios
      .get(
        `${url}?lat=${latitude}&lon=${longitude}&exclude=hourly&appid=${apikey}`
      )
      .then(function (response) {
        // handle success
        //console.log(response.data.daily);
        setData(response.data.daily);
        setWeather(
          response.data.daily
            .map((dat) => dat.weather[0].main)
            .reduce((acc, val) => {
              acc[val] = acc[val] === undefined ? 1 : (acc[val] += 1);
              return acc;
            }, {})
        );
        // setData(response.data);
        // console.log(data);
      })
      .catch(function (error) {
        // handle error
        console.log("error: ", error);
      })
      .then(function () {
        // always executeconsole.log(url2)d
      });
  }, [latitude, longitude]);

  return (
    <div className="App">
      <Grid container spacing={6} alignItems="center">
        <Grid item xs={6}>
          <List className={classes.root}>
            {data.map((dat) => (
              <div>
                <ListItem>
                  <ListItemAvatar>
                    <Avatar>
                      <ImageIcon />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={dat.weather[0].main}
                    secondary={moment.unix(dat.dt).utc().format("LL")}
                  />
                </ListItem>
                <Divider variant="inset" component="li" />
              </div>
            ))}
          </List>
        </Grid>
        <Grid item xs={6}>
          <Paper className={classes.paper}>
            <Alert severity="error">
              <AlertTitle>NO</AlertTitle>
              We recommend — <strong>not to wash!</strong>
            </Alert>
          </Paper>
        </Grid>
      </Grid>
    </div>
  );
}

const rootElement = document.getElementById("root");
ReactDOM.render(<WashingDay />, rootElement);
