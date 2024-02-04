import React, { useEffect, useState } from 'react';
import { Card, Icon, Image, Input, List, Label} from 'semantic-ui-react'
import '../App.scss';


const PokemonCard = () => {

  const [query, setQuery] = useState("");
  const [data, setData] = useState({})
  const [error, setError] = useState(null);
  const statNames = ["hp", "attack", "defense", "special-attack", "special-defense", "speed"];
  const [showError, setShowError] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    
  }

  let base = "https://pokeapi.co/api/v2"
  let pokemon_pt = "pokemon"
  let type_pt = "type"
  var api = `${base}/${pokemon_pt}/${query}`

  const errorTag = document.getElementById("errorLabel");


  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch(api);
        if (!response.ok) {
          setShowError(!showError);
          errorTag.style.display ='flex';
        }
        const jsonData = await response.json();
        setData(jsonData);
        setShowError(!showError);
        errorTag.style.display ='none';
       
      } catch (error) {
        setError(error.message);

      }
    }

    fetchData();
  }, [api]);



  return (
    <Card>

    <form onSubmit = {handleSubmit}>
     <Input fluid
       icon={<Icon name='search' inverted circular link />}
       placeholder='Search for Pokemon...'
       value = {query}
       onChange={(event) => setQuery(event.target.value)}

     />

    </form>

    
      <div class="ui card">
     
      <div class="image">
       <img src={data.sprites?.front_default}/>
      </div>
       
      <div class="content">

         <h class="header">{data.name}</h>
        
      <div class="description">
  
          <div class = "ui relaxed divided list">
          <div>
            
          {
        data.stats?.map((stat, i) =>
        <List.Item key = {i} >

          <div class = "item">
              <h class={statNames[i]}>{statNames[i]}: {stat.base_stat}</h>
           </div>

        </List.Item>
      
        )
      }

          </div> 
          </div>    
      </div>



       </div>

        <div class="extra content">
        {data.types?.map(type => (
          <div class="ui label" key={type.slot}>
            {type.type.name}
          </div>
        ))}
      </div>

      <a id = "errorLabel" class="ui grey label">No Pokemon Found</a>
      </div>

    </Card>
    
   
    );
}
const PokemonCardPage = () => {


  return (
   
    <div class="CenteredLayout">
      <div>
        
        <PokemonCard>
        </PokemonCard>
      </div>

     
    </div>

    
    
  );
};
  
export default PokemonCardPage;
