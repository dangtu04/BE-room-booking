"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Bookings", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      userId: {
        type: Sequelize.INTEGER,
      },
      userName: {
        type: Sequelize.STRING,
      },
      userPhone: {
        type: Sequelize.STRING,
      },
      userEmail: {
        type: Sequelize.STRING,
      },
      totalPrice: {
        type: Sequelize.INTEGER,
      },
      checkInDate: {
        type: Sequelize.STRING,
      },
      checkOutDate: {
        type: Sequelize.STRING,
      },
      numPeople: {
        type: Sequelize.INTEGER,
      },
      numRooms: {
        type: Sequelize.INTEGER,
      },
      statusCode: {
        type: Sequelize.STRING,
      },
      token: {
        type: Sequelize.STRING,
      },
      propertyId: {
        type: Sequelize.INTEGER,
      },
      

      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("Bookings");
  },
};
