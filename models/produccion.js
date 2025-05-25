const { Model } = require("sequelize")

module.exports = (sequelize, DataTypes) => {
  class Produccion extends Model {
    static associate(models) {
      // Una producción pertenece a un animal
      Produccion.belongsTo(models.Ganado, {
        foreignKey: "animalId",
        as: "animal",
      })
    }
  }

  Produccion.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      animalId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "ganado",
          key: "id",
        },
      },
      tipoProduccion: {
        type: DataTypes.ENUM("leche", "carne"),
        allowNull: false,
      },
      cantidad: {
        type: DataTypes.FLOAT,
        allowNull: false,
        validate: {
          min: 0,
        },
      },
      fechaRegistro: {
        type: DataTypes.DATEONLY,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      sequelize,
      modelName: "Produccion",
      tableName: "produccion",
    },
  )

  return Produccion
}
