module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("produccion", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      animalId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "ganado",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      tipoProduccion: {
        type: Sequelize.ENUM("leche", "carne"),
        allowNull: false,
      },
      cantidad: {
        type: Sequelize.FLOAT,
        allowNull: false,
      },
      fechaRegistro: {
        type: Sequelize.DATEONLY,
        allowNull: false,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
    })
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("produccion")
  },
}
