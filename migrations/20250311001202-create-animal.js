'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Animals', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      raza: {
        type: Sequelize.STRING
      },
      genero: {
        type: Sequelize.STRING
      },
      fechaNacimiento: {
        type: Sequelize.DATE
      },
      peso: {
        type: Sequelize.INTEGER
      },
      estadoSalud: {
        type: Sequelize.STRING
      },
      categoria: {
        type: Sequelize.STRING
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Animals');
  }
};

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.removeColumn('Animal', 'nombre');
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.addColumn('Animal', 'nombre', {
      type: Sequelize.STRING,
      allowNull: false
    });
  }
};
