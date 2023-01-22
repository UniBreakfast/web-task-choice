const fs = require('fs')
const path = require('path')

const ignoreList = ['.git', 'node_modules', '.gitignore', __filename.slice(__dirname.length + 1)]
const listedExtensions = ['.txt', '.html', '.css', '.js', '.md']

const dateFormat = /\d{4}-\d{2}-\d{2}_\d{2}-\d{2}/
const date = new Date()
const pad = num => String(num).padStart(2, '0')
const dateString = `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}_${pad(date.getHours())}-${pad(date.getMinutes())}`

const outputDir = path.join(__dirname, dateString)
const structureFilePath = path.join(outputDir, 'project-structure.txt')

const walk = (dir, parent) => fs.readdirSync(dir).map(file => {
  const filePath = path.join(dir, file)

  if (fs.statSync(filePath).isDirectory()) {
    if (!ignoreList.includes(file) && !dateFormat.test(file)) {
      walk(filePath, parent ? `${parent}/${file}` : file)
    }
  }
  else {
    if (!ignoreList.includes(file)) {
      const ext = path.extname(file)

      if (listedExtensions.includes(ext)) {
        fs.appendFileSync(structureFilePath, `${parent ? `${parent}/` : ''}${file}\n`)
      }
    }
  }
})

if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir)

walk(__dirname)

const files = fs.readFileSync(structureFilePath, 'utf8').split('\n').filter(Boolean)

let counter = 1
let currentFileContent = ''

files.forEach((file, i) => {
  const fileContent = fs.readFileSync(path.join(__dirname, file), 'utf8')

  if (currentFileContent.length + fileContent.length > 10000) {
    fs.writeFileSync(path.join(outputDir, `${('0' + counter).slice(-2)}.txt`), currentFileContent)
    counter++
    currentFileContent = ''
  }

  currentFileContent += `file: ${file}\n\`\`\`\n${fileContent}\n\`\`\`\n\n\n\n`

  if (i === files.length - 1) {
    fs.writeFileSync(path.join(outputDir, `${('0' + counter).slice(-2)}.txt`), currentFileContent)
  }
})

fs.writeFileSync(structureFilePath, 'Project folder:\n\n' + fs.readFileSync(structureFilePath, 'utf8'))
