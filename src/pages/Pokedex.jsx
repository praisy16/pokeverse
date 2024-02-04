
import React, { useEffect, useState } from 'react';
import { Loader } from '@googlemaps/js-api-loader';
import { Header, Container, List, Item } from 'semantic-ui-react';
import '../App.scss';



async function resolvePokemonAPI(id) {
  const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
  const data = await response.json();
  const name = data.name;
  const sprite = data.sprites.front_default;
  return { name, sprite };
}


const Pokedex = () => {
  
  //current gps coordinates 
  const [origin, setOrigin] = useState({ latitude: 0, longitude: 0 });
  
  
  //sightings state that holds the objects
  const [sightings, setSightings] = useState([]);

  const [pokemonDetails, setPokemonDetails] = useState({});
  

 
 
  const APIKEY = "AIzaSyBJcm2icY4Izt-A3PpDqDM0210fTtCkdtM"; // will remain active until 5/1/2023
  
  
  useEffect(() => {
    const geoId = navigator.geolocation.watchPosition(
      (location) => {
        const { latitude, longitude } = location.coords;
        setOrigin({ latitude, longitude });
      },
      (error) => console.log(error),
      { enableHighAccuracy: true }
    );
    return () => navigator.geolocation.clearWatch(geoId);
  }, []);




 
//calls the API point to return sightings data 

 var api = 'https://hybridatelier.uta.edu/api/pokemon_sightings';

 useEffect(() => {
  const fetchSightings = async () => {
    try {
      const response = await fetch(api);
      const data = await response.json();
      setSightings(data);
      console.log('Sightings:', data);
    } catch (error) {
      console.error(error);
    }
  };

  fetchSightings();
}, []);



useEffect(() => {
  // fetch the Pokémon details for each sighting
  async function fetchPokemonDetails() {
    const newPokemonDetails = {};
    for (const sighting of sightings) {
      const pokemonId = sighting.pokemon;
      if (!(pokemonId in pokemonDetails)) {
        const { name, sprite } = await resolvePokemonAPI(pokemonId);
        newPokemonDetails[pokemonId] = { name, sprite };
      }
    }
    setPokemonDetails(prevPokemonDetails => ({ ...prevPokemonDetails, ...newPokemonDetails }));
  }
  fetchPokemonDetails().catch(error => console.error(error));
}, [sightings]);


  const loader = new Loader({
    apiKey: APIKEY,
    version: "weekly",
    libraries: ["places"]
  });

  useEffect(()=>{
    loader
      .load()  
      .then((google)=>{
        const service = new google.maps.DistanceMatrixService();
        const destinations = sightings.map((sighting) => {
          const [lat, lng] = sighting.coord.replace("@", "").split(",");
          return new google.maps.LatLng(lat, lng);
        });
        const origins = [new google.maps.LatLng(origin.latitude, origin.longitude)];
        service.getDistanceMatrix(
          {
            origins,
            destinations,
            travelMode: google.maps.TravelMode.DRIVING,
            unitSystem: google.maps.UnitSystem.METRIC,
            avoidHighways: false,
            avoidTolls: false

          },
          (response, status) => {
            if (status === "OK") {
              const newSightings = response.rows[0].elements.map((element, index) => {
                const distance = element.distance.text;
                return {
                  ...sightings[index],
                  distance,
                };
              });
              setSightings(newSightings);
            } else {
              console.error(`Error: ${status}`);
            }
          }
        );
      })
      .catch(console.error)
    }, [origin])




  return (

    <Container id='pokedex'>
      <Header dividing as="h1"> Pokemon Sighting  </Header>
      <Header dividing as="h2"> Current Position </Header>
         

        <List>
          <List.Item>
              <List.Content floated='right'>{origin.latitude}</List.Content>
              <List.Content>Latitude</List.Content>
              <List.Content floated='right'>{origin.longitude}</List.Content>
              <List.Content>Longitude</List.Content>
          </List.Item>
        
        </List>
      <Header dividing as="h2">Sightings ({sightings.length})</Header>
     
      <Item.Group>
      {sightings.map((sighting, index) => {
        // extract the coordinates and Pokémon ID from the API data
        const coords1 = sighting.coord.replace('@', '');
        const lat = parseFloat(coords1.split(',')[0]).toFixed(2);
        const coords2 = coords1.split(',')[1];
        const lng = parseFloat(coords2.split(',')[0]).toFixed(2);
        const pokemonId = sighting.pokemon;

        // get the Pokémon details from the state
        const pokemonName = pokemonDetails[pokemonId]?.name;
        const pokemonSprite = pokemonDetails[pokemonId]?.sprite;

        return (
          <Item key={index}>
            <Item.Image src={pokemonSprite} alt={pokemonName} />
            <Item.Content>
              <Item.Header>{pokemonName}</Item.Header>
              <Item.Description>
                <List>
                  <List.Item>{`${sighting.distance} Away`}</List.Item>
                  <List.Item>{`${lat}º, ${lng}º`}</List.Item>
                </List>
              </Item.Description>
            </Item.Content>
          </Item>
        );
      })}
    </Item.Group>

    </Container>


  );
};
{/* <TableCell>

</TableCell> */}
export default Pokedex;