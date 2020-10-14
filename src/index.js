import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import "./styles.css";
import { makeStyles } from "@material-ui/core/styles";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import Avatar from "@material-ui/core/Avatar";
import ImageIcon from "@material-ui/icons/Image";
import WorkIcon from "@material-ui/icons/Work";
import BeachAccessIcon from "@material-ui/icons/BeachAccess";
import Divider from "@material-ui/core/Divider";
import moment from "moment";
const axios = require("axios");

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    maxWidth: 360,
    backgroundColor: theme.palette.background.paper
  }
}));

const apikey = "48b776f6304fe46affed4a39f0a595ac";
const url = "https://api.openweathermap.org/data/2.5/onecall";

function LightBulb() {
  const classes = useStyles();
  let [lat, setLat] = useState(0.0);
  let [long, setLong] = useState(0.0);

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition((position) => {
      console.log(position.coords.latitude, position.coords.longitude);
      setLat(position.coords.latitude);
      setLong(position.coords.longitud);
    });
  }

  let [data, setData] = useState([]);
  useEffect(() => {
    axios
      .get(`${url}?lat=${lat}&lon=${long}&exclude=hourly&appid=${apikey}`)
      .then(function (response) {
        // handle success
        console.log(response);
        setData(response.data.daily);
        // setData(response.data);
        // console.log(data);
      })
      .catch(function (error) {
        // handle error
        console.log("error: ", error);
      })
      .then(function () {
        // always executeconsole.log(url2)d
        console.log("alwa");
      });
  }, [lat, long]);

  return (
    <div className="App">
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
                secondary={moment
                  .unix(dat.dt)
                  .utc()
                  .format("YYYY-MM-DDTHH:mm:ssZ")}
              />
            </ListItem>
            <Divider variant="inset" component="li" />
          </div>
        ))}
      </List>
    </div>
  );
}

const rootElement = document.getElementById("root");
ReactDOM.render(<LightBulb />, rootElement);
