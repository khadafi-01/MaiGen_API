'use strict';

const { DataTypes } = require('sequelize');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('destinations', {
            destination_id: {
                allowNull: false,
                primaryKey: true,
                type: Sequelize.UUID,
                defaultValue: Sequelize.UUIDV4,
            },
            name: {
                allowNull: false,
                type: Sequelize.STRING,
            },
            description: {
                type: Sequelize.TEXT,
                allowNull: true,
            },
            location: {
                type: Sequelize.STRING,
                allowNull: true,
            },
            image_url: {
                type: Sequelize.STRING,
                allowNull: true,
            },
            created_at: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.fn('NOW'),
            },
            updated_at: {
                allowNull: false,
                type: Sequelize.DATE,
                defaultValue: Sequelize.fn('NOW')
            },
            deleted_at: {
                type: Sequelize.DATE,
                allowNull: true,
            }
        })
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('destinations')
    }
};