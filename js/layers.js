addLayer("n", {
    branches: [],
    name: "Nova", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "Ψ", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,
		points: new Decimal(0),
        autonova: false,
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
        if (hasUpgrade("n",11)) mult = mult.times(new Decimal(Math.log(player.points.add(1))).add(1))
        if (hasUpgrade("n",13)) mult = mult.times(new Decimal(2))
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
        13: {
            cost(x) { return new Decimal(10).pow(new Decimal(x).sub(buyableEffect("n",15))) },
            title() { return "Stardust Galaxy" },
            display() { return "Multiplies stardust by " + format(buyableEffect("n",13)) + "x<br>Cost: " + format(this.cost()) + " stardust"},
            canAfford() { return player.points.gte(this.cost()) },
            buy() {
                player.points = player.points.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            effect(x) { let a = new Decimal(x).pow(1.1)
                if (getBuyableAmount("n",14) > 0) a = a.times(buyableEffect("n",14))
            return a
            },
        },
        14: {
            cost(x) { return new Decimal(1000000).times(new Decimal(100).pow(x)) },
            title() { return "Stardust accelerator" },
            display() { return "Multiplies stardust galaxies effectiveness by " + format(buyableEffect("n",14)) + "x<br>Cost: " + format(this.cost()) + " stardust"},
            canAfford() { return player.points.gte(this.cost()) },
            buy() {
                player.points = player.points.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            effect(x) { let a = new Decimal(x).add(1).pow(2)
            return a
            },
            unlocked() {return hasMilestone("n",0)}
        },
        15: {
            cost(x) { return new Decimal(50).times(new Decimal(1).add(x).pow(x)) },
            title() { return "Crystalline assimilator" },
            display() { return "Lowers the cost of stardust galaxies by " + format(buyableEffect("n",15)) + " cost-steps<br>Cost: " + format(this.cost()) + " crystalline"},
            canAfford() { return player.crystalline.gte(this.cost()) },
            buy() {
                player.crystalline = player.crystalline.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            effect(x) { let a = new Decimal(x)
            return a
            },
            unlocked() {return (getBuyableAmount("n",14) > 0)}
        },
    },
    collapse(){
        if (novacap = "true") {
              if (player.n.points > 499) { player.crystalline = player.crystalline.add(1) }
              if (player.n.points > 499) { if (!hasUpgrade("n",15)) {setBuyableAmount("n",11,0)} }
              if (player.n.points > 499) { if (!hasUpgrade("n",14)) {setBuyableAmount("n",12,0)} }
              if (player.n.points > 499) { player.points = new Decimal(0) }
              if (player.n.points > 499) { player.n.points = new Decimal(0) }
        }
    },
    bars: {
        bar1: {
            direction: RIGHT,
            width: 500,
            height: 25,
            progress() { return new Decimal(player.n.points).div(new Decimal(500)) },
            unlocked() { if (hasUpgrade("n",11)) {return false} else {return true} },
            display() { return "Progress to collapse" }
        },
    },
    tabFormat: {
        "Nova": {
            content: [
                "main-display",
                ["microtabs",["n"]],
                ["bar",["bar1"]],
                "blank",
                "prestige-button",
                "blank",
                "blank",
                ["buyable",["11"]],
                ["buyable",["12"]],
                
            ],
        },
        "Collapse": {
            content: [
                ["display-text",
                    function() { return 'You have ' + format(player.crystalline) + ' crystalline' },
                    { "color": "magenta", "font-size": "24px", "font-family": "Comic Sans MS" }],
                "blank",
                "upgrades",
                "blank",
                "milestones",
                ["buyable",["15"]],
            ],
            unlocked() {if (player.n.points > 499) {return true} else {if (hasAchievement("a",13)) {return true} else {return false} }},
        },
        "Stardust Galaxies": {
            content: [
                ["display-text",
                    function() { return 'You have ' + format(getBuyableAmount("n",13)) + ' stardust galaxies' },
                    { "color": "blue", "font-size": "24px", "font-family": "Comic Sans MS" }],
                "blank",
                ["buyable",["13"]],
                ["buyable",["14"]],
                "blank",
                ["display-text",
                    function() { return 'You have ' + format(getBuyableAmount("n",14)) + ' stardust accelerators' },
                    { "color": "blue", "font-size": "24px", "font-family": "Comic Sans MS" }],
            ],
            unlocked() {return (hasUpgrade("n",12)) },
        },
    },
    
    passiveGeneration() {if (player[this.layer].autonova == true) {return 0.2} else {return 0}},

    upgrades: {
        11: {
            title: "ͱϘϱϟͳ",
            description: "multiply nova gain based off stardust",
            effectDisplay() { return "" + format(new Decimal(Math.log(player.points.add(1))).add(1)) + "x"},
            cost: new Decimal(1),
            canAfford() { if (player.crystalline >= this.cost) {return true} else {return false}},
            pay() { player.crystalline = player.crystalline.sub(this.cost)},
            currencyDisplayName: "Crystalline",
            currencyInternalName: "crystalline",
        },
        12: {
            title: "ζφͲϸ ϡϼϑ",
            description: "Unlocks stardust galaxies",
            effectDisplay() { return "..."},
            cost: new Decimal(1),
            canAfford() { if (player.crystalline >= this.cost) {return true} else {return false}},
            pay() { player.crystalline = player.crystalline.sub(this.cost)},
            currencyDisplayName: "Crystalline",
            currencyInternalName: "crystalline",
            unlocked() { return hasUpgrade("n",11)}
        },
        13: {
            title: "ξψϗϝϡͲ",
            description: "Doubles nova gain",
            effectDisplay() { return "..."},
            cost: new Decimal(1),
            canAfford() { if (player.crystalline >= this.cost) {return true} else {return false}},
            pay() { player.crystalline = player.crystalline.sub(this.cost)},
            currencyDisplayName: "Crystalline",
            currencyInternalName: "crystalline",
            unlocked() { return hasUpgrade("n",12)}
        },
        14: {
            title: "ϘϻϐϷ",
            description: "You keep formation betas on collapse",
            effectDisplay() { return "..."},
            cost: new Decimal(3),
            canAfford() { return player.crystalline.gte(this.cost) },
            pay() { player.crystalline = player.crystalline.sub(this.cost)},
            currencyDisplayName: "Crystalline",
            currencyInternalName: "crystalline",
            unlocked() { return hasUpgrade("n",13)}
        },
        15: {
            title: "ζγωϔͳ",
            description: "You keep formation alphas on collapse as well",
            effectDisplay() { return "..."},
            cost: new Decimal(5),
            canAfford() { return player.crystalline.gte(this.cost) },
            pay() { player.crystalline = player.crystalline.sub(this.cost)},
            currencyDisplayName: "Crystalline",
            currencyInternalName: "crystalline",
            unlocked() { return hasUpgrade("n",14)}
        },
        16: {
            title: "Ξσͱ϶ ϻϖ",
            description: "Multiplies stardust gain by 100.",
            effectDisplay() { return "100x"},
            cost: new Decimal(20),
            canAfford() { return player.crystalline.gte(this.cost) },
            pay() { player.crystalline = player.crystalline.sub(this.cost)},
            currencyDisplayName: "Crystalline",
            currencyInternalName: "crystalline",
            unlocked() { return hasUpgrade("n",15)}
        },
    },
    milestones: {
        0: {
            requirementDescription: "15 Crystalline",
            effectDescription: "Optionally gain 20% of nova gain per second, Also unlock stardust accelerators",
            done() { return player.crystalline.gte(15) },
            toggles: [["n", "autonova"]]
        }
    },
    clickables: {
        11: {
            display() {return "Obliterate all crystalline (YOU DO NOT GAIN ANYTHING, THIS ACTION IS NOT REVERSABLE)"},
            onClick() {player.crystalline = new Decimal(0)},
            canClick() {return true},
        },
        12: {
            display() {return "Obliterate all stardust accelerators (YOU DO NOT GAIN ANYTHING, THIS ACTION IS NOT REVERSABLE)"},
            onClick() {setBuyableAmount("n",14,0)},
            canClick() {return true},
        },
    }
}),
addLayer("a", {
    branches: [],
    name: "achievements", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "🏆", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 4, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,
		points: new Decimal(0),
    }},
    tooltip: "Achievements",
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
            tooltip: "Get 1 nova",
            image: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBxMSEhUQEhMVFRUVFRUPFRUVFRAVEBUVFRUWFhUVFRUYHSggGBolGxUVITEhJSkrLi4uFx8zODMtNygtLisBCgoKDg0OFxAQGC0dHR0tLS0tLSstLS0tLS0tLS0tLS0tLS0tKy0tKy0tKy0tKy0tLS0tLS0rNy0tLTYtKy0rK//AABEIAKkBKgMBIgACEQEDEQH/xAAcAAACAwEBAQEAAAAAAAAAAAACAwEEBQAGBwj/xAA5EAACAQIEBAQEBAQGAwAAAAAAAQIDEQQSITEFQVFhE3GBkQYUofAyscHRIiNCUhUzU5Lh8WKCsv/EABkBAAMBAQEAAAAAAAAAAAAAAAECAwAEBf/EAB8RAQEAAgMAAwEBAAAAAAAAAAABAhEDEiExQVETBP/aAAwDAQACEQMRAD8A9bho3L1KiJo07M0KUDysY9fKjp0ApUi1CJMoFpih2UPCCVMsuAGUFgzJXlTQtQ7FmUQoxF0bZKo2I8G5YiuoTRtNtUVE6VMs5SLG021TwgJUy60Q0gaNtnypCKlI0asEIshdGlUJUraWE+EvU06sNCr4D3BYeUqJbhSUltqVJKz1LEKvQEGl47D2WhmSpdTZryTRj4+VgUcfxXqpJbldVm7omq7rQTV0V0JVYXOpG5Tqzu+x005PQZHAswq7pB/Lt8vI0IYF89i1Ro20NsLGBUw2Uj5WLWxu1cMr6oTW4fpmQ+y9Y8zXwC3M2tSPS1aZVlgbhmegy49vOuFtCfD0N7EYFW29SpPCpKxXuj0YjgJkjSqUbFedIeZEuKkxdkWZwsViku0rNP0Zh6Zfp0yvQLlNkcYOVMhAbkBgxiZfFC2lTgKlTHyYuTFyNjtWcSVENkbklAWIDSOsYdlkMKTFSkAzmwJSFzq2Klas9wWmkWKsytCWoj5rqRKukJtSYrsmHyM94lJXk0l1bstXZfUyOL/FtOnG1JZpPm08tutt397hnoaa2OxEaazSaS2u9EvN8jPpcVjKzhOLu3FarVrkup874lxirVk3OTd/ZdkuXoZsarTvFtPqm016jzj2H9NPtCbkrszMZDUzOG8cdSmpX1slJd9n9UzCx/xTWp13CSi4xltZqTi7Na33SZPrb4p2mPr1lHDN9Q6fCbvXbmVsFxlSjGcdpJP/AINKhxJCaPu/RVPh0Y9GWKcKaajbUr4nGp3sVcJibPM2A3r0DwcQKeFjuzNlxBvnoBPGvqN2heuX60OIUoZdN1qefxOJklawzE418nqU80m9ULbs+M0r06Tk/M1o4KKV30OoYXLHM3uV8Ribu17IE8+Rt38E1kvT6mZicOrto0aEFJ3uKxsEtUzbbTBxdNWMuo7Gpi5WbMirO5bBHk1Ca7Kg6tV0K2c6MY5cr6/SdORYgzPhULNOZKUbF6DDTK8ZBqY8ySuJjYpnSqAZzWjIlnXOTJaFEvMRKZE0KymNI6U0Q6qFVIlecH10+otptHVaqZQxNToTUnFacyhjuIwp2vq3yQt9UkDXlZZnolq2zJrcZtZxV1fTNdZktHbp5syuK8Qcndv32j5JdvUxMRiG1lTeXvu7fp2DMBuWmnxLj8ndRb1b1vsnyXbQwa9dyd/vzImJkysxkTttTGFxVS3Ia56W9BEkNC1oYXFygk4vl6eqM/F1nOTk3d9QqYmcdTSTbZW2Nv4b4io/ypPd3j07rt19z0PziWmv1tr0Z4GN07rdam3Q4jdLNvz6EuTD3cV4s/NV6OWKZFTF8jF/xFCJcQd9CPSrd49DDHMa8UYEMc3vYasd1BcRmTchVjH+J69r/mdPiKttbyPN1cXc75l202N0rd43qnFLc9OmhVeIzu/JmZRSerGynyWwOo9musUoq0f+SlPE/wBTZl1ajvZC61R2sPMC9xY3Ep3sZlYbKRWqblsZpDO7V5Csg6SBuWiFj9BYWG7uOzgxjZWRFrHKsuU5dRniGbDEXZYzDSluJ+42KEUZjlMIVM52JU9CrOV2Gp6WCGkupdkSZyQOJnZAFWxMralP5hu52JrdTFx3F4wulqxPlWTw7iWNUFeyctuy8367GFipxyucnZvd873vZdNLeV7nPEZrz0Tekdszvu23s9tlzMbieI1cVLMo6KytHvbrrz/cMhrdE4zEJ7aLe3JX/XuUZMmZLko76v6FNJ72TVg1r1K8htao2IbHkJaNQ5i5M6c29xTYdBsTmC5ANnXDoNji0HGqJSJiCxpVqLHUqdylSqWZv0acbaeZLPxbD1TjGyIcWaCjHmA4IntTSmohK4+ceiChRugWtIVTkTJJDMiRWqANoLqdBFSYcmBOA8hLSHMXUWgyUbC5SRWJVWlIG4dQXYpEq+8vHW5oVUxzkrIyYSbLlCmzi3XZcZGlw9PmXW9SlGdh0ayY8SsWFOwyMyqkdcIaWFO+gcIsRSlbURiMU0bba/GpCPMzeI4hQvJ7IKljG4mB8S106Tjzk9Fa701dtdPPua1piyeL/EGfSGi69TCni7u7V331IlRfOy/MmdJ2uoqy5vRfUaSD6TicbKSS2SVtPv7sijOYyrKKlrdrs9b26vuV5zv27DyFtFKYmczpSFSY0hdokxbJkwRiubFtkyYDCFQyGyWwWYHZjrkHBYUZG3g6t4p9TBRocPr2Tj6r9Sec8Px31rJ3LELJW5/kZca4ccTY57i6ZVuTC8ZFR4h2EVq19TddjctLdWqVqgqMmw8rYeug7bKkFDZsHJ1BxFXkikiVpdWQiTJnIW2UkTtRJi7htgjQj67CRco4mxj06z2DlWucD0LGpLFLqTDE9zGnM6FZoOw09TQr6FyLUjzNHF2RapcSsGVO4t6dkZvEcR0KVXipSqYpsNozBp0MRZamHx7WdOa7wfTXb9Rsa1hFWu27MEprircXqpNZcsUr22SunrqU8ZjLqeba7gl5cwcfh88n/FZRjmel9XJ6b9/qZeKneEZJ8sr819opJtK5aVastWJbIlICTLyI7S2BJgtgth0DmyGyLkXCDmCzmQYKhkMkgwIuRmJYIWEmHTnZr2FIhs1jba1NhOZlUqzjs/2LFHG/3L1X7Erx1ackW3JgTdxLxke/0AeLXJe4JhRucXqaGSl0MuGMa31+ho02pK6BljY2OUpFWYiTLNWmVKj6DYhQzAZzIZSJ1BFwrE5Qhp7l8QiNpVr6p3MKEh1KrbnY47i7Zk31IlTRixxMurD+cYvUe0arrPkQ8TbV3sY88dLloIlNtath6BcmpiOK/wBq9yjVx85aOTt20/IrZQLjzGEuVq1QxcoPMn76p+ZqYbHKSu1Z8+lzAchlDF5OSabu+voC4tMtNHiWjk76NK9u2q/IxL6W833+9DYnXjPurP7+pm4xq7UdF0+/MfG/Rc59s+TAYVRisxaI1LBJbIuFkNAhtgyZgCyGQ5HZjA4FnXJRgCQGwGFnMFk2JUTAE6wxRCyBAlIlhyiQomGUIylUcXdP9mCzrgGH1MQ5Crgo64DbGdYhBxQBAw7nSQqxmeljTOcRkZgymjm27OqFEnISpDEkbbdS8gUYBJnOYNt1JlEXKBYsC0NKW4q6iROAckA33DsuiXEXUiOkFFeQdh1UpQAyFyqkLyjTIlxVsoLiWpRF5Q7DqrSQDLUqYlxGlJYQ0QOcRc0NKWwts5SOZCCUTmDmImxbkFrR5g4MQmMgYtqzBDqdJsPh+Ec3ZdUub38j3HDfg+SWeU4Rjlc1K6cXbTTvcrx8faocvNMI8fDhknyJxHB6sIeI6bUL2zNPL7n2j4e+H8JOleU1OXNWyuL6NPf8hfxlweriKKw9GrTUVq46JyttcrnxSeRzcf8Aptm6+Fzptb29BVRG9xr4cxND8dJ26x/iX0POVrrRprzViGWOnZx5ywSYVyo5BKRPS0yWlIJSKmYOMzaHss2OsBTqXG5RfT7j0GgEkIjX7k+Kjm07e0Oiws4iEuQTZm2Z4h2dv/sruoTGuuptNtYi39t/sc13/wDoFYpfaJeL6A9Hx3/rJ+j/AHO1/wBN+rSBeIb/AKrAOXWVwl8HO/SK9QY4Zvn7f9HKS5Rv5nOtLlFB9Dz7Nhgey9WiXgb72f8AusKjKr5egyCqf3MHv6Mk/B/I26ewDwa6j4wfN+41dxe1P0inHhye51TCU48rvsXJNHXiuZu1a8eLJqJa/wAt9ilUb/037m9OtoIjRk9R5mllx7ZCw91+G3mKeEXRo9A6IE6LXcb+hbwsF4IVLBmvUqpbpgRlFjTOp3jjH+UZcwHDpzklkuubT2XN+xo04xPofwbwWHhOvON02oJXs5Ws2vLRIaclvhMuKSbVeC8FjS8OSp73qTTzNRVrQhZa3teTf/ke64DVwjo5Iyjmks04vSUX0s72SPG4T45cXXjKjmnncYWyxpqO1m15LzPMU8RUzSqOVm9lFvTW+51cHJJLMvHnf6eHLLKXGbes+KfhmvCTq0G5R/F/DuvY8FiuI4inL/NmmuTb/JnocD8T4ik/xXXR7ew/iGOw2KX86CjL++Nk79+pbL/R3muzm4/8X87vp5XjK/xNi3o6uxSxHGJz/wAyMJPraz+hqY74ead4SU1ytv7GRW4e07P6nPlyZT5rvw4cPqKU6kX/AE29SFl7jKmGaF+Gxe5/56Q4RCjBBRiHkB3NMEwS5Mb6i1TCyi9zdFyEgs3czoV2MdS5O410Tki8prqFnXUzFPuMjN8gdBnIszrdEAqkulgbsha7mbdWKb6tDcy8ytCFw0wU0qxBroNUypGYzOLYba0phxqdyopAyqJA0PZoxrINV0ZSqN/sMVW2yBcR7r86vQDxreZRc5MKNPv5m03ZYTb5hKOgp1VFWFVsR3B63aOcm3YuUq9kkZHzST+gx4m7GuNDHOL9epfVeodGrybKUcRo0wVO4NG7LFdplPIrlhSuTGzNLotmwRpSWu/5m1gviGcIOmm0mrPlcy51FH9uYjxUw7rai7/iKu+QE8T3XuinOnGRTrU5R2Y+Oks5Z7psLFBK0mlex53x+TCVVrVMfql3emdOVPWMnpqVamKzfiXqZX+JT2uCsW3ujTtGswrRlRjLVMViMNbuV6dXUsVMRpuHcbVnxVJx7EMtRknyClBB1Cy1QcgPELdSkV/CQdNsmlSZYjRXNhI5iW2nmMglCIdgYjkLTwloiwciGZhwm0t7AuSAkCzabZiq2J8cTIFh0G1hVrhJoVSGANDlIZEQxkSdHZ+dFavXaBmKrbBka1NKTbArwd9wsLuTLmN9lvwz3LVffMt0palSQ+gPknjfVua6AU6lhhXW5OLWrTncDNz1IgEtgfA78F419wZsCX6ATDoOyJT7hyqadSvUInsNIW5UFVplOdVpjZ7iKpfGObOmKqWcLVSepQQ6mawuOV20qtRPVCFVV/4rtdE7C0LYkiuVX6eJgtlL/cuj7eQ54qHSXujLphMOgl8XXioa79r7+4j5gqyAGJX/2Q=="
        },
        12: {
            name: "Stay in formation",
            done() { return (getBuyableAmount("n",11) > 4) },
            tooltip: "Aquire 5 formation alphas<br>Reward: 4x formation alpha's effect",
            image: "data:image/jpeg;base64,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"
        },
        13: {
            name: "The great collapse",
            done() { return (player.crystalline > 0) },
            tooltip: "Collapse your nova<br>Reward?: 1/3 stardust gain.",
            image: "data:image/jpeg;base64,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"
        },
        14: {
            name: "Ten is a lot!",
            done() { return (player.crystalline > 9) },
            tooltip: "Get 10 crystalline",
            image: "data:image/jpeg;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAYAAABw4pVUAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAABGNSURBVHhe7Z1nqF3FFscnPgsasWHviVivoGIBERs2LFhiRVSMXPWD2LAgYnmoiEaxxg8SsXyI+SCKvaDgNaKCNbaIPRpUsCMq2N/85s7/3slk9j67nn2u7/5gOLNn91kza61p+0z5x2ImGRiW8b+TDAiTAhkw/rUq648//jALFy508W222cYst9xyLj7oDFwNmTJlitlll12WCKTNmzcvc5+47rrr3Pb06dPNPffcY5Zffnmz0kormfvuu89su+22bt9ZZ53ljx5QqCGDROqRDjzwwH+GhoaS+5R25ZVXuvj333/vtrPgmBkzZvitwWNCCGTRokUuPbVPafyeeeaZLp7HnDlz3LG9BNcVE0IgQHpqH2nnnHNO5nkpOPb888/3W4PFhBHI7NmzMwWy0UYbJTMYNbbPPvv4rXHuvffeUgLsJxPG7Z05c6aPLc3ixYvNDjvs4LfG+frrr523FbPFFlv42OAxYQSCt5THBhts4GO92Xjjjd0vXtcpp5ySFFpXDIRAyJDLLrtsCRc2hVVLPtYM1rCbu+66y7nH3PuCCy7we7qjM4H8+uuvY+0G2hP77bcfSt3vTcPxWSyzTPlXWX311d09FVZccUX3PPvuu68/ogPsg/QdbqsQU/aRdJ0FCxb4lHFwg/fYYw+/NY61LZn3kVtcxIVug77WkAceeMCVwJ133tmpC3t/v2dwGB4eNvPnzzd33nmnOfXUU31q/+iLQJ5//nmnlo488kjz9NNPm5dfftmpi6Kg3vrJ7rvvbt59911zxx13+JT+0apAyEhqhFUbZs8993Q1oop+Puqoo3wsmx9//NHHmmGTTTZxz8vzE/pFqwKZOnWqOeGEE8yiRYtyDXIvnnjiCR/rP7/88ov7RSg//PCDi7dJawJRqTruuONcaatLv9WWoP1DTcG2rLHGGj61PVoRCLYCww0HH3yw+03x2GOPjYVnnnnGp6a57bbbfCzNO++842PjrLbaaj62JJ9//rmPFcd6X2ZkZKR99WWl3yi4mVy2yqVfffXV5Hl51yPdqsV/Dj30UJ8yjnUgnBsbQ7+XLTB+qxycyz3nzp3rU5qlcYFYu5GZeUVInUsaIdVlTjoZX+aeHHvppZf6rfKoc7KNLvzGBcKD3n///X6rPKmMJY2Q6tHV8fwyiNULlXBrrH1KNfRMTdPoFSl1qIiFCxdWLj2plySNbvSsfUAhII7ay0IDXXVqR0jqeerS2BVnzpzpHnDzzTevpV/R7Wuuuaa7ln4V4m3UYzzewXBveEwYtt9+e39UM/z+++/uunU0Qkwjs04YX/jwww9dfMaMGWPuIZ5JVXBzacfQst9uu+3MWmut5fcMFt98841Ze+21XXul1xBBIZxYaoAu5jJSGRjY+fPnu1/A66IUf/DBB267F1yPWobnNFFQh2QT1L4KDxIH9Dj6GkGgvjC2/KIyegmmLXeybXjv1HBxWSoLRDVDbQcFurargjuZAgdhkKfuCN6/ritcSSDcVAYWw0qVpRYQf/TRR90xqJ06whEYzjzPaZCgkBZxvfOoJBDZC4ImqDGgg6CwGaidm266yaWToVVgas9EhHfGhlalkkBCYaBKsBeQGrXjmLJCKeoA1IUS3TTKm6qUPpNaoJvWufEgQNupaWRbq9qSyr291ob42MSFYdoUb775po+VR22Ryy+/3P2WpbRA1OjbcMMNXcPt3wYNvY8//thvVYNlELfeeqvfKomvKYXhFHWTZLmpRemXrchi2rRpPjaOvMQ6qEulyrVKCUT6kUCfUR1wBJrq5KsK7xESb9dhZGSk0vVKncENaG3zW8e1o31StwHVBGGG0W5KDXLVoYpACtsQhlnhu+++M7aqmx133NFtv/baa+43j3ju7LLLLptcycR0oS646qqrzEknnWQeeughn9IcpecCeMH0RDVDQ7RqWxRtjes4WvV0savt0tUMQdDr80t7qWkYDCvbNV9YIDx0XKURTtlGH6qKntyuVRYOhQoD79ZWwSCPylBIZX322Wfud5VVVnG/wEzEW265pfTq1j///LOzKT0xck1tbW1NXeIC40oXpZBAvv32W9cQfP/9932KMa+88oobOCoLMwwRStcwqDZ79mwXZ97YGWec4eJNQ95peXYhfE3JhcMUYNasWWPxsuA601PcpcqSHYzfoeo75ZG6Tx6FjuSC6m7HuJOpNKoQTBVwmZvomq+CZp3gWKQKRdOuL/fhfkWHEHoKhIfmggTGOzTBTGlVoAXbhleTh2q1Ql4ruslnYxiBRjSLVovQ04YwhRP7MTQ0NDbxGNS5eOKJJ7rfMjz44IM+1jy0l84991y3CJQZ95q9fuGFF7r9TP62tTN3iuuxxx471u5qAtabFMYLJhOqOGMeLD3mcI2IUYrUNokDpSHP/0ZlVSmFDHpxbS2RJuCuhvfOCgya0QYqg9pKdZCGKVpDCgtENkSQRrWXTiZkdTaSEcPDw35rVCB5/Vi0bcgM2itcF1VJ0H2yQuqYrmlFIHgl9PWEpZ5MI2Mxgnr5sETRI0ytCo03xyA0TZuRPQJmbBB0rSqBZ5XTIWPaNWUFUqgdgg5kItzpp5/uU4xrEG611VZjjUV7Q/Piiy+6uLj22mvN3Xff7eJabrDCCiuYK664wi1xZmkbS5GtkNz+I444wh0Tgs7vBQ07+y5uUdALL7xgbrjhBnPaaacZW4j8Ed2x8sor+1hBRuWSDbWAwwipyWvapymcgq4JtqW3w+OwQymXE3RcVgjbEHmeErWl7nhNE6iGZL1vTE+B6IIEdDSqijQyA3WkDEJFILxQbTEmoInXugbHI5CUcEHHEbKcBoIGtzDWBLbDuVsau+mash/G6amy4tWyfPWAYdyPPvrI9UnpMxWorvPOO891x/NVBtzGn3/+2bz33ntLLAVD/b3xxhtuPFt9ZCIey16wYIGPja5XBJvpritC6uiTTz4xRx99tHn77beNtXEuDRqZZ9sADDVYO+u3CuAFkwuHYXBRN6oRmvKpbbwmflVDqEkEqTJ5QNQYSLXycYU5hsD9OAdnIjT21LoQzkl15VB7wxojeE49M7UU75HnbAvuk3qOLAoLhMDLKGMlEKkGMob98m6yAiAUzoszNzyODCWzwkJAOyTWxXRJkKFx1wTPE3uFuN5ypaXysHFNd5eEhPcqQiEvKyT+uoFWqeI9sdgTVUVLGPVhG23+qFFsxjqVtvXWW7vz+DilCJcbcN7FF19snnzySfP444+7FjfYTHU9ByGMXOLxoTK1JAJYxnDzzTe7OC11VC3fMsED43ml8lhd+/DDD7t4W5Ty9pxYeoBxpWZQQmWkUh4MJRJjz35qC6UybDgSUuqB2qb98UwQtcSp9vjylHzunbqOkPfFMxP0zFkllX1tUfbahQXChclkvRwBdRKDDeHFpY4QiLpdCHkZmYfUFs+CeiLTeZ4Y1CFTWhEs6lMqNg95jG2ADSxDIZXFyCA88sgj7jsgdDQCX1iIv+TGYA9VVGoGNXH44Ye7OHz55Zc+lga1J/DQBN6crR1ONe20006uc3CdddZxHh3emgINw5NPPtkccsghzhtDpYWdoikYrGpjhRbfSrnmmmv8VkG8YHoibwkVQskkHgYZ+RjUXNgBiFHV6iqIa4y8NN0DDwtjLANNTSGN69CeoQZwPV2HmhmqwCLgYLRRQ4reP6TwGagJbsDLo4ZioaDKUq3RWCBF+3QAe8E5ZD4qSN4QGSgBkPncO3SNFZct6QUqtqoqzYJr8gxlKXUGN5AuT9USQgyZJRuCTkdoWS9PTQjbJ9L/cSiSeanCkYXaRk2C48GzlqWU20snXq8vesYzLBjkp7UKTIyg5f/WW2+57RDOQ+c+++yzPmXU/gjsgeAavb6NUuZ7XG1w/PHH+1hJvGAKQcnkFFQIuh5VlCrFQrUJOJ7ST0MstbBHagZQi3Kfs5AabIKm1RXvWvXZSp/FjchUbooKwtiSFgb2a4Y8rW2hB00tlNG5gLpB1WEzUGO4jtpPYRAIDcOe6obpkvBdylJJIGQShp3MCAXCtuJkHL+x94IQaUuEYOg1IqmAjeJcBaH9AiHjOAwK6kqqujqrtEDC0ooxlEBQT7SmtS9UKXhIqCRcZ2qP0oXOIYQucQq9sNxgoIYgwEFAeVDGqQgpLRDghmq9KzOU0WGg5FL6VSPQ1Qgl7P2k9HNsDCU/66VIl+cmqGHU3CwQJM+qZyvqEpeFa9dRoaU7F8FmrBursOrHbWtMJAsrGPdLJyCt+3AqKd8JserPb43DPQ444ABz2GGH+ZRx8KDoNQixfn/yK6IshdCfvzAVyAoTKeZOA6qK5izX+kL2qFzKw6kEqQrVENUcAnaEGoJtEdqH6pP6ozZkwf6s0kzDMWxDpBqduh+BWtUW1FruUdeeVRYI8ABqPWsGCsYs7OHFxeVXoDrkgSnEhj+EfWR8FqEtia+jxivPVlWnFyF0bOpS+wo8BC+LMBBEaNi1j7TQ/RXUEPQtNQhB5ZHVVggFEmY6XRd4dCocbcFzcX3ev4kWfyMCIVA65QqjOpROJskzIsRQ+lF3eXC9LIHQMA2R2tL9UvdsEjVgm+p+qf206gCsE6gpqJe4LaJAOmonRep4CkXoUYVBhD3CccBlBzI5tT8V4oJRldpflGNIl+/jWgPuU0ZnpjA8ywyTcNVVCqty3DiHwLsKV2UxLKv+M+syuyHdEIZn8bDk4fz0009uqNg6F2avvfZyYyOgZ+J1+Qs9vu2Ol8hkvRAm22liNhP41l9//czv/4rw2rVBIHXAQKf8bi5dxJBKvRU5NvW4WWmE2BkgTV5gL9QPl+dwhBS5ZhEqtUPaIO6dLbLcOgvb2vexpaH9RIiJ54j16k1ui1YFwlxfFlOmFlQ+99xzLt22QZyKCaErnmHacAgXrCdTaMFor39giNdGsmZ+00039VujSG2i0rLeASGSXqfwLIWvKZXJU1kKVP+YcH/cD4WaID3upsfY4sqGcFwKHIWUykodL/UUo+OzzosdgyZotYbY6/tYGlTL8PCwm38VwoQD23ZxhlkroAgsY9aqKP5dLY88tVUG3iHvPWzh6XlMGVq3IWR4Fnhhe++9txtJjMH7Qp2BdXvHXprPQgH/roZgsmD2Cx5bHdRX1086Neqffvrp2BShlI4mUymBDAOT+bjAZ599thMWLvC0adP8kWmoYU2QJ/imP4LQqUDWXXddN6WUjMWwh1NBBepL6kDtkc0228wt9H/qqafcdhaovbrkCaMNOhXI1Vdf7X6pKUCGZ02iQCjWULsSiZdE9znbMWU+Y1EE63Dk2gfbjvKxZuhUILin8dgBtYRSmXIlb7zxxsYzvBcsv8tj11139bFm6FQgxxxzjLn++utdXEabgDGmHRILBQcg9ddGMfPmzfOxeqScjZjU4FodOhUIdmBO4h8U9MEzqTSBvVkYzM/KovKcqApI3TZFpwIB/gM3Jms5Gvaj6L9Cl/F+eg1B95POBZKV+bi2hBC6UnbbbTe/lU+q5onYm7v99tuT/Vtd0LlAtAyA/8kNSbmsrGOnzwmjr5AF31HMIvbkKBRx/1avnoCQOh9ejulcIEAbhHUhsVBC+MjN4sWLXZdIGGI0j5jGZAq1/qdPn+5+UyBMegJmzZrlU/Jp9INs1qupRd6IIWgWeCqEMB5Cx2HqOAJTS1OkjmV2SbhqKwxCEyBSgfHxeMg4dRwha2i5Ko38B1XT4GXpz4bbWNkUo7YNI4PhaGUXDKRA/p8ZCBsyyTiTAukT8de9Y7T/P/+1uNgkS8EMFDyoqVOnmtdff939yzSfJ8TOjIyMuBk1/LUFdo52DCu+5s6da1566SXz22+/uY5HvveC58dnzNk+6KCDzEUXXWT2339/N3TMgBu9D9gxPr4wKZAc/v77b7Pqqquav/76yy3nJtPoYf7qq6/Meuut5wTAPgT0xRdfuG3mEeBSkw7E+V7+0NCQ2XLLLd33sxgDou1iPUH3YR7OZQgCAU8a9ZrQZrnkkkv8Vl2M+R85Hhf1fkKdIgAAAABJRU5ErkJggg=="

        },
        15: {
            name: "Speedy",
            done() { return (getBuyableAmount("n",14) > 0) },
            tooltip: "Get a stardust accelerator",
            image: "data:image/jpeg;base64,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"

        },
        21: {
            name: "Layer 2?",
            done() { if (player.crystalline > 199) {if (getBuyableAmount("n",15) > 0) {return true} else {return false}} else {return false} },
            tooltip: "This is where the second layer would be, get 200 crystalline after getting two crystalline assimilators.",
            image: ""

        },
    },
})