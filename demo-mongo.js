// File created as a learning process for how to work with MongoDB

const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log("Please provide the password as an argument: node mongo.js <password>");
  process.exit(1)
}

const password = process.argv[2]

//const url = ...


mongoose.connect(url)

const noteSchema = new mongoose.Schema({
  content: String,
  date: Date,
  important: Boolean,
})

//// schema is on the application level 
const Note = mongoose.model('Note', noteSchema)

//const note = new Note({
//  content:"Fill it up bby!",
//  date: new Date(),
//  important: false,
//})

//note.save().then(result => {
//  console.log({result})
//  console.log('note saved!')
//  mongoose.connection.close()
//})

Note.find({}).then(result => {
  console.log("Get All")
  result.forEach(note => {
    console.log(note)
  })
  mongoose.connection.close()
})


Note.find({ important: true }).then(result => {
  console.log("Filter for documents that have the property important = true")
  result.forEach(note => {
    console.log(note)
  })
  mongoose.connection.close()
})