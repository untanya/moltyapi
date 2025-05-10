import { Sequelize } from "sequelize";

// Option 2: Passing parameters separately (sqlite)
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: '.../database/moltyDB.sqlite'
});

export async function authenticate(){
    try {
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');
      } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
}

// voir si je dois faire une config et parametrage de sequilize.op
// toutes les opérations faites par sequelize
// sequlize.models je peux accéder à tous les models de sequelize (set, save, update)
