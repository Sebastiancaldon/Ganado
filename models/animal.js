module.exports = (sequelize, DataTypes) => {
  const Animal = sequelize.define("Animal", {
      id: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true
      },
      raza: {
          type: DataTypes.STRING,
          allowNull: false
      },
      genero: {
          type: DataTypes.STRING,
          allowNull: false
      },
      fechaNacimiento: {
          type: DataTypes.DATE,
          allowNull: false
      },
      peso: {
          type: DataTypes.FLOAT,
          allowNull: false
      },
      estadoSalud: {
          type: DataTypes.STRING,
          allowNull: false
      },
      categoria: {
          type: DataTypes.STRING,
          allowNull: false
      }
  }, {
      tableName: "Animal",
      freezeTableName: true
  });

  return Animal;
};

