addLayer("d", {
    branches: [""],
    name: "dots", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "D", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,
		points: new Decimal(0),
    }},
    color: "#FFFFFF",
    requires: new Decimal(10), // Can be a function that takes requirement increases into account
    resource: "dots", // Name of prestige currency
    baseResource: "points", // Name of resource prestige is based on
    baseAmount() {return player.points}, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 0.5, // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
        mult = mult.times( Math.pow(2,player.l.points))
        if (hasUpgrade("l", 11)) mult = mult.times( Math.pow(2,player.l.points))
        if (hasUpgrade("l", 12)) mult = mult.times( upgradeEffect("l", 12) )
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        exp = new Decimal(1)
        return exp
    },
    row: 0, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
        {key: "d", description: "D: Reset for dots", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    layerShown(){return true},
    upgrades: {
        11: {
            description: "Point gain increased based on dots.",
            title: "0 dimensional recursion",
            cost: new Decimal(1),
            effect(){
                get = Math.log10(player.d.points + 1)+1
                if (hasUpgrade("d", 12)) get = Math.pow(get,upgradeEffect("d", 12))
                return get
            },
            effectDisplay() { return format(this.effect())+"x" }
        },
        12: {
            description: "The previous upgrade's effect is boosted based on points.",
            title: "Dual core",
            cost: new Decimal(4),
            effect(){return Math.log10(player.points + 1)/2+1},
            effectDisplay() { return "^" + format(this.effect()) },
            unlocked() {return hasUpgrade("d", 11)}
        },
        13: {
            description: "Points increase point gain.",
            title: "Virus",
            cost: new Decimal(6),
            effect(){
                get = Math.pow(Math.log10(player.points + 1)/2+1,0.75)
                if (hasUpgrade("d", 15)) get = Math.pow(Math.pow(get,get),get)
                return get
            },
            effectDisplay() { return "x" + format(this.effect()) },
            unlocked() {return hasUpgrade("d", 12)}
        },
        14: {
            description: "Squares the effect of Learn to zoom in",
            title: "Dual dual core",
            cost: new Decimal(25000),
            effect(){return 2},
            effectDisplay() { return "^" + format(this.effect()) },
            unlocked() {return hasUpgrade("d", 13)}
        },
        15: {
            description: "Virus^Virus^Virus",
            title: "Infectivity increase",
            cost: new Decimal(1000000),
            effect(){return 5},
            effectDisplay() { return "I'll leave this one's effect to you." },
            unlocked() {return hasUpgrade("d", 14)}
        },
    },
})
addLayer("l", {
    branches: ["d"],
    name: "lines", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "L", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,
		points: new Decimal(0),
    }},
    color: "#FFFFFF",
    requires: new Decimal(10), // Can be a function that takes requirement increases into account
    resource: "lines", // Name of prestige currency
    baseResource: "dots", // Name of resource prestige is based on
    baseAmount() {return player.d.points}, // Get the current amount of baseResource
    type: "static", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 2, // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        exp = new Decimal(1)
        return exp
    },
    row: 1, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
        {key: "l", description: "L: Reset for lines", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    layerShown(){return true},
    upgrades: {
        11: {
            description: "Dot gain is increased based on lines again.",
            title: "1 dimensional recursion",
            cost: new Decimal(2),
            effect(){
                get = Math.pow(2,player.l.points)
                return get
            },
            effectDisplay() { return format(this.effect())+"x" }
        },
        12: {
            description: "There are an infinite number of dots on a line so dot gain x log10(dots).",
            title: "Learn to zoom in",
            cost: new Decimal(3),
            unlocked() {return hasUpgrade("l", 11)},
            effect(){
                get = Math.log10(player.d.points + 1)+1
                if (hasUpgrade("d", 14)) {get = Math.pow(get,2)}
                return get
            },
            effectDisplay() { return format(this.effect())+"x" }
        },

    },
})