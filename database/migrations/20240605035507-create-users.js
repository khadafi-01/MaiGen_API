'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('users', {
            user_id: {
                allowNull: false,
                primaryKey: true,
                type: Sequelize.UUID,
                defaultValue: Sequelize.UUIDV4,
            },
            username: {
                allowNull: false,
                type: Sequelize.STRING,
            },
            email: {
                allowNull: false,
                type: Sequelize.STRING,
                unique: true,
            },
            password: {
                allowNull: false,
                type: Sequelize.STRING,
            },
            created_at: {
                allowNull: false,
                type: Sequelize.DATE,
                defaultValue: Sequelize.fn('NOW'),
            },
            updated_at: {
                allowNull: false,
                type: Sequelize.DATE,
                defaultValue: Sequelize.fn('NOW'),
            },
            deleted_at: {
                type: Sequelize.DATE,
                allowNull: true,
            },
        });
    },
    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('users');
    }
};