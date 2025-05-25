module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("ganado", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      usuarioId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "usuarios",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      identificacion: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      raza: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      fechaNacimiento: {
        type: Sequelize.DATEONLY,
        allowNull: false,
      },
      sexo: {
        type: Sequelize.ENUM("Macho", "Hembra"),
        allowNull: false,
      },
      peso: {
        type: Sequelize.FLOAT,
        allowNull: false,
      },
      estado: {
        type: Sequelize.ENUM("Activo", "Vendido", "Fallecido"),
        defaultValue: "Activo",
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
    await queryInterface.dropTable("ganado")
  },
}
