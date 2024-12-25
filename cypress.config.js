const { defineConfig } = require("cypress");

module.exports = defineConfig({
  projectId: "c6v5a5",
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
    baseUrl: "https://restful-booker.herokuapp.com",
  },
});
