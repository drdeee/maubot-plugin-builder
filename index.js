#!/usr/bin/env node

const core = require('@actions/core')
const yaml = require('js-yaml')
const fs = require('fs')

const build = require('./build')

if (fs.existsSync('./maubot.yaml')) {
    core.info('Found plugin configuration: maubot.yaml')
    let maubotConfig

    try {
        maubotConfig = yaml.load(fs.readFileSync('./maubot.yaml', 'utf8'))
    } catch (e) {
        core.setFailed('An error occured while parsing maubot.yaml')
        process.exit(-1)
    }

    if (maubotConfig.id && maubotConfig.version) {

        const outFile = maubotConfig.id + '-v' + maubotConfig.version + '.mbp'
        if (fs.existsSync('./' + outFile)) {
            core.info('Plugin allready exsists; deleting old file..')
            try {
                fs.unlinkSync('./' + outFile)
                core.info('Deleted ' + outFile + '.')
            }
            catch (e) {
                core.setFailed('Error while deleting ' + outFile + '. Stopping action..')
                process.exit(-1)
            }
            build(outFile, maubotConfig)
        } else {
            build(outFile, maubotConfig)
        }
    } else {
        core.setFailed('Invalid maubot.yaml: missing fields. '
            + 'See https://docs.mau.fi/maubot/dev/reference/plugin-metadata.html for detailed instructions about maubot.yaml')
    }

} else {
    core.setFailed('No maubot.yaml file found in current directory')
}

