const mongoose = require('mongoose')

if (process.argv.length < 3) {
    console.log('give at least password as argument')
    process.exit(1)
}

const password = process.argv[2]

const url =
    `mongodb+srv://fullstack:${password}@cluster0-y7nqp.mongodb.net/person-app?retryWrites=true`

mongoose.connect(url, { useNewUrlParser: true })

const personSchema = new mongoose.Schema({
    name: String,
    number: String,
})

const Person = mongoose.model('Person', personSchema)

if (process.argv.length === 3) {
    //tulostus
    Person.find({}).then(result => {
        console.log(`puhelinluettelo:`)
        result.forEach(person => {
            console.log(`${person.name} ${person.number}`)
        })
        mongoose.connection.close()
    })
} else if (process.argv.length === 5) {
    //lisäys
    const person = new Person({
        name: process.argv[3],
        number: process.argv[4].toString(),
    })
    person.save().then(response => {
        console.log(`lisätään ${person.name} numero ${person.number} luetteloon`);
        mongoose.connection.close();
    })
} else {
    console.log('give password, new new and new number as arguments')
}
