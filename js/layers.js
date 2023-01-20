addLayer("n", {
    branches: [],
    name: "Nova", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "Ψ", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,
		points: new Decimal(0),
    }},
    color: "#42039C",
    requires: new Decimal(1), // Can be a function that takes requirement increases into account
    resource: "Nova", // Name of prestige currency
    baseResource: "stardust", // Name of resource prestige is based on
    baseAmount() {return player.points}, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 0.5, // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
        if (hasUpgrade("n",11)) mult = mult.times(Math.log(player.points+1)+1)
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        exp = new Decimal(1)
        return exp
    },
    row: 0, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
        {key: "n", description: "N: Collapse your stardust into nova", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    layerShown(){return true},
    buyables: {
        11: {
            cost(x) { let a = new Decimal(x).pow(3).add(1) 
            if (getBuyableAmount("n",12) > 0) a = a.div(buyableEffect("n",12))
            return a
            },
            title() { return "Formation Alpha" },
            display() { return "Boosts stardust gain by " + format(buyableEffect("n",11)) + "x<br>Cost: " + format(this.cost()) + " nova"},
            canAfford() { return player[this.layer].points.gte(this.cost()) },
            buy() {
                player[this.layer].points = player[this.layer].points.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            effect(x) { let a = new Decimal(x).pow(2).add(1) 
            if (hasAchievement("a",12)) a = a.times(new Decimal(4))
            return a
            },
        },
        12: {
            cost(x) { return new Decimal(x).pow(4).add(7) },
            title() { return "Formation Beta" },
            display() { return "Divides formation a cost by " + format(buyableEffect("n",12)) + "x<br>Cost: " + format(this.cost()) + " formation alpha"},
            canAfford() { return new Decimal(getBuyableAmount("n",11)).gte(this.cost()) },
            buy() {
                setBuyableAmount("n",11,new Decimal(getBuyableAmount("n",11)).sub(this.cost()))
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            effect(x) { let a = new Decimal(x).pow(2).add(1) 
            return a
            },
        },
    },
    bars: {
        bar1: {
            direction: RIGHT,
            width: 500,
            height: 25,
            progress() { return new Decimal(player.n.points+1).div(new Decimal(500)) },
            unlocked() { return true },
            display() { return "Progress to collapse" }
        },
    },
    tabFormat: {
        "Nova": {
            content: [
                "main-display",
                ["bar",["bar1"]],
                "blank",
                "prestige-button",
                "blank",
                "milestones",
                "blank",
                "buyables",
            ],
        },
        "Collapse": {
            content: [
                "main-display",
                "blank",
                "milestones",
                "blank",
                "upgrades"
            ],
            unlocked() {if (player.n.points > 499) {return true} else {if (hasAchievement("a",13)) {return true} else {return false} }},
        },
    },
    upgrades: {
        11: {
            title: "ͱϘϱϟͳ",
            description: "multiply nova gain based off stardust",
            effectDisplay() { return "" + format(Math.log(player.points)) + "x"},
            cost: new Decimal(500),
        },
    }
}),
addLayer("a", {
    branches: [],
    name: "achievements", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "ϟ", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 4, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,
		points: new Decimal(0),
    }},
    color: "#FFEC00",
    requires: new Decimal(Infinity), // Can be a function that takes requirement increases into account
    resource: "achievements", // Name of prestige currency
    baseResource: "stardust", // Name of resource prestige is based on
    baseAmount() {return new Decimal(0)}, // Get the current amount of baseResource
    type: "none", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 0, // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        exp = new Decimal(1)
        return exp
    },
    row: 0, // Row the layer is in on the tree (0 is the first row)
    layerShown(){return true},
    tabFormat: {
        "Achievements": {
            content: [
                "achievements"
            ],
        },
    },
    achievements: {
        11: {
            name: "Essence of creation",
            done() { return (player.n.points > 0) },
            tooltip: "Get 1 nova"
        },
        12: {
            name: "Stay in formation",
            done() { return (getBuyableAmount("n",11) > 4) },
            tooltip: "Aquire 5 formation alphas<br>Reward: 4x formation alpha's effect"
        },
        13: {
            name: "The great collapse",
            done() { return (player.n.points > 499) },
            tooltip: "Aquire 500 nova"
        },
    },
})