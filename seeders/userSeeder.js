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
const { User } = require("../models");
const slugify = require('slugify')

faker.locale = "es";

module.exports = async () => {
  const users = [];

  for (let i = 0; i <= Number(process.env.TOTAL_USERS); i++) {

    const firstname = faker.name.firstName();
    const lastname = faker.name.lastName();
    const username = `${firstname}_${lastname}`

    const user = new User({
      firstname,
      lastname,
      username,
      password: "1234",
      image: faker.internet.avatar(),
      description: faker.lorem.sentence(10),
      email: slugify(`${firstname}_${lastname}@gmail.com`, {
        replacement: '-',
        lower: true,
        locale: 'en',
      }),
      verify: false
    });
    users.push(user);
  }

  const userDefault = new User({
    firstname: "Jack",
    lastname: "Dorsey",
    username: "user_default",
    password: "1234",
    image: faker.internet.avatar(),
    description: faker.lorem.sentence(10),
    email: "user@default.com",
    verify: false
  })
  users.push(userDefault);

  for (const user of users) {
    const randomUser =
      users[
      faker.datatype.number({ min: 0, max: Number(process.env.TOTAL_USERS) - 1 })
      ];
    user.following.push(randomUser);
    randomUser.followers.push(user);
    await user.save()
  }

  console.log("[Database] Se corrió el seeder de Users.");
};
