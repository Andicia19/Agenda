require('dotenv').config()
const express = require('express')
const Person = require('./models/person')
const app = express()
var morgan = require('morgan')
const cors = require('cors')

app.use(express.json())

morgan.token('id', function getId (req, res) {
  return JSON.stringify(req.body)
})

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :id'))

app.use(cors())

app.use(express.static('dist'))

app.get('/', (request, response) => {
  response.send('<h1>Hello World!</h1>')
})

app.get('/api/persons', (request, response) => {
  Person.find({}).then(persons => {  
    response.json(persons)
  })
})

// app.get('/info', (request, response) => {
//     const date = Date()
//     const n = Number(persons.length)
//     const content = `<p>Phonebook has info for ${n} persons</p> ${date}`
//     response.send(content)
// })

app.get('/api/persons/:id', (request, response) => {
  const id = String(request.params.id)
  Person.findById(id).then(person => {
    response.json(person)
  })
  })

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    console.log(id)
    persons = persons.filter(person => person.id !== id)
    console.log(persons)
    response.status(204).end()
  })

app.post('/api/persons', (request, response) => {
    const body = request.body
    // const existingPerson = persons.find(person => person.name === request.body.name)
    if (!body.name || !body.number) {
      return response.status(400).json({ 
        error: 'content missing' 
      })
    }
    // if (existingPerson) {
    //     return response.status(400).json({
    //         error: 'name must be unique'
    //     })
    // }
    const person = new Person({ 
        name: body.name,
        number: body.number,
    })

    person.save().then(savedPerson => {
      response.json(savedPerson)
    })
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
