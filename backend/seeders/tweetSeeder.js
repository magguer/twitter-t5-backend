/**
 * El seeder no es más que un archivo que contiene una función que se encarga
 * de insertar datos (generalmente de prueba) en una base de datos.
 *
 * El nombre "seeder" es una convención y significa "semillero".
 *
 * Además, en este caso, se está usando una librería llamada Faker
 * (https://fakerjs.dev/) para facilitar la creación de datos ficticios como
 * nombres, apellidos, títulos, direcciones y demás textos.
 *
 * Suele ser común que en los seeders exista un `for` donde se define la
 * cantidad de registros de prueba que se insertarán en la base de datos.
 *
 */

const { faker } = require("@faker-js/faker");
const { Tweet, User } = require("../models");

faker.locale = "es";

module.exports = async () => {
  const tweets = [];

  for (let i = 0; i < process.env.TOTAL_TWEETS; i++) {
    const tweet = new Tweet({
      text: faker.lorem.sentence(10),
    });
    tweets.push(tweet);
  }

  for (const tweet of tweets) {
    const randomNumber = faker.datatype.number({
      min: 0,
      max: process.env.TOTAL_USERS,
    });
    const randomUser = await User.findOne().skip(randomNumber);
    tweet.user = randomUser;
    randomUser.tweets.push(tweet);
    await randomUser.save();
  }

  await Tweet.insertMany(tweets);
  console.log("[Database] Se corrió el seeder de Tweets.");
};
