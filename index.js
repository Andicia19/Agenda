require('dotenv').config()

const express = require('express')
const Person = require('./models/person')
const app = express()
var morgan = require('morgan')
const cors = require('cors')

app.use(express.static('dist'))
app.use(express.json())

app.use(cors())

morgan.token('id', function getId (req, res) {
  return JSON.stringify(req.body)
})
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :id'))

app.get('/', (request, response) => {
  response.send('<h1>Hello World!</h1>')
})

//Obtener todos los numeros
app.get('/api/persons', (request, response) => {
  Person.find({}).then(persons => {  
    response.json(persons)
  })
})

//Ruta de la fecha de la visita
app.get('/info', async (request, response) => {
  try {
      const date = new Date().toString()
      const n = await Person.countDocuments()

      const content = `<p>Phonebook has info for ${n} people</p> <p>${date}</p>`
      response.send(content)
  } catch (error) {
      console.error("Error:", error)
      response.status(500).send("Internal Server Error")
  }
})

//obtener numero individual
app.get('/api/persons/:id', (request, response, next) => {
  const id = String(request.params.id)
  Person.findById(id)
  .then(person => {
    if (person) {
      response.json(person)
    }else{
      response.status(404).end()
    }
    
  })
    .catch(error => next(error))
  })

//eliminar numero
app.delete('/api/persons/:id', (request, response, next) => {
    const id = String(request.params.id)
    Person.findByIdAndDelete(id)
    .then(result => {
      response.status(204).end()
    })
    .catch(error => next(error))
  })

//agregar numero
app.post('/api/persons', (request, response, next) => {
    const body = request.body

    const person = new Person({ 
        name: body.name,
        number: body.number,
    })

    person.save().then(savedPerson => {
      response.json(savedPerson)
    })
    .catch(error => next(error))
})

//modificar numero
app.put('/api/persons/:id', (request, response, next) => {
  const body = request.body
  const id = String(request.params.id)

  const person = {
    name: body.name,
    number: body.number,
  }

  Person.findByIdAndUpdate(id, person, { new: true, runValidators: true })
    .then(updatedPerson => {
      response.json(updatedPerson)
    })
    .catch(error => next(error))
})

//Middleware para endpoint no definidos
const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}
app.use(unknownEndpoint)

//Middleware ppara errores
const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error:error.message })
  }

  next(error)
}
app.use(errorHandler)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
