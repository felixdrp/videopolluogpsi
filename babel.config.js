module.exports = function (api) {
  const presets = [
    "@babel/preset-react"
  ];
  const plugins = [
    "@babel/plugin-proposal-class-properties",
    "@babel/plugin-transform-runtime",
    "@babel/plugin-proposal-export-default-from"
  ];
  api.cache(true)
  return {
    presets,
    plugins
  };
}
