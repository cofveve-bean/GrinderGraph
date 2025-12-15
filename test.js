const fs = require('fs')
const path = require('path')

const file = path.resolve(__dirname, 'src', 'GrinderNode.js')

function fail(msg){
  console.error('FAIL:', msg)
  process.exitCode = 1
}

if(!fs.existsSync(file)){
  fail(`${file} not found`)
} else {
  const src = fs.readFileSync(file,'utf8')
  const hasClass = /export\s+class\s+GrinderNode/.test(src)
  const hasMount = /mount\(/.test(src)
  console.log('Found:', file)
  console.log('Contains `export class GrinderNode`:', hasClass)
  console.log('Contains `mount(...)` method:', hasMount)
  if(!hasClass) fail('Missing `export class GrinderNode`')
  if(!hasMount) fail('Missing `mount` method')
  if(!process.exitCode) console.log('\nQuick demo: open demo/index.html in a browser or run:')
  if(!process.exitCode) console.log('  python3 -m http.server 8000  (then open http://localhost:8000/demo/)')
}
