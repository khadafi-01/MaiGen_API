const { Model, DataTypes } = require('sequelize');
const sequelize = require('../../config/connection');

class Destinations extends Model {}

Destinations.init({
    destination_id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    location: {
        type: DataTypes.STRING,
        allowNull: true
    },
    image_url: {
        type: DataTypes.STRING,
        allowNull: true
    },
    created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    },
    updated_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    }
}, {
    sequelize,
    tableName: 'destinations',
    timestamps: 'true',
    paranoid: 'true',
    underscored: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
})

module.exports = Destinations