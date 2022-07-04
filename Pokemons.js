//* URI DE LA API: https://pokeapi.co/api/v2/

// MI ENDPOINT
const URI = 'https://pokeapi.co/api/v2/'

// LISTA DE TODOS LOS POKEMONS
const listPokemons = async() => {
  const pokemons = await fetch(URI + 'pokemon?limit=100000&offset=0')
    .then((response) => response.json())
    .then(data => data.results);
  const promises = [];
  pokemons.map((pokemon) => {
    promises.push(fetch(pokemon.url).then((data) => data.json()));
    // console.log(promises);
  })
  const pokemonsInfo = await Promise.all(promises).then(data => data);
  console.log(pokemonsInfo);
  return pokemonsInfo;
}

const card = (pokemon) => {
  let div = document.createElement('div');
  div.classList.add('flex', 'rounded-lg', 'shadow-lg', 'cursor-pointer', 'z-10', 'relative');

  let pokemonName = document.createElement('div');
  pokemonName.classList.add('pokemonName', 'flex', 'flex-col', 'justify-center', 'items-center', 'w-1/3', 'ml-4', 'z-10');
  let name = document.createElement('span');
  name.classList.add('text-2xl', 'text-white', 'font-semibold');
  name.innerHTML = pokemon.name;
  let id = document.createElement('span');
  id.classList.add('text-sm', 'text-white', 'font-semibold');
  id.innerHTML = '# ' + pokemon.id;

  pokemonName.append(name);
  pokemonName.append(id);
  
  for (let i = 0; i < pokemon.types.length; i++) {
    let type = document.createElement('span');
    type.classList.add('flex', 'border', 'shadow-lg', 'text-base', 'font-semibold', 'w-2/3', 'justify-center', 'items-center', 'mt-2', 'p-1', 'rounded-lg');
    type.innerHTML = pokemon.types[i].type.name;
    let typeColor = getColor(pokemon.types[i].type.name);
    let pokemonColor = getColor(pokemon.types[0].type.name);
    type.classList.add(typeColor);
    div.classList.add(pokemonColor);

    div.append(type);
    pokemonName.append(type);
  }
  div.addEventListener('click', () => openPopup(pokemon));
  
  let pokemonImage = document.createElement('div');
  pokemonImage.classList.add('pokemonImage', 'w-2/3', 'flex', 'justify-center', 'items-center', 'z-10');
  let img = document.createElement('img');
  img.classList.add('w-fit', 'm-2');
  img.setAttribute('src', pokemon.sprites.other["official-artwork"].front_default);
  
  pokemonImage.append(img);
  div.append(pokemonName, pokemonImage);

  let pokeBallImg = document.createElement('img');
  pokeBallImg.classList.add('pokeBall', 'absolute', 'z-0', 'left-16', 'top-1', 'w-2/3', 'opacity-30');
  pokeBallImg.setAttribute('src', './assets/pokeball.png')
  div.append(pokeBallImg);

  return div;
}

const pokemonNotFound = () => {
  let div = document.createElement('div');
  div.classList.add('flex', 'rounded-lg', 'shadow-lg', 'cursor-pointer', 'z-10', 'relative');

  let pokemonImage = document.createElement('div');
  pokemonImage.classList.add('pokemonImage', 'w-2/3', 'flex', 'justify-center', 'items-center', 'z-10');
  let img = document.createElement('img');
  img.classList.add('w-fit', 'm-2');
  img.setAttribute('src', './assets/whosThatPokemon.jpg');
  
  pokemonImage.append(img);
  div.append( pokemonImage);

  return div;
}

const findByName = async (name) => {
  let pokemonInfo = await fetch(URI + 'pokemon/' + name)
  if (pokemonInfo.status !== 200) {
    const container = document.getElementById('container');
    const newCard = pokemonNotFound();
    container.appendChild(newCard);
  } else{
    pokemonInfo = await pokemonInfo.json();
    const container = document.getElementById('containerPokemons');
    const newCard = card(pokemonInfo);
    container.appendChild(newCard);
  }
}

const findById = async (id) => {
  const pokemonInfo = await fetch(URI + 'pokemon/' + id)
  .then((response) => response.json())
  const container = document.getElementById('containerPokemons');
  const newCard = card(pokemonInfo);
  container.appendChild(newCard);
}

const findByType = async (type) => {
  const pokemons = await listPokemons();
  let searchingType = type;
  console.log('BUSQUEDA POR TIPO', searchingType);
  if (searchingType === '') {
    fillContainer(pokemons);
  } else {
    const pokemonsInfo = pokemons.filter(
      (pokemon) => pokemon.types.find(
        (type) => type.type.name === searchingType
        )
        );
        fillContainer(pokemonsInfo);
      }
      return pokemons
    }
    
    const fillContainer = (pokemonsInfo) => {
      // ref al div container
      const container = document.getElementById('containerPokemons');
      pokemonsInfo.map((pokemon) => {
        const newCard = card(pokemon);
        container.appendChild(newCard);
      })
    }
    
    const find = async () => {
      const filterBy = document.querySelector('#filterPokemonsBy').value;
      const filterValue = document.querySelector('#filterValue').value.toLowerCase();
      const filterType = document.querySelector('#filterType').value;
      const container = document.getElementById('containerPokemons');
      container.innerHTML = null;
      switch (filterBy) {
        case 'name':
          findByName(filterValue);
          break;
          case 'id':
            findById(filterValue);
            break;
            case 'type':
              findByType(filterType);
              break;
              default:
                const pokemons = await listPokemons();
                fillContainer(pokemons);
                break;
              }
            }
            
            const openPopup = (pokemon) => {
              console.log('POKEMON',pokemon);
              const popUp = document.querySelector('#popup');
              popUp.classList.remove('hidden');
              
              const modalPokemonCard = document.querySelector('#modalCard');
              modalPokemonCard.innerHTML = null;
              const timesIconContainer = document.createElement('div');
              timesIconContainer.classList.add('flex', 'justify-end');
              const timesIcon = document.createElement('i');
              timesIcon.classList.add('fa-solid', 'fa-xmark', 'cursor-pointer');
              timesIcon.addEventListener('click', closePopup);
              timesIconContainer.append(timesIcon);
  modalPokemonCard.append(timesIconContainer);
  let modalPokemonName = document.createElement('div');
  modalPokemonName.classList.add('modalPokemonName', 'flex', 'justify-between', 'm-2');

  modalPokemonCard.append(modalPokemonName);

  let name = document.createElement('span');
  name.classList.add('text-2xl', 'text-white', 'font-semibold');
  name.innerHTML = pokemon.name;
  let number = document.createElement('span');
  number.classList.add('text-sm', 'text-white', 'font-semibold');
  number.innerHTML = '# ' + pokemon.id;

  modalPokemonName.append(name, number);

  const types = document.createElement('div');
  types.classList.add('types', 'flex', 'space-x-4', 'z-20');

  modalPokemonCard.append(types);

  for (let i = 0; i < pokemon.types.length; i++) {
    let type = document.createElement('span');
    type.classList.add('flex', 'border', 'shadow-lg', 'text-base', 'font-semibold', 'w-1/3', 'justify-center', 'items-center', 'mt-2', 'p-1', 'rounded-lg');
    type.innerHTML = pokemon.types[i].type.name;
    let typeColor = getColor(pokemon.types[i].type.name);
    type.classList.add(typeColor);

    const cardColor = document.querySelector('#modalCard')
    let pokemonColor = getColor(pokemon.types[0].type.name);
    cardColor.classList = [];
    cardColor.classList.add('modalCard', 'sm:w-3/6', 'lg:w-1/4', 'pb-5', 'rounded-lg', 'p-2', 'flex', 'flex-col', 'absolute', pokemonColor);

    types.append(type);
  }

  let pokemonImage = document.createElement('div');
  pokemonImage.classList.add('pokemonImage', 'flex', 'flex-col', 'items-center', 'relative');
  let img = document.createElement('img');
  img.classList.add('w-1/2', 'z-20');
  img.setAttribute('src', pokemon.sprites.other["official-artwork"].front_default);

  pokemonImage.append(img);
  modalPokemonCard.append(pokemonImage);

  let pokeBallImg = document.createElement('img');
  pokeBallImg.classList.add('pokeBall', 'absolute', 'z-0', '-top-16', 'w-2/3', 'opacity-30');
  pokeBallImg.setAttribute('src', './assets/pokeball.png')
  pokemonImage.append(pokeBallImg);

  let pokemonInfo = document.createElement('div');
  pokemonInfo.classList.add('pokemonInfo', 'border', 'bg-white', 'shadow-lg', '-mt-10', 'rounded-lg', 'w-11/12', 'self-center', 'h-7/12', 'z-10');

  modalPokemonCard.append(pokemonInfo);

  let infoSections = document.createElement('div');
  infoSections.classList.add('infoSections','flex', 'space-x-4', 'ml-5', 'mt-6', 'z-20')
  let aboutPokemon = document.createElement('span');
  aboutPokemon.classList.add('aboutPokemon','text-black', 'cursor-pointer', 'bg-gray-300', 'p-1', 'rounded-t-lg');
  aboutPokemon.innerHTML = 'About';
  aboutPokemon.addEventListener('click', showAboutInfo);
  let pokemonStats = document.createElement('span');
  pokemonStats.classList.add('pokemonStats','text-black', 'cursor-pointer', 'p-1', 'rounded-t-lg');
  pokemonStats.innerHTML = 'Base Stats';
  pokemonStats.addEventListener('click', showStatsInfo);

  pokemonInfo.append(infoSections);
  infoSections.append(aboutPokemon, pokemonStats);

  let infoContainer = document.createElement('div');
  infoContainer.classList.add('infoContainer','flex', 'ml-2', 'mb-2', 'mr-2', 'bg-gray-300', 'rounded', 'shadow');

  pokemonInfo.append(infoContainer);

  let infoLeft = document.createElement('div');
  infoLeft.classList.add('infoLeft', 'flex', 'flex-col', 'mx-5');
  let tag1 = document.createElement('span');
  tag1.classList.add('text-black', 'my-2')
  tag1.innerHTML = 'Species:';
  let tag2 = document.createElement('span');
  tag2.classList.add('text-black', 'my-2')
  tag2.innerHTML = 'Height:';
  let tag3 = document.createElement('span');
  tag3.classList.add('text-black', 'my-2')
  tag3.innerHTML = 'Weight:';
  let tag4 = document.createElement('span');
  tag4.classList.add('text-black', 'my-2')
  tag4.innerHTML = 'Abilities:';
  infoLeft.append(tag1, tag2, tag3, tag4);

  let infoRight = document.createElement('div');
  infoRight.classList.add('infoRight', 'flex', 'flex-col', 'mx-5');
  let info1 = document.createElement('span');
  info1.classList.add('text-black', 'my-2')
  info1.innerHTML = pokemon.species.name;
  let info2 = document.createElement('span');
  info2.classList.add('text-black', 'my-2')
  info2.innerHTML = pokemon.height;
  let info3 = document.createElement('span');
  info3.classList.add('text-black', 'my-2')
  info3.innerHTML = pokemon.weight;
  infoRight.append(info1, info2, info3);

  
  let info4 = document.createElement('span');
  info4.classList.add('text-black', 'my-2');

  let abilities = [];
  for (let i = 0; i < pokemon.abilities.length; i++) {
    ability = pokemon.abilities[i].ability.name;
    console.log(ability);
    abilities.push(ability);
    info4.innerHTML = abilities;
    infoRight.append(info4);
  }
  
  infoContainer.append(infoLeft, infoRight);

  let statsContainer = document.createElement('div');
  statsContainer.classList.add('statsContainer', 'flex', 'ml-2', 'mb-2', 'mr-2', 'bg-gray-300', 'rounded', 'shadow', 'hidden');

  pokemonInfo.append(statsContainer);

  let infoLeft2 = document.createElement('div');
  infoLeft2.classList.add('infoLeft2', 'flex', 'flex-col', 'mx-5');
  let tag11 = document.createElement('span');
  tag11.classList.add('text-black', 'my-1')
  tag11.innerHTML = 'Hp:';
  let tag12 = document.createElement('span');
  tag12.classList.add('text-black', 'my-1')
  tag12.innerHTML = 'Attack:';
  let tag13 = document.createElement('span');
  tag13.classList.add('text-black', 'my-1')
  tag13.innerHTML = 'Defense:';
  let tag14 = document.createElement('span');
  tag14.classList.add('text-black', 'my-1');
  tag14.innerHTML = 'Sp. Atk:';
  let tag15 = document.createElement('span');
  tag15.classList.add('text-black', 'my-1');
  tag15.innerHTML = 'Sp. Def';
  let tag16 = document.createElement('span');
  tag16.classList.add('text-black', 'my-1');
  tag16.innerHTML = 'Speed:';
  let tag17 = document.createElement('span');
  tag17.classList.add('text-black', 'my-1');
  tag17.innerHTML = 'Total:';

  infoLeft2.append(tag11, tag12, tag13, tag14, tag15, tag16, tag17);

  let infoRight2 = document.createElement('div');
  infoRight2.classList.add('infoRight', 'flex', 'flex-col');

  let barsContainer = document.createElement('div');
  barsContainer.classList.add('barsContainer', 'flex', 'flex-col', 'justify-center', 'mx-3', 'w-full');

  let total = 0
  for (let j = 0; j < pokemon.stats.length; j++) {
    total = total + pokemon.stats[j].base_stat;
  }
  for (let j = 0; j < pokemon.stats.length; j++) {
    let info11 = document.createElement('span');
    info11.classList.add('text-black', 'my-1');
    info11.innerHTML = pokemon.stats[j].base_stat;
    
    infoRight2.append(info11);
    
    let completeBar = document.createElement('div');
    completeBar.classList.add('completeBar', 'w-full', 'h-full', 'my-1', 'flex', 'items-center');
    
    barsContainer.append(completeBar);
    
    
    let colorBar = document.createElement('div');
    if (pokemon.stats[j].base_stat >= (total / pokemon.stats.length) ) colorBar.classList.add('colorBar', 'bg-green-600', 'h-2/6');
    else colorBar.classList.add('colorBar', 'bg-red-600', 'h-2/6');
    colorBar.style.width = ((pokemon.stats[j].base_stat) / 2) + '%';
    
    completeBar.append(colorBar);
  }
  
  let totalSpan = document.createElement('span');
  totalSpan.classList.add('text-black', 'my-1');
  totalSpan.innerHTML = total;

  infoRight2.append(totalSpan);

  let completeBar = document.createElement('div');
    completeBar.classList.add('completeBar', 'w-full', 'h-full', 'my-1', 'flex', 'items-center');

  barsContainer.append(completeBar);
  
  let colorBar = document.createElement('div');
  if (total >= 600) colorBar.classList.add('colorBar', 'bg-green-600', 'h-2/6');
    else colorBar.classList.add('colorBar', 'bg-red-600', 'h-2/6');
  colorBar.style.width = ((total * 100) / 1200) + '%';

  completeBar.append(colorBar);
  
  statsContainer.append(infoLeft2, infoRight2, barsContainer);
}

const closePopup = () => {
  const popUp = document.querySelector('#popup');
  popUp.classList.add('hidden')
}

const showAboutInfo = () => {
  const about = document.getElementsByClassName('infoContainer');
  const stats = document.getElementsByClassName('statsContainer');
  const tag1 = document.getElementsByClassName('aboutPokemon');
  const tag2 = document.getElementsByClassName('pokemonStats');
  about[0].classList.remove('hidden');
  stats[0].classList.add('hidden');
  tag1[0].classList.add('bg-gray-300');
  tag2[0].classList.remove('bg-gray-300');
}

const showStatsInfo = () => {
  const about = document.getElementsByClassName('infoContainer');
  const stats = document.getElementsByClassName('statsContainer');
  const tag1 = document.getElementsByClassName('pokemonStats');
  const tag2 = document.getElementsByClassName('aboutPokemon');
  about[0].classList.add('hidden');
  stats[0].classList.remove('hidden');
  tag1[0].classList.add('bg-gray-300');
  tag2[0].classList.remove('bg-gray-300');
}

const hideFilterInputs = () => {
  const inputValue = document.getElementById('filterValue');
  const inputType = document.getElementById('filterType');
  console.log(inputType);
  if (!inputValue.classList.contains('hidden')) inputValue.classList.add('hidden');
  if (!inputType.classList.contains('hidden')) inputType.classList.add('hidden');
}

const changeFilter = () => {
  const filter = document.getElementById('filterPokemonsBy');
  console.log(filter.value);
  hideFilterInputs();
  switch (filter.value) {
    case 'type':
      document.getElementById('filterType').classList.remove('hidden');
      break;
    case 'all':
      break;
    default:
      document.getElementById('filterValue').classList.remove('hidden');
      break;
  }
}

function getColor(type) {
  var colorClass;
  switch(type){
      case "grass":
        colorClass = "grass";
        break;
      case "poison":
        colorClass = "poison";
        break;
      case "fire":
        colorClass = "fire";
        break;
      case "water":
        colorClass = "water";
        break;
      case "psychic":
        colorClass = "psychic";
        break;
      case "dark":
        colorClass = "dark";
        break;
      case "bug":
        colorClass = "bug";
        break;
      case "dragon":
        colorClass = "dragon";
        break;
      case "electric":
        colorClass = "electric";
        break;
      case "flying":
        colorClass = "flying";
        break;
      case "ghost":
        colorClass = "ghost";
        break;
      case "ground":
        colorClass = "ground";
        break;
      case "ice":
        colorClass = "ice";
        break;
      case "rock":
        colorClass = "rock";
        break;
      case "steel":
        colorClass = "steel";
        break;
      case "fairy":
        colorClass = "fairy";
        break;
      default:
        colorClass = "normal";
  }
  return colorClass;
}
