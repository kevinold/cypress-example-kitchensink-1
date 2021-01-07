/* eslint-env node */
/* eslint-disable no-console */
const path = require('path')
const YAML = require('yaml')
const { readFileSync, writeFileSync } = require('fs')

const buildSpecYmlPath = path.join(__dirname, '../buildspec.yml')
const buildSpecYml = readFileSync(buildSpecYmlPath, 'utf8')

const getSpecFilenames = () => {
  const globby = require('globby')

  return globby(['cypress/integration/**/*.spec.js'])
}

const updateBuildSpec = (filenames) => {
  const buildSpec = YAML.parse(buildSpecYml)

  buildSpec['batch']['build-matrix']['dynamic']['env']['variables']['CYPRESS_SPEC'] = filenames

  const replaced = YAML.stringify(buildSpec)

  writeFileSync(buildSpecYmlPath, replaced, 'utf8')
}

getSpecFilenames()
  .then((filenames) => {
    updateBuildSpec(filenames)
  })
  .catch((e) => {
    console.error(e.message)
    process.exit(1)
  })