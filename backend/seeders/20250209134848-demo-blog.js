module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.bulkInsert("Blogs", [
      {
        title: "First Blog",
        content: "This is the first blog post.",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete("Blogs", null, {});
  },
};
