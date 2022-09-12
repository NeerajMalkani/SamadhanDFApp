const createExpoWebpackConfigAsync = require('@expo/webpack-config');

module.exports = async function (env, argv) {
  const config = await createExpoWebpackConfigAsync({
      ...env,
      babel: {
          dangerouslyAddModulePathsToTranspile: [
              '@hashiprobr/react-native-paper-datetimepicker',
          ],
      },
  }, argv);
  return config;
};
