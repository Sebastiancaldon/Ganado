const { Model } = require("sequelize")

module.exports = (sequelize, DataTypes) => {
  class Ganado extends Model {
    static associate(models) {
      // Un animal pertenece a un usuario
      Ganado.belongsTo(models.Usuario, {
        foreignKey: "usuarioId",
        as: "usuario",
      })

      // Un animal puede tener muchos registros de producción
      Ganado.hasMany(models.Produccion, {
        foreignKey: "animalId",
        as: "produccion",
      })
    }
  }

  Ganado.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      usuarioId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "usuarios",
          key: "id",
        },
      },
      identificacion: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      raza: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      fechaNacimiento: {
        type: DataTypes.DATEONLY,
        allowNull: false,
      },
      sexo: {
        type: DataTypes.ENUM("Macho", "Hembra"),
        allowNull: false,
      },
      peso: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      estado: {
        type: DataTypes.ENUM("Activo", "Vendido", "Fallecido"),
        defaultValue: "Activo",
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
      modelName: "Ganado",
      tableName: "ganado",
    },
  )

  return Ganado
}
