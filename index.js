const express = require('express')
const app = express()

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

app.get('/info', (req, res) => {
    res.send(`<!DOCTYPE html><html><head><meta charset="utf-8"><title>info</title></head><body><h3>Puhelinluettelossa ${persons.length} henkilön tiedot</h3><h3>${new Date().toString()}</h3></body></html>`)
})

app.get('/api/persons', (req, res) => {
    res.json(persons)
})

app.get('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    const person = persons.find(n => n.id === id)
    if (person) {
        res.json(person)
    } else {
        res.status(404).end()
    }
})

const PORT = 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})