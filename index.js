const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const morgan = require('morgan')

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

const generateId = () => Math.floor(Math.random() * 65534) + 1

morgan.token('data', (req, res) => req.method === 'POST' ? JSON.stringify(req.body) : ' ')

//info
app.get('/info', (req, res) => {
    res.send(`<!DOCTYPE html><html><head><meta charset="utf-8"><title>info</title></head><body><h3>Puhelinluettelossa ${persons.length} henkilön tiedot</h3><h3>${new Date().toString()}</h3></body></html>`)
})

//hakee kokoelman kaikki resurssit
app.get('/api/persons', (req, res) => {
    res.json(persons)
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
app.post('/api/persons', (req, res) => {

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
    const person = {
        id: generateId(),
        name: body.name,
        number: body.number
    }
    persons = persons.concat(person)
    res.json(person)
})

//poistaa yksilöidyn resussin
app.delete('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id);
    persons = persons.filter(n => n.id !== id);
    res.status(204).end();
});


const unknownEndpoint = (req, res) => {
    res.status(404).end()
}
app.use(unknownEndpoint)


const PORT = 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})