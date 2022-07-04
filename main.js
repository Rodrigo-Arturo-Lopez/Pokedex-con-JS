const {
  listPokemons,
  findByName
} = require('./Pokemons.js');

// LISTA DE TODOS POKEMONS
const main = async () => {
  const [data, error] = await listPokemons();
  console.log(data.results[0].name);
  findByName('lucario');
}

const findAll = async () => {
  const [data, error] = await listPokemons();
  console.log(data);
}

main();