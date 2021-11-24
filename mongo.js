// File created as a learning process for how to work with MongoDB


if (process.argv.length < 3) {
  console.log("Example usage: node mongo.js <password> <name> <number>");
  process.exit(1)
}

const password = process.argv[2]
const name = process.argv[3]
const number = process.argv[4]

const mongoose = require('mongoose')

//const url = ...

mongoose.connect(url)

const contactSchema = new mongoose.Schema({
  name: String,
  number: String,
})

//// schema is on the application level 
const Contact = mongoose.model('Contact', contactSchema)

if(process.argv.length >= 4){
  const contact = new Contact({
    name: name,
    number: number || "Unknown"
  })

  contact.save().then(result => {
    console.log(`added ${name}\nnumber: ${number||'Unknown'}`)
    mongoose.connection.close()
  })
}
else{
  Contact.find({}).then(result => {
    console.log("phonebook:")
    result.forEach(c => {
      console.log(`${c.name} ${c.number}`)
      mongoose.connection.close()
    });
  })
}

//note.save().then(result => {
//  console.log({result})
//  console.log('note saved!')
//  mongoose.connection.close()
//})

//Note.find({}).then(result => {
//  console.log("Get All")
//  result.forEach(note => {
//    console.log(note)
//  })
//  mongoose.connection.close()
//})


//Note.find({ important: true }).then(result => {
//  console.log("Filter for documents that have the property important = true")
//  result.forEach(note => {
//    console.log(note)
//  })
//  mongoose.connection.close()
//})