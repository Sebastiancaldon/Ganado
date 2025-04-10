// models/ganado.js

module.exports = (sequelize, DataTypes) => {
    const Ganado = sequelize.define('Ganado', {
      raza: DataTypes.STRING,
      genero: DataTypes.STRING,
      peso: DataTypes.FLOAT,
      estadoSalud: DataTypes.STRING,
      fechaNacimiento: DataTypes.DATE,
      categoria: DataTypes.STRING,
      usuario_id: DataTypes.INTEGER,
      
    });
  
    Ganado.associate = function (models) {
      Ganado.belongsTo(models.Usuario, {
        foreignKey: 'usuarioId',
        as: 'usuario',
      });
    };
  
    return Ganado;
  };
  
  