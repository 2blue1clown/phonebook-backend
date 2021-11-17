

var contacts = [
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

//console.log(entries);


const express = require('express')
const morgan = require('morgan')
const cors = require('cors')

morgan.token('body', function (req, res) { return JSON.stringify(req.body) })


const app = express()
app.use(cors())
app.use(express.json())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

//Home page for the API - could be cleaned up to explain the exercises a bit more though.
app.get('/', (request, response) => {
  response.send("<h1> This is a backend what are you doing?!</h1><p>I guess your cute for checking it out though.</p>")
})

//Get all contacts in a JSON
app.get('/api/contacts', (request, response) => {
  response.json(contacts)
})

//Get contact with specified id in a JSON
app.get('/api/contacts/:id', (request, response) => {
  const id = Number(request.params.id)
  const contact = contacts.find(c => c.id === id)
  if (contact) {
    response.json(contact)
  }
  else {
    response.status(404).end()
  }
})

//Get some info about the phonebook. Number of contacts, time of request
app.get('/info', (request, response) => {
  const date = Date()
  response.send(`<p>Number of Contacts: ${contacts.length}</p>
                <p>Date: ${date}</p>`)
})

app.delete('/api/contacts/:id', (request, response) => {
  contacts = contacts.filter(c => c.id !== Number(request.params.id))
  response.status(204).end()
})

app.post('/api/contacts', (request, response) => {
  const body = request.body
  //error handling
  if(!body.name || !body.number){
    return response.status(400).json({
      error: 'content missing',
    }).end()
  }

  if(contacts.map(c => c.name).includes(body.name)){
    return response.status(400).json({
      error: 'names must be unique',
    }).end()
  }


  const id = Math.floor(Math.random() * 1000)
  const newContact = {
    'id': id,
    'name': body.name,
    'number': body.number,
  }
  //console.log({newContact})
  contacts.push(newContact)
  //console.log({contacts})
  response.json(newContact)
  response.status(200).end()

})

// Need to make a put so that I can update the contacts
app.put('/api/contacts/:id',(request,response) => {
  // Check to see if the contact exists
  const body = request.body
  index = contacts.findIndex(c => c.id === Number(request.params.id))
  console.log({index})
  if(index === -1){
    return response.status(404).json({
      error:"This contact does not exist on the server"
    })
  }
  else {
    contacts[index] = body
    response.status(200).json(body)
  }
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
})
