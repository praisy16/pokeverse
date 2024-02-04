

import React, { useEffect, useState } from 'react';
import { List, Segment, Button, Header, Label, Divider, Statistic} from 'semantic-ui-react';
import '../App.scss';



export const GPSViewer = () => {
  const student = "Praisy Daniel";
  const googleaApiKey = "AIzaSyBJcm2icY4Izt-A3PpDqDM0210fTtCkdtM";
 
  // TODO
  const [coords, setCoords] = useState({ latitude: 0, longitude: 0 });
  const [logs, setLogs] = useState([]);
  const [count, setCount] = useState(0);
  const initial = "XXXX";
  const [log1, setLat] = useState(initial);
  const [log2, setLong] = useState(initial);

  useEffect(() => {
    const geoId = navigator.geolocation.watchPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setCoords({ latitude, longitude });
      },
      (error) => console.log(error),
      { enableHighAccuracy: true }
    );
    return () => navigator.geolocation.clearWatch(geoId);
  }, []);

  const handleLogCoords = () => {
  
    const noLog = document.getElementById("noLogs") ;
    noLog.style.display = "none";
    const newLog = {
      lat: coords.latitude.toFixed(2),
      lng: coords.longitude.toFixed(2)
    };
    setCount(count + 1);
    setLat(coords.latitude.toFixed(2));
    setLong(coords.longitude.toFixed(2));
  };


  return (
    <div className="CenteredLayout">
      <Segment>
        <div className="VerticalColumn">
        <Header as="h2">{student}</Header>
          <Statistic>
            <Statistic.Value id = "latitude ">{coords.latitude.toFixed(2)}</Statistic.Value>
            <Statistic.Label id = "longitude">Latitude</Statistic.Label>
          </Statistic>
          <br/>
          <Statistic>
            <Statistic.Value id = "latitude">{coords.longitude.toFixed(2)}</Statistic.Value>
            <Statistic.Label id = "longitude">Longitude</Statistic.Label>
          </Statistic>
        </div>



        <Header as="h3" dividing>Logged Points</Header>
        <p id = "noLogs"> No logs </p>

        


        <List>
          <List.Item>
              <List.Content id = "loggedLatitude" floated='right'>{log1}</List.Content>
              <List.Content>Latitude</List.Content>
              <List.Content id = "loggedLongitude" floated='right'>{log2}</List.Content>
              <List.Content>Longitude</List.Content>
          </List.Item>


         

        </List>
  



        
        <Divider></Divider>
        <Button onClick = {handleLogCoords} primary fluid> 
          <span className="badge-button">LOG</span>
          <Label circular color='blue' as='a'>{count}</Label>
        </Button>
      </Segment>
    </div>
  );
};


export default GPSViewer;