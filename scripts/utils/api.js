const Shopify = require('shopify-api-node');

const { shopName, apiKey, apiPassword: password } = require('../../app.config');

function createAPI(options) {
  return new Shopify({
    shopName,
    apiKey,
    password,
    autoLimit: true, // https://shopify.dev/concepts/about-apis/rate-limits
    timeout: 30 * 1000,
    ...options
  });
}

const shopifyAPI = createAPI();

module.exports = {
  shopifyAPI
};
