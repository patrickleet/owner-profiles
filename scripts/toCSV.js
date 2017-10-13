const fs = require('fs')
const path = require('path')
const os = require('os')

const lodash = require('lodash')
const headers = require('../lib/headers')

const csvWriter = require('csv-write-stream')
const writer = csvWriter({ headers })

const profiles = fs.readdirSync(path.join(__dirname, '../profiles'))

const dir = `${os.homedir()}/npm`
const outputFilename = `${dir}/owners.csv`

if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir)
}

writer.pipe(fs.createWriteStream(outputFilename));

profiles.forEach(profileFile => {
  let profile = require(path.join(__dirname, '../profiles', profileFile))
  const { email } = profile

  writer.write({email})
})

writer.end()
