const express = require('express')
const cors = require('cors')
const fs = require('fs').promises
const path = require('path')
const app = express()
const port = process.env.PORT || 5000

const dataFile = path.join(__dirname, 'data.json')

// Static Files
app.use(express.json())
app.use(cors())
app.use(express.static('public'))
app.use('/js', express.static(__dirname + 'public/js'))

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
})

app.get('/api', async (req, res) => {
  const data = JSON.parse(await fs.readFile(dataFile))
  res.status(200).json(data)
})

app.post('/api', async (req, res) => {
  let { newVocab } = req.body
  newVocab = newVocab.trim()
  let data = JSON.parse(await fs.readFile(dataFile))
  data = { ...data, vocabs: [...data.vocabs, newVocab].sort() }
  await fs.writeFile(dataFile, JSON.stringify(data))
  res.status(201).json({ created: true })
})

app.put('/api', async (req, res) => {
  const { vocabIndex } = req.body
  let { editedVocab } = req.body
  editedVocab = editedVocab.trim()
  let data = JSON.parse(await fs.readFile(dataFile))
  data.vocabs[vocabIndex] = editedVocab
  data.vocabs.sort()
  await fs.writeFile(dataFile, JSON.stringify(data))
  res.status(200).json({ created: true })
})

app.delete('/api', async (req, res) => {
  const { selectedVocabIndex } = req.body
  let data = JSON.parse(await fs.readFile(dataFile))
  data = {
    vocabs: data.vocabs.filter(
      (vocab, vocabIndex) => vocabIndex !== selectedVocabIndex,
    ),
  }
  await fs.writeFile(dataFile, JSON.stringify(data))
  res.status(200).json({ deleted: true })
})

app.listen(port, () => {
  console.log(`Server is running on port ${port}`)
})
