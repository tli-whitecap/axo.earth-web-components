const fs = require('fs-extra');
const concat = require('concat');
(async function build() {
    const files = [
        './dist/axo-earth/runtime.js',
        './dist/axo-earth/polyfills.js',
        './dist/axo-earth/main.js',
    ]
    await fs.ensureDir('elements')
    await concat(files, 'elements/axo-earth-wc.js');
    await fs.copyFile('./dist/axo-earth/styles.css', 'elements/styles.css')
    
})()