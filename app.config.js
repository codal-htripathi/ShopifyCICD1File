const path = require('path');
const {
  argv: { env }
} = require('yargs');
// if you want to point to different env, store env file with `.env.{environment}` and run the cli with `--env {environment}` argument
require('dotenv').config(
  env ? { path: path.resolve(process.cwd(), `.env.${env}`) } : undefined
);

// path config
const paths = {
  srcDir: 'src'
};

// ignore files config
const ignoreFiles = {
  download: [],
  deploy: []
};

const config = {
  shopName: process.env.SHOP_STORE,
  themeId: process.env.SHOP_THEME_ID,
  apiKey: process.env.SHOP_API_KEY,
  apiPassword: process.env.SHOP_ACCESS_TOKEN,
  apiVersion: '2024-01', // https://shopify.dev/concepts/about-apis/versioning#release-schedule
  paths,
  ignoreFiles
};

module.exports = config;
