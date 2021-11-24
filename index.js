

//var contacts = [
//  {
//    "id": 1,
//    "name": "Arto Hellas",
//    "number": "040-123456"
//  },
//  {
//    "id": 2,
//    "name": "Ada Lovelace",
//    "number": "39-44-5323523"
//  },
//  {
//    "id": 3,
//    "name": "Dan Abramov",
//    "number": "12-43-234345"
//  },
//  {
//    "id": 4,
//    "name": "Mary Poppendieck",
//    "number": "39-23-6423122"
//  }
//]

//console.log(entries);

require('dotenv').config()
const express = require('express')
const cors = require('cors')
const Contact = require('./models/contact')

const morgan = require('morgan')
morgan.token('body', function (req, res) { return JSON.stringify(req.body) })




const app = express()
app.use(cors())
app.use(express.static('build'))
app.use(express.json())//needs to be super early in the middle-wear hierarchy.
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))




//Home page for the API - could be cleaned up to explain the exercises a bit more though.
app.get('/', (request, response) => {
  response.send("<h1> This is a backend what are you doing?!</h1><p>I guess your cute for checking it out though.</p>")
})

//Get all contacts in a JSON
app.get('/api/contacts', (request, response) => {
  Contact.find({}).then(c => {
    response.json(c)
  })
})

//Get contact with specified id in a JSON
app.get('/api/contacts/:id', (request, response) => {

  Contact.findById(request.params.id)
    .then(contact => {
      //console.log({contact})
      if (contact) {
        response.json(contact)
      }
      else {
        response.status(404).end()
      }
    })
    .catch(error => {
      console.log(error)
      //The request could not be understood by the server due to malformed syntax. The client SHOULD NOT repeat the request without modifications.
      response.status(400).send({ error: 'malformed id' })
    })
})

//Get some info about the phonebook. Number of contacts, time of request
app.get('/info', (request, response) => {
  const date = Date()
  Contact.find({}).then(contact => {
  response.send(`<p>Number of Contacts: ${contact.length}</p><p>Date: ${date}</p>`)
  })
})

app.delete('/api/contacts/:id', (request, response, next) => {
  Contact.findByIdAndRemove(request.params.id)
    .then(result => {
      response.status(204).end()
    })
    .catch(error => {
      next(error) //if next was called with no params then it would call the next non-error middle-wear. With a parameter it goes to the next error middle-wear handler. 
    })
})

app.post('/api/contacts', (request, response, next) => {
  const body = request.body
  const contact = new Contact({
    'name': body.name,
    'number': body.number,
  })
  contact.save().then(result => {
    console.log(`added ${contact.name} with number ${contact.number} to phonebook`)
    response.json(contact)
    response.status(200).end()
  })
  .catch(error => next(error))


})

// Need to make a put so that I can update the contacts
app.put('/api/contacts/:id', (request, response,next) => {

  const updatedContact = {
    name: request.body.name,
    number: request.body.number
  }
  Contact.findByIdAndUpdate(request.params.id, updatedContact, { new: true,runValidators:true })
    .then(result => {
      response.json(result)
    })
    .catch(error => next(error))
})

// This is like the goal keeper. If there are any requests made to any url then this will handle them (if they havent already been handled )
const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)// Needs to be the second to last piece of middle-wear.

const errorHandler = (error, request, response, next) => {
  console.log(error)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformed id' })
  }
  if (error.name === 'ValidationError'){
    return response.status(400).json({error: error.message})
  }
  next(error)
}

app.use(errorHandler) //needs to be the last used middle-wear

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
})
