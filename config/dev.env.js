'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  // BASE_API: '"http://10.1.83.113:9999"'
  // BASE_API: '"http://10.1.81.97:9999"'
  // BASE_API: '"http://10.1.98.241:9999"'
  BASE_API: '"http://api-gateway.fbplatform.10.10.18.55.xip.io/"'
})
