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
      },
      usuario_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'Usuarios',
          key: 'id'
        }
      }
    }, {
      tableName: "Animal",
      freezeTableName: true
    });
  
    // 🔧 Las asociaciones van dentro del mismo bloque
    Animal.associate = (models) => {
      Animal.belongsTo(models.Usuario, {
        foreignKey: 'usuario_id',
        onDelete: 'CASCADE'
      });
  
      Animal.hasMany(models.Produccion, {
        foreignKey: 'ganado_id',
        onDelete: 'CASCADE'
      });
    };
  
    return Animal;
  };
  