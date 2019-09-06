const BigNumber = require("bignumber.js")
const test = require("ava")
const request = require("supertest");

const app = require("./server")


test("/:token/stats/mostActive bad token", async t => {
    const res = await request(app)
        .get("/fake/stats/mostActive")
        .expect("Content-Type", /json/)
        .expect(404)

    t.deepEqual(
        res.body,
        { error: "no such token" }
    )
})

test("/:token/stats/mostActive", async t => {
    const res = await request(app)
        .get("/0x1985365e9f78359a9b6ad760e32412f4a445e862/stats/mostActive")
        .expect("Content-Type", /json/)
        .expect(200)

    t.deepEqual(
        res.body,
        "0x200a328032c81691da4b29c824558ee85ad95d29"
    )
})

test("/:token/stats/mostActive unknown / good time", async t => {
    const res = await request(app)
        .get("/0x1985365e9f78359a9b6ad760e32412f4a445e862/stats/mostActive?time=1")
        .expect("Content-Type", /json/)
        .expect(200)

    t.deepEqual(
        res.body,
        ""
    )
})

test("/:token/stats/mostActive known / good time", async t => {
    const res = await request(app)
        .get("/0x1985365e9f78359a9b6ad760e32412f4a445e862/stats/mostActive?time=1539972566")
        .expect("Content-Type", /json/)
        .expect(200)

    t.deepEqual(
        res.body,
        "0x200a328032c81691da4b29c824558ee85ad95d29"
    )
})

test("/:token/stats/richest bad token", async t => {
    const res = await request(app)
        .get("/fake/stats/richest")
        .expect("Content-Type", /json/)
        .expect(404)

    t.deepEqual(
        res.body,
        { error: "no such token" }
    )
})

test("/:token/stats/richest", async t => {
    const res = await request(app)
        .get("/0x1985365e9f78359a9b6ad760e32412f4a445e862/stats/richest")
        .expect("Content-Type", /json/)
        .expect(200)

    t.deepEqual(
        res.body,
        "0xfbb1b73c4f0bda4f67dca266ce6ef42f520fbb98"
    )
})

test("/:token/stats/richest unknown / good time", async t => {
    const res = await request(app)
        .get("/0x1985365e9f78359a9b6ad760e32412f4a445e862/stats/richest?time=1")
        .expect("Content-Type", /json/)
        .expect(200)

    t.deepEqual(
        res.body,
        ""
    )
})

test("/:token/stats/richest known / good time", async t => {
    const res = await request(app)
        .get("/0x1985365e9f78359a9b6ad760e32412f4a445e862/stats/richest?time=1531162449")
        .expect("Content-Type", /json/)
        .expect(200)

    t.deepEqual(
        res.body,
        "0x47fc5b58c0602f943306969c5c6f5377c9c3918c"
    )
})

test("/:token/stats/median bad token", async t => {
    const res = await request(app)
        .get("/fake/stats/median")
        .expect("Content-Type", /json/)
        .expect(404)

    t.deepEqual(
        res.body,
        { error: "no such token" }
    )
})

test("/:token/stats/median", async t => {
    const res = await request(app)
        .get("/0x1985365e9f78359a9b6ad760e32412f4a445e862/stats/median")
        .expect("Content-Type", /json/)
        .expect(200)

    t.deepEqual(
        res.body,
        2.2471899999149414e+21
    )
})

test("/:token/stats/average bad token", async t => {
    const res = await request(app)
        .get("/fake/stats/average")
        .expect("Content-Type", /json/)
        .expect(404)

    t.deepEqual(
        res.body,
        { error: "no such token" }
    )
})

test("/:token/stats/average", async t => {
    const res = await request(app)
        .get("/0x1985365e9f78359a9b6ad760e32412f4a445e862/stats/average")
        .expect("Content-Type", /json/)
        .expect(200)

    t.deepEqual(
        res.body,
        217023590637280030000
    )
})

test("/:token/:account/balance bad token", async t => {
    const res = await request(app)
        .get("/fake/account/fakeson/balance")
        .expect("Content-Type", /json/)
        .expect(404)

    t.deepEqual(
        res.body,
        { error: "no such token" }
    )
})

test("/:token/:account/balance bad account", async t => {
    const res = await request(app)
        .get("/0x1985365e9f78359a9b6ad760e32412f4a445e862/account/fakeson/balance")
        .expect("Content-Type", /json/)
        .expect(404)

    t.deepEqual(
        res.body,
        { error: "no such account" }
    )
})

test("/:token/:account/balance", async t => {
    const res = await request(app)
        .get("/0x1985365e9f78359a9b6ad760e32412f4a445e862/account/0x0372ee5508bf8163ed284e5eef94ce4d7367e522/balance")
        .expect("Content-Type", /json/)
        .expect(200)

    t.deepEqual(
        res.body,
        31824654531310477000
    )
})

test("/:token/:account/balance good time", async t => {
    const res = await request(app)
        .get("/0x1985365e9f78359a9b6ad760e32412f4a445e862/account/0x0372ee5508bf8163ed284e5eef94ce4d7367e522/balance?time=1")
        .expect("Content-Type", /json/)
        .expect(200)

    t.deepEqual(
        res.body,
        0
    )
})

test("/:token/:account/balance bad (decimal) time", async t => {
    const res = await request(app)
        .get("/0x1985365e9f78359a9b6ad760e32412f4a445e862/account/0x0372ee5508bf8163ed284e5eef94ce4d7367e522/balance?time=1.6")
        .expect(400)
        .expect("Content-Type", /json/)

    t.deepEqual(
        res.body,
        { error: "time must be an integer" }
    )
})

test("/:token/:account/balance bad (string) time", async t => {
    const res = await request(app)
        .get("/0x1985365e9f78359a9b6ad760e32412f4a445e862/account/0x0372ee5508bf8163ed284e5eef94ce4d7367e522/balance?time=abcd")
        .expect(400)
        .expect("Content-Type", /json/)

        t.deepEqual(
            res.body,
            { error: "time must be an integer" }
        )
})

test("/:token/:account/balance scientific notation time", async t => {
    const res = await request(app)
        .get("/0x1985365e9f78359a9b6ad760e32412f4a445e862/account/0x0372ee5508bf8163ed284e5eef94ce4d7367e522/balance?time=1e10")
        .expect("Content-Type", /json/)
        .expect(200)

    t.deepEqual(
        res.body,
        31824654531310477000
    )
})


const calculations = require("./calculations")

const DATA = calculations.buildDataStructure([
    {
        "token": "allomancy",
        "sender": "",
        "recipient": "bob",
        "value": 10,
        "timestamp": 1
    },
    {
        "token": "allomancy",
        "sender": "",
        "recipient": "alice",
        "value": 60,
        "timestamp": 1
    },
    {
        "token": "allomancy",
        "sender": "alice",
        "recipient": "jennifer",
        "value": 55,
        "timestamp": 2
    },
    {
        "token": "allomancy",
        "sender": "bob",
        "recipient": "jennifer",
        "value": 4,
        "timestamp": 3
    },
    {
        "token": "allomancy",
        "sender": "bob",
        "recipient": "alice",
        "value": 1,
        "timestamp": 4
    },

    {
        "token": "hemalurgy",
        "sender": "",
        "recipient": "bob",
        "value": 4000,
        "timestamp": 1
      }
])

test("calculateAverage", async t => {
    t.deepEqual(
        calculations.calculateAverage(DATA, "allomancy"),
        BigNumber(20)
    )

    t.deepEqual(
        calculations.calculateAverage(DATA, "hemalurgy"),
        BigNumber(0)
    )
})

test("calculateMedian", async t => {
    t.deepEqual(
        calculations.calculateMedian(DATA, "allomancy"),
        BigNumber(4)
    )

    t.deepEqual(
        calculations.calculateMedian(DATA, "hemalurgy"),
        BigNumber(4000)
    )
})

test("calculateRichest", async t => {
    t.deepEqual(
        calculations.calculateRichest(DATA, "allomancy", 0),
        undefined
    )
    t.deepEqual(
        calculations.calculateRichest(DATA, "allomancy", 1),
        "alice"
    )
    t.deepEqual(
        calculations.calculateRichest(DATA, "allomancy", 2),
        "jennifer"
    )
    t.deepEqual(
        calculations.calculateRichest(DATA, "allomancy"),
        "jennifer"
    )
})

test("calculateMostActive", async t => {
    t.deepEqual(
        calculations.calculateMostActive(DATA, "allomancy", 0),
        undefined
    )
    t.deepEqual(
        calculations.calculateMostActive(DATA, "allomancy", 1),
        undefined
    )
    t.deepEqual(
        calculations.calculateMostActive(DATA, "allomancy", 2),
        "alice"
    )
    t.deepEqual(
        calculations.calculateMostActive(DATA, "allomancy", 4),
        "bob"
    )
    t.deepEqual(
        calculations.calculateMostActive(DATA, "allomancy"),
        "bob"
    )
})

test("calculateActivity", async t => {
    t.deepEqual(
        calculations.calculateActivity(DATA, "allomancy", "bob", 2),
        BigNumber(0))
    t.deepEqual(
        calculations.calculateActivity(DATA, "allomancy", "bob", 3),
        BigNumber(1))
    t.deepEqual(
        calculations.calculateActivity(DATA, "allomancy", "bob", 4),
        BigNumber(2))
    t.deepEqual(
        calculations.calculateActivity(DATA, "allomancy", "bob", 5),
        BigNumber(2))
    t.deepEqual(
        calculations.calculateActivity(DATA, "allomancy", "bob"),
        BigNumber(2))

    t.deepEqual(
        calculations.calculateActivity(DATA, "allomancy", "alice", 1),
        BigNumber(0))
    t.deepEqual(
        calculations.calculateActivity(DATA, "allomancy", "alice", 2),
        BigNumber(1))
    t.deepEqual(
        calculations.calculateActivity(DATA, "allomancy", "alice"),
        BigNumber(1))

    t.deepEqual(
        calculations.calculateActivity(DATA, "allomancy", "jennifer"),
        BigNumber(0))

})

test("calculateBalance", async t => {
    t.deepEqual(
        calculations.calculateBalance(DATA, "allomancy", "bob", 0),
        BigNumber(0))
    t.deepEqual(
        calculations.calculateBalance(DATA, "allomancy", "bob", 1),
        BigNumber(10))
    t.deepEqual(
        calculations.calculateBalance(DATA, "allomancy", "bob", 3),
        BigNumber(6))
    t.deepEqual(
        calculations.calculateBalance(DATA, "allomancy", "bob", 4),
        BigNumber(5))
    t.deepEqual(
        calculations.calculateBalance(DATA, "allomancy", "bob"),
        BigNumber(5))

    t.deepEqual(
        calculations.calculateBalance(DATA, "allomancy", "jennifer", 1),
        BigNumber(0))
    t.deepEqual(
        calculations.calculateBalance(DATA, "allomancy", "jennifer", 2),
        BigNumber(55))
    t.deepEqual(
        calculations.calculateBalance(DATA, "allomancy", "jennifer", 2),
        BigNumber(55))
    t.deepEqual(
        calculations.calculateBalance(DATA, "allomancy", "jennifer", 3),
        BigNumber(59))
    t.deepEqual(
        calculations.calculateBalance(DATA, "allomancy", "jennifer"),
        BigNumber(59))

    t.deepEqual(
        calculations.calculateBalance(DATA, "allomancy", "alice", 0),
        BigNumber(0))
    t.deepEqual(
        calculations.calculateBalance(DATA, "allomancy", "alice", 1),
        BigNumber(60))
    t.deepEqual(
        calculations.calculateBalance(DATA, "allomancy", "alice", 2),
        BigNumber(5))
    t.deepEqual(
        calculations.calculateBalance(DATA, "allomancy", "alice", 4),
        BigNumber(6))
    t.deepEqual(
        calculations.calculateBalance(DATA, "allomancy", "alice"),
        BigNumber(6))

    t.deepEqual(
        calculations.calculateBalance(DATA, "hemalurgy", "bob"),
        BigNumber(4000))

    t.throws(() => calculations.calculateBalance(DATA, "hemalurgy", "jennifer"), TypeError)
})
