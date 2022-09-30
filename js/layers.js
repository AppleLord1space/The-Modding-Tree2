addLayer("c", {
    branches: ["le","li"],
    name: "compact", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "C", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,
		points: new Decimal(0),
    }},
    color: "#FF6747",
    requires: new Decimal(10), // Can be a function that takes requirement increases into account
    resource: "fruit crystals", // Name of prestige currency
    baseResource: "points", // Name of resource prestige is based on
    baseAmount() {return player.points}, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 0.5, // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        exp = new Decimal(1)
        if (hasMilestone('c', 0)) exp.add(0.2)
        return exp
    },
    row: 0, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
        {key: "c", description: "C: Reset for fruit crystals", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    layerShown(){return true},
    upgrades: {
        11: {
            title: "Exponential!",
   		 description: "make you better",
   		 cost: new Decimal(1),
            effect() {
                return player[this.layer].points.add(1).pow(0.5)
            },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" }, // Add formatting to the effect
        },
        12: {
            title: "Pallet synergy.",
   		 description: "increases lemon and lime gain based on fruit crystals. (Also increase point gain a little)",
   		 cost: new Decimal(500),
            effect() {
                return player[this.layer].points.add(1).pow(0.05)
            },
            effectDisplay() { return "le/li multi: " + format(upgradeEffect(this.layer, this.id))+"x" }, // Add formatting to the effect
        }
    },
    achievements: {
        11: {
            name: "Money",
            done() {
                return (player.points > 10000)
            },
            onComplete() {
            
            }
        },
    },
    milestones: {
        0: {
            requirementDescription: "10k apples",
            effectDescription: "fruit crystal gain ^1.2",
            done() { return player.points.gte(10000) }
        }
    },
})
addLayer("le", {

    name: "lemonize", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "LE", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,
		points: new Decimal(0),
    }},
    color: "#FFEF29",
    requires: new Decimal(10), // Can be a function that takes requirement increases into account
    resource: "lemons", // Name of prestige currency
    baseResource: "fruit crystals", // Name of resource prestige is based on
    baseAmount() {return player.c.points}, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 0.5, // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
        if (hasUpgrade('li', 11)) mult = mult.add(Math.log(player.li.points.add(1)))
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        exp = new Decimal(1)
        return exp
    },
    row: 1, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
        {key: "l", description: "l: Reset for lemons", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    layerShown(){return true},
    upgrades: {
        11: {
            title: "More points now!",
   		 description: "Increase point gain by lemons^0.5",
   		 cost: new Decimal(1),
            effect() {
                return player.le.points.pow(0.5)
            },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" }, // Add formatting to the effect
        }
    },
    challenges: {
        11: {
            name: "Gauntlet of lemongrab",
            challengeDescription: "apple gain ^ 0.2",
            canComplete: function() {return player.points.gte(100^challengeCompletions('le', 11))},
            goalDescription:"Aquire 100 apples.",
            rewardDescription:"apple gain is multiplied by 10",
            rewardEffect() {return 100}

        }
    }
    
    

})
addLayer("li", {
    name: "lime", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "LI", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,
		points: new Decimal(0),
    }},
    color: "#00FF04",
    requires: new Decimal(10), // Can be a function that takes requirement increases into account
    resource: "limes", // Name of prestige currency
    baseResource: "fruit crystals", // Name of resource prestige is based on
    baseAmount() {return player.c.points}, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 0.5, // Prestige currency exponent
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
        {key: "l", description: "l: Reset for lemons", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    layerShown(){return true},
    upgrades: {
        11: {
            title: "Sour solution",
   		 description: "Increase lemon gain using limes but have 10% less point gain",
   		 cost: new Decimal(3),
            effect() {
                return Math.log(player.li.points.add(1))
            },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" }, // Add formatting to the effect
        }
    },
    challenges: {

    }
    
    

})
