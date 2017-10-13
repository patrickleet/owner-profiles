const fs = require('fs')
const path = require('path')
const RateLimiter = require('limiter').RateLimiter
const limiter = new RateLimiter(5, 'second')
const lodash = require('lodash')
const getProfile = require('../lib/get-profile')
const allUsernames = require('owners').map(o => o.username)
const prefetchedUsernames = fs.readdirSync(path.join(__dirname, '../profiles'))
  .map(filename => path.basename(filename, '.json'))
const targets = lodash.difference(allUsernames, prefetchedUsernames)

console.log(`targets.length: ${targets.length}`)
let numProcessed = 0

targets.forEach(username => {
  limiter.removeTokens(1, () => {
    getProfile(username)
      .then(profile => {
        numProcessed++
        console.log(`${numProcessed}/${targets.length}`)
      })
      .catch(error => {
        if (error.statusCode) {
          console.error(`${username} failed: (${error.statusCode})`)
        } else {
          console.error(error)
        }
      })
  })
})
