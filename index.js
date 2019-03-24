require('dotenv').config()
const express = require('express')
const app = express()
const cors = require('cors')
const bodyParser = require('body-parser')
const morgan = require('morgan')
const Person = require('./models/person')

app.use(express.static('build'))
app.use(cors())
app.use(bodyParser.json())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :data'))

let persons = [
    {
        "id": 1,
        "name": "Arto Hellas",
        "number": "045-1236543",
    },
    {
        "id": 2,
        "name": "Arto Järvinen",
        "number": "041-21423123",
    },
    {
        "id": 3,
        "name": "Lea Kutvonen",
        "number": "040-4323234",
    },
    {
        "id": 4,
        "name": "Martti Tienari",
        "number": "09-784232",
    },
]

morgan.token('data', (req, res) => req.method === 'POST' ? JSON.stringify(req.body) : ' ')

//info
app.get('/info', (req, res) => {
    res.send(`<!DOCTYPE html><html><head><meta charset="utf-8"><title>info</title></head><body><h3>Puhelinluettelossa ${persons.length} henkilön tiedot</h3><h3>${new Date().toString()}</h3></body></html>`)
})

//hakee kokoelman kaikki resurssit
app.get('/api/persons', (req, res, next) => {
    Person.find({})
        .then(persons => {
            res.json(persons)
        })
        .catch(error => next(error))
})

//hakee yksittäisen resurssin
app.get('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    const person = persons.find(n => n.id === id)
    if (person) {
        res.json(person)
    } else {
        res.status(404).end()
    }
})

//luo uuden resurssin pyynnön mukana olavasta datasta
app.post('/api/persons', (req, res, next) => {

    const body = req.body

    if (!body.name) {
        return res.status(400).json({
            error: 'name missing'
        })
    }
    if (!body.number) {
        return res.status(400).json({
            error: 'number missing'
        })
    }
    if (persons.find(n => n.name === body.name)) {
        return res.status(400).json({
            error: 'name must be unique'
        })
    }
    const person = new Person({
        name: body.name,
        number: body.number
    })
    person.save()
        .then(savedPerson => {
            res.json(savedPerson.toJSON())
        })
        .catch(error => next(error))
})

//päivittää yksilöidyn resurssin
app.put('/api/persons/:id', (req, res, next) => {
    const body = req.body
    const person = {
        name: body.name,
        number: body.number,
    }
    Person.findByIdAndUpdate(req.params.id, person, { new: true })
        .then(updatedPerson => {
            res.json(updatedPerson.toJSON())
        })
        .catch(error => next(error))
})

//poistaa yksilöidyn resussin
app.delete('/api/persons/:id', (req, res, next) => {
    Person.findByIdAndRemove(req.params.id)
        .then(result => {
            res.status(204).end()
        })
        .catch(error => next(error))
})


//olemattomien osoitteiden käsittely
const unknownEndpoint = (req, res) => {
    res.status(404).end()
}
app.use(unknownEndpoint)

//virheellisten pyyntöjen käsittely
const errorHandler = (error, req, res, next) => {
    console.error(error.message)
    if (error.name === 'CastError' && error.kind == 'ObjectId') {
        return res.status(400).send({ error: 'malformatted id' })
    }
    next(error)
}
app.use(errorHandler)

//serveri
const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})