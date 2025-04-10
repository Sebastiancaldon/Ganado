// models/usuario.js

module.exports = (sequelize, DataTypes) => {
  const Usuario = sequelize.define('Usuario', {
    nombre: DataTypes.STRING,
    cedula: DataTypes.STRING,
    password: DataTypes.STRING,
  });

  Usuario.associate = function (models) {
    // ✅ Aquí usamos models.Ganado, que debe estar cargado
    Usuario.hasMany(models.Ganado, {
      foreignKey: 'usuarioId',
      as: 'ganado',
    });
  };

  return Usuario;
};
