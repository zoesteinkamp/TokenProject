const express = require("express")

const {
    loadTransactions,
    calculateAverage,
    calculateMedian,
    calculateRichest,
    calculateMostActive,
    calculateBalance
} = require("./calculations")


const app = express()
module.exports = app

app.get("/:token/account/:account/balance", (request, response) => {
    const { token, account } = request.params
    let { time } = request.query

    time = parseTime(time)
    if (time === null) {
        return response.status(400).send({ error: "time must be an integer" })
    }

    if (typeof DATA[token] === "undefined") {
        return response.status(404).send({ error: "no such token" })
    } else if (typeof DATA[token][account] === "undefined") {
        return response.status(404).send({ error: "no such account" })
    }

    const balance = calculateBalance(DATA, token, account, time)

    response.type("json").send(balance.toString())
})

app.get("/:token/stats/average", (request, response) => {
    const { token } = request.params

    if (typeof DATA[token] === "undefined") {
        return response.status(404).send({ error: "no such token"})
    }

    const average = calculateAverage(DATA, token)

    response.type("json").send(average.toString())
})

app.get("/:token/stats/median", (request, response) => {
    const { token } = request.params

    if (typeof DATA[token] === "undefined") {
        return response.status(404).send({ error: "no such token" })
    }

    const median = calculateMedian(DATA, token)

    response.type("json").send(median.toString())
})

app.get("/:token/stats/richest", (request, response) => {
    const { token } = request.params
    let { time } = request.query

    time = parseTime(time)
    if (time === null) {
        return response.status(400).send({ error: "time must be an integer" })
    }

    if (typeof DATA[token] === "undefined") {
        return response.status(404).send({ error: "no such token" })
    }

    const richest = calculateRichest(DATA, token, time)

    response.type("json").send(JSON.stringify(richest))
})

app.get("/:token/stats/mostActive", (request, response) => {
    const { token } = request.params
    let { time } = request.query

    time = parseTime(time)
    if (time === null) {
        return response.status(400).send({ error: "time must be an integer" })
    }

    if (typeof DATA[token] === "undefined") {
        return response.status(404).send({ error: "no such token" })
    }

    const active = calculateMostActive(DATA, token, time)


    response.type("json").send(JSON.stringify(active))
})

// If time exists then it must be an integer.
function parseTime(timeString) {
    if (typeof timeString === "undefined") {
        return
    }

    const time = Number(timeString)
    if (Number.isInteger(time)) {
        return time
    } else {
        return null
    }
}


PORT = 8080
DATA_FILENAME = "token_transfers.json"

const DATA = loadTransactions(DATA_FILENAME)

app.listen(PORT, () => {
    console.log("node server running on port " + PORT)
})
