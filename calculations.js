const BigNumber = require('bignumber.js')
const fs = require("fs")


function loadTransactions(filename) {
    // the transactions are already sorted by timestamp in the input file
    const txs = JSON.parse(fs.readFileSync(filename, 'utf8'))

    return buildDataStructure(txs)
}

function buildDataStructure(txs) {
    // token -> account -> [tx]
    const data = {}
    txs.forEach(tx => {
        const { token, sender, recipient, value, timestamp} = tx
        if (typeof data[token] === "undefined") {
            data[token] = {}
        }
        // exclude the mint pseudo-account
        if (sender !== "" && typeof data[token][sender] === "undefined") {
            data[token][sender] = []
        }
        if (typeof data[token][recipient] === "undefined") {
            data[token][recipient] = []
        }

        // Javascript can only precisely represent integers under 2^50 so use BigNumber
        data[token][recipient].push({ value: BigNumber(value), timestamp })
        if (sender !== "") {  // exclude the mint pseudo-account
            data[token][sender].push({ value: BigNumber(-value), timestamp })
        }
    })

    return data
}

function calculateAverage(data, token) {
    const accounts = data[token]

    let total = BigNumber(0)
    let count = BigNumber(0)
    Object.values(accounts).forEach(txs => {
        txs.forEach(tx => {
            // must only include positive OR negative because both would equal zero... except the
            // mint pseudo-account is removed so the negatives give the count of everything else
            if (tx.value.isNegative()) {
                total = total.plus(tx.value)
                count = count.plus(1)
            }
        })
    })

    // since we only collect negatives but want a magnitude
    total = total.times(-1)

    if (count.isZero()) {
        return BigNumber(0)
    } else {
        return total.div(count)
    }
}

function calculateMedian(data, token) {
    const accounts = data[token]

    let amounts = []
    Object.values(accounts).forEach(txs => {
        txs.forEach(tx => {
            // must only include positive OR negative because they mirror eachother
            if (tx.value.isPositive()) {
                amounts.push(tx.value)
            }
        })
    })

    amounts.sort()

    return amounts[Math.floor(amounts.length / 2)]
}

function calculateRichest(data, token, time) {
    const accounts = data[token]
    let richest
    let howRich = 0
    Object.keys(accounts).forEach(account => {
        const wealth = calculateBalance(data, token, account, time)
        if (wealth.gt(howRich)) {
            richest = account
            howRich = wealth
        }
    })
    return richest
}

function calculateMostActive(data, token, time) {
    const accounts = data[token]
    let mostActive
    let howActive = BigNumber(0)
    Object.entries(accounts).forEach(([account,txs]) => {
        const activity = calculateActivity(data, token, account, time)
        if (activity.gt(howActive)) {
            mostActive = account
            howActive = activity
        }
    })
    return mostActive
}

function calculateActivity(data, token, account, time) {
    const txs = data[token][account]
    return txs.reduce((total, tx) => {
        // only include outgoing transfers
        if (tx.value.isNegative() && (typeof time === "undefined" || tx.timestamp <= time)) {
            return total.plus(1)
        } else {
            return total
        }
    }, BigNumber(0))
}

function calculateBalance(data, token, account, time) {
    const txs = data[token][account]
    return txs.reduce((total, tx) => {
        if (typeof time === "undefined" || tx.timestamp <= time) {
            return total.plus(tx.value)
        } else {
            return total
        }
    }, BigNumber(0))
}

module.exports = {
    loadTransactions,
    buildDataStructure,

    calculateAverage,
    calculateMedian,
    calculateRichest,
    calculateMostActive,
    calculateActivity,
    calculateBalance
}
