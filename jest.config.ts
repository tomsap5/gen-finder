module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  testMatch: ["**/__tests__/**/*.test*", "*test-db-setup.ts"],
  clearMocks: true,
};
