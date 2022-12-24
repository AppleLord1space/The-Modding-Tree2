addLayer("c", {
    branches: [],
    name: "collapse", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "δ", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,
		points: new Decimal(0),
    }},
    color: "#DE7200",
    requires: new Decimal(1), // Can be a function that takes requirement increases into account
    resource: "pressure", // Name of prestige currency
    baseResource: "matter", // Name of resource prestige is based on
    baseAmount() {return player.points}, // Get the current amount of baseResource
    type: "static", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 0.5, // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        exp = new Decimal(1)
        return exp
    },
    row: 0, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
        {key: "c", description: "C: Collapse for pressure", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    layerShown(){return true},
    upgrades: {
        11: {
            description: "Gain 0.1 matter per second",
            cost: new Decimal(1),
            effect() { return new Decimal(0.1) },
            effectDisplay() {return format(upgradeEffect("c",13)) + "x"},
         },
         12: {
             description: "Double matter generation",
             cost: new Decimal(1),
             effect() { return new Decimal(2) },
             effectDisplay() {return format(upgradeEffect("c",13)) + "x"},
             unlocked() { return hasUpgrade("c",11) }
          },
          13: {
              description: "Double matter generation",
              cost: new Decimal(1),
              effect() { return new Decimal(2) },
              effectDisplay() {return format(upgradeEffect("c",13)) + "x"},
              unlocked() { return hasUpgrade("c",12) }
           },
           14: {
               description: "Unlock fusion",
               cost: new Decimal(5),
               effect() { return new Decimal(1) },
               unlocked() { return hasUpgrade("c",13) },
            },
    },
    
})
addLayer("f", {
    branches: ["c"],
    name: "fusion", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "λ", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: false,
		points: new Decimal(0),
        best: new Decimal(0),
    }},
    color: "#53FFA1",
    requires: new Decimal(5), // Can be a function that takes requirement increases into account
    resource: "energy", // Name of prestige currency
    baseResource: "pressure", // Name of resource prestige is based on
    baseAmount() {return player.c.points}, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
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
        {key: "f", description: "F: fuse matter for energy", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    decay() {
        player.f.points = new Decimal(player.f.points * 0.995)
    },
    layerShown() {if (hasUpgrade("c",14)) {return true} else if (player.f.best > 0) {return true} else {return false}},
    upgrades: {
        11: {
            description: "Gain 0.1 matter per second",
            cost: new Decimal(1),
            effect() { return new Decimal(0.1) },
            effectDisplay() {return format(upgradeEffect("c",13)) + "x"},
            unlocked() { return false }
         },
    },
    milestones: {
        0: {
            requirementDescription: "1 Energy at once",
            effectDescription: "blah",
            done() { return player.f.points.gte(1) }
        }
    },
    
})