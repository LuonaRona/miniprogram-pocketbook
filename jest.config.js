module.exports = {
  collectCoverage: true,
  collectCoverageFrom: [
    "**/components/**/*.{js,vue}",
    "!**/node_modules/**",
    "!**/u-charts/**",
    "!**/dist/**",
    "!**/colorui/**",
  ],
  preset: '@vue/cli-plugin-unit-jest/presets/typescript-and-babel'
}
