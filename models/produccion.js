module.exports = (sequelize, DataTypes) => {
    const Produccion = sequelize.define('Produccion', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      ganado_id: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      tipoProduccion: {
        type: DataTypes.ENUM('leche', 'carne'),
        allowNull: false
      },
      cantidad: {
        type: DataTypes.FLOAT,
        allowNull: false
      },
      fechaRegistro: {
        type: DataTypes.DATEONLY,
        allowNull: false
      }
    }, {
      tableName: 'Produccion',
      freezeTableName: true
    });
  
    // ✅ Las relaciones van aquí
    Produccion.associate = (models) => {
      Produccion.belongsTo(models.Ganado, {
        foreignKey: 'ganado_id',
        targetKey: 'id',         
        onDelete: 'CASCADE'
      });
      
    };
  
    return Produccion;
  };
  