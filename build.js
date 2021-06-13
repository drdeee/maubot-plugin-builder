const fs = require('fs')
const admzip = require('adm-zip')
const core = require('@actions/core')
const glob = require('util').promisify(require('glob'))

module.exports = async function (outFile, meta) {
    const output = fs.createWriteStream('./' + outFile)
    const zip = new admzip()
    zip.addLocalFile('./maubot.yaml')
    for (index in meta.modules) {
        const mod = meta.modules[index]
        if (fs.existsSync('./' + mod + '.py')) {
            zip.addLocalFile('./' + mod + '.py')
            core.info('Added module: ' + mod + '.py')
        } else if (fs.existsSync('./' + mod)) {
            zip.addLocalFolder('./' + mod, mod)
            core.info('Added module: ' + mod)
        }
        else {
            core.setFailed("Module not found: " + mod)
            process.exit(-1)
        }
    }
    for (index in meta.extra_files) {
        try {
            const matches = await glob(meta.extra_files[index])
            for (match in matches) {
                zip.addLocalFile(matches[match])
                core.info('Added extra file: ' + matches[match])
            }
        }
        catch (e) { }
    }

    zip.writeZip('./' + outFile)
    core.info('Plugin file created.')
    core.setOutput('plugin_file', outFile)
}