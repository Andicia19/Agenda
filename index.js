const express = require('express')
const app = express()
app.use(express.json())

var morgan = require('morgan')

morgan.token('id', function getId (req, res) {
  return JSON.stringify(req.body)
})
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :id'))


const cors = require('cors')
app.use(cors())

let persons = [
    { 
      "id": 1,
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": 2,
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": 3,
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": 4,
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

app.get('/', (request, response) => {
  response.send('<h1>Hello World!</h1>')
})


app.get('/api/persons', (request, response) => {
    response.json(persons)
  })

app.get('/info', (request, response) => {
    const date = Date()
    const n = Number(persons.length)
    const content = `<p>Phonebook has info for ${n} persons</p> ${date}`
    response.send(content)
})

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = persons.find(person => person.id === id)
    if (person) {
      response.json(person)
    } else {
      response.status(404).json({error: 'The entry does not exist'}).end()
    }
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
    const existingPerson = persons.find(person => person.name === request.body.name)
    if (!body.name || !body.number) {
      return response.status(400).json({ 
        error: 'content missing' 
      })
    }
    if (existingPerson) {
        return response.status(400).json({
            error: 'name must be unique'
        })
    }

    const person = {
        id: Math.floor(Math.random() * 1000000),  
        name: body.name,
        number: body.number,
    }

    persons = persons.concat(person)
  
    response.json(person)
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
