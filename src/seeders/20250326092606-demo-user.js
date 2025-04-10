"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.bulkInsert("Users", [
      {
        firstName: "John",
        lastName: "Doe",
        email: "example@example.com",
        phoneNumber: "0123456789",
        password: "123456",
        role: "admin",
        gender: 1,
        dateOfBirth: new Date("2000-01-01"),
        image: "none",
        positionId: "admin",
        address:'Vietnam',

        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  },
};
