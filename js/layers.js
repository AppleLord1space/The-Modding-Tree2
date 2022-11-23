addLayer("d", {
    branches: ["c"],
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
    exponent: 552, // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
        mult = mult.times( Math.pow(2,player.l.points))
        if (hasUpgrade("l", 11)) mult = mult.times( Math.pow(2,player.l.points))
        if (hasUpgrade("l", 12)) mult = mult.times( upgradeEffect("l", 12) )
        if (hasUpgrade("l", 13)) mult = mult.times( upgradeEffect("l", 13) )
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
                get = new Decimal(Math.log10(player.d.points + 1)/2+1)
                if (hasUpgrade("d", 12)) get = Math.pow(get,Decimal(upgradeEffect("d", 12)))
                if (get > 1e6) {get = 1000000 + (Math.pow(get-1000000,0.5))}
                if (get > new Decimal(1e9)) {get = new Decimal(1e9)}
                return get
            },
            effectDisplay() { return format(this.effect())+"x" }
        },
        12: {
            description: "The previous upgrade's effect is boosted based on points.",
            title: "Dual core",
            cost: new Decimal(4),
            effect(){get = new Decimal(Math.log10(player.points + 1)/2+1)
            if (get > 5) {get = 5}
            return get
            },
            effectDisplay() { return "^" + format(this.effect()) },
            unlocked() {return hasUpgrade("d", 11)}
        },
        13: {
            description: "Points increase point gain.",
            title: "Virus",
            cost: new Decimal(6),
            effect(){
                get = new Decimal(Math.pow(Math.log10(player.points + 1)/2+1,0.75))
                if (hasUpgrade("d", 15)) get = Math.pow(get,2)
                if (get > 50) {get = 50}
                return get
            },
            effectDisplay() { return "x" + format(this.effect()) },
            unlocked() {return hasUpgrade("d", 12)}
        },
        14: {
            description: "Squares the effect of Learn to zoom in",
            title: "Dual dual core",
            cost: new Decimal(25000),
            effect(){return new Decimal(2)},
            effectDisplay() { return "^" + format(this.effect()) },
            unlocked() {return hasUpgrade("d", 13)}
        },
        15: {
            description: "Virus^2",
            title: "Infectivity increase",
            cost: new Decimal(1000000),
            effect(){return new Decimal(2)},
            effectDisplay() { return "^" + format(this.effect()) },
            unlocked() {return hasUpgrade("d", 14)}
        },
        16: {
            description: "Point gain x 6",
            title: "The 6th",
            cost: new Decimal(15e6),
            effect(){return new Decimal(6)},
            effectDisplay() { return "x" + format(this.effect()) },
            unlocked() {return hasUpgrade("d", 15)}
        },
        17: {
            description: "line price scaling / 2 and unlock a new layer",
            title: "Repurpose some of the line",
            cost: new Decimal(1e9),
            effect(){
                return new Decimal(2)
            },
            effectDisplay() { return "/" + format(this.effect()) },
            unlocked() {return hasUpgrade("d", 16)}
        },
    },
})
addLayer("c", {
    branches: [""],
    name: "Dot Centrifuge", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "C", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: false,
		points: new Decimal(0),
    }},
    color: "#FFFFFF",
    requires: new Decimal(1), // Can be a function that takes requirement increases into account
    resource: "Centrifuge Essence", // Name of prestige currency
    baseResource: "dots", // Name of resource prestige is based on
    baseAmount() {return player.d.points}, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 0.3, // Prestige currency exponent
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
        {key: "c", description: "C: Sacrifice your dots to the gods in exchange for Centrifuge Essence", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    layerShown(){return hasUpgrade("d", 11)},
    upgrades: {
        11: {
            description: "tbd",
            title: "tbd",
            cost: new Decimal("1e315"),
            effect(){
                get = new Decimal(1)
                return get
            },
            effectDisplay() { return format(this.effect())+"?" }
        },
    },
    buyables: {
        11: {
            cost(x) { return new Decimal(1).add(getBuyableAmount("c",11)) },
            title() {return "Sacrifice your Centrifugal Essence for matter"},
            display() { return "you have: " + format(getBuyableAmount("c",11))},
            canAfford() { return player[this.layer].points.gte(this.cost(getBuyableAmount("c",11))) },
            buy() {
                player[this.layer].points = player[this.layer].points.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
        },
        21: {
            cost(x) { return new Decimal("1e9999999999") },
            title() {return ""},
            display() { return "red matter"},
            canAfford() { return player[this.layer].points.gte(this.cost()) },
            buy() {
                player[this.layer].points = player[this.layer].points.sub(this.cost())
            },
            unlocked() {return false}
        },
        22: {
            cost(x) { return new Decimal("1e9999999999") },
            title() {return ""},
            display() { return "green matter"},
            canAfford() { return player[this.layer].points.gte(this.cost()) },
            buy() {
                player[this.layer].points = player[this.layer].points.sub(this.cost())
            },
            unlocked() {return false}
        },
        23: {
            cost(x) { return new Decimal("1e9999999999") },
            title() {return ""},
            display() { return "blue matter"},
            canAfford() { return player[this.layer].points.gte(this.cost()) },
            buy() {
                player[this.layer].points = player[this.layer].points.sub(this.cost())
            },
            unlocked() {return false}
        },
    },
    clickables: {
        11: {
            title() {return "R-Matter"},
            display() {return "you have: " + format(getBuyableAmount("c",21)) + ". Current effect: " + format(clickableEffect("c",11)) + "x ???'s effect"},
            effect() {return Math.pow(getBuyableAmount("c",21),0.5)},
        },
        12: {
            title() {return "G-Matter"},
            display() {return "you have: " + format(getBuyableAmount("c",22)) + ". Current effect: " + format(clickableEffect("c",12)) + "x ???'s effect"},
            effect() {return Math.pow(getBuyableAmount("c",22),0.5)},
        },
        13: {
            title() {return "B-Matter"},
            display() {return "you have: " + format(getBuyableAmount("c",23)) + ". Current effect: " + format(clickableEffect("c",13)) + "x point gain."},
            effect() {return Math.pow(getBuyableAmount("c",23),0.5)},
        },
    },
    getMatterGen() {

        if (getBuyableAmount("c",11) > 0) {setBuyableAmount("c",21,getBuyableAmount("c",21).add(getBuyableAmount("c",11).divide(getBuyableAmount("c",21).add(1).divide(getBuyableAmount("c",11).times(getBuyableAmount("c",11))))))}
        
        if (getBuyableAmount("c",21) > 0) {setBuyableAmount("c",22,getBuyableAmount("c",22).add(Math.log10(getBuyableAmount("c",21).add(1))/300))}
        if (getBuyableAmount("c",22) > 0) {setBuyableAmount("c",23,getBuyableAmount("c",23).add(Math.log10(getBuyableAmount("c",22).add(1))/300))}
        if (getBuyableAmount("c",23) > 0) {setBuyableAmount("c",21,getBuyableAmount("c",21).add(Math.log10(getBuyableAmount("c",23).add(1))/300))}

    }
},
)
addLayer("l", {
    branches: ["d","c"],
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
        if (hasUpgrade("d", 17)) { exp = new Decimal(1.2) } else { exp = new Decimal(1) }
        return exp
    },
    row: 1 + 0,
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
                get = new Decimal(Math.pow(2,player.l.points))
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
                get = new Decimal(Math.log10(player.d.points + 1)+1)
                if (hasUpgrade("d", 14)) {get = Math.pow(get,2)}
                return get
            },
            effectDisplay() { return format(this.effect())+"x" }
        },
        13: {
            description: "There is a smaller, identical dot in every dot so dot gain x 1000",
            title: "Zoom into a dot",
            cost: new Decimal(7),
            unlocked() {return hasUpgrade("l", 12)},
            effect(){
                get = new Decimal(1000)
                return get
            },
            effectDisplay() { return format(this.effect())+"x" }
        },

    },
})

