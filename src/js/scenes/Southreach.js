import { Actor, Color, CollisionType, Axis, BoundingBox, Scene, Vector, Keys, Label, Font, FontUnit, Canvas, Timer } from "excalibur"
import { Drone } from "../drone"
import { Player } from "../player"
import { Poster } from "../poster"
import { Trader } from "../trader"
import { ChoiceNpc } from "../choicenpc"
import { Resources } from "../resources"
import { GameState } from "../state.js"
import { HUD } from "../hud.js"
import { OneWayPlatform } from "../OneWayPlatform.js"

export class Southreach extends Scene {

    onActivate(context) {
        GameState.saveCheckpoint()
        this.isAtExit = false
        this.isAtPoliceMoney = false
        this.playerSeenByTower = false
        this.isCaughtByTower = false
        this.hasReducedPeaceForStealing = false
    }

    onInitialize(engine) {
        this.engine = engine

        this.playIntro(engine, () => {
            this.startLevel(engine)
        })
    }

    playIntro(engine, startLevel) {
        this.backgroundColor = Color.Black

        const introBg = new Actor({
            x: engine.drawWidth / 2,
            y: engine.drawHeight / 2,
            z: 9000
        })

        const introSprite = Resources.BgSouthreach1.toSprite()
        introBg.graphics.use(introSprite)

        introBg.scale.setTo(
            engine.drawWidth / introSprite.width,
            engine.drawHeight / introSprite.height
        )

        introBg.graphics.opacity = 0
        this.add(introBg)

        const darkOverlay = new Actor({
            x: engine.drawWidth / 2,
            y: engine.drawHeight / 2,
            width: engine.drawWidth,
            height: engine.drawHeight,
            color: Color.fromRGB(0, 0, 0, 0.45),
            z: 9001
        })

        this.add(darkOverlay)

        let introAlpha = 0

        const fadeInTimer = new Timer({
            interval: 50,
            repeats: true,
            fcn: () => {
                introAlpha += 0.03

                if (introAlpha >= 1) {
                    introAlpha = 1
                    fadeInTimer.cancel()
                }

                introBg.graphics.opacity = introAlpha
            }
        })

        this.add(fadeInTimer)
        fadeInTimer.start()

        const title = new Label({
            text: "",
            x: 130,
            y: 50,
            z: 9002,
            color: Color.White,
            font: new Font({
                family: "Upheaval",
                size: 70
            })
        })

        this.add(title)

        const subtitle = new Label({
            text: "",
            x: 130,
            y: 130,
            z: 9002,
            color: Color.White,
            font: new Font({
                family: "Upheaval",
                size: 35
            })
        })

        this.add(subtitle)

        const fullTitle = "SOUTHREACH"
        const fullSubtitle = "DE ARMSTE STAD VAN VESTRA..."

        let titleIndex = 0
        let subtitleIndex = 0

        const introTimer = new Timer({
            interval: 80,
            repeats: true,
            fcn: () => {
                if (titleIndex < fullTitle.length) {
                    title.text = fullTitle.substring(0, titleIndex + 1)
                    titleIndex++
                } else if (subtitleIndex < fullSubtitle.length) {
                    subtitle.text = fullSubtitle.substring(0, subtitleIndex + 1)
                    subtitleIndex++
                } else {
                    introTimer.cancel()

                    setTimeout(() => {
                        title.kill()
                        subtitle.kill()
                        introBg.kill()
                        darkOverlay.kill()

                        startLevel()
                    }, 2000)
                }
            }
        })

        this.add(introTimer)
        introTimer.start()
    }

    startLevel(engine) {
        this.engine = engine

        this.destroyedPosters = 0
        this.totalPosters = 7

        this.moneyStolen = 0
        this.totalMoney = 100

        this.hasBoughtFood = false
        this.foodGiven = 0
        this.totalFoodToGive = 4

        this.isAtExit = false
        this.isAtPoliceMoney = false
        this.playerSeenByTower = false
        this.isCaughtByTower = false
        this.hasReducedPeaceForStealing = false

        const levelImage = new Actor({
            x: 0,
            y: 0,
            z: -100,
            anchor: Vector.Zero,
            width: 2167,
            height: 726,
            collisionType: CollisionType.Prevent
        })

        levelImage.graphics.use(Resources.BgSouthreach1.toSprite())
        this.add(levelImage)

        this.createPlatform(0, 635, 2167, 100)
        this.createPlatform(-50, 0, 50, 726)

        const player = new Player()
        player.pos = new Vector(100, 500)
        player.previousBottom = player.pos.y
        player.money = 0
        player.food = 0
        player.onKnockoutComplete = () => this.restartLevel()
        this.player = player
        this.add(player)

        const rightWall = new Actor({
            x: 2167,
            y: 0,
            width: 50,
            height: 726,
            anchor: Vector.Zero,
            collisionType: CollisionType.Fixed,
            color: Color.Transparent,
            z: 10
        })
        this.add(rightWall)

        const exitTrigger = new Actor({
            x: 2127,
            y: 0,
            width: 40,
            height: 726,
            anchor: Vector.Zero,
            collisionType: CollisionType.Passive,
            color: Color.Transparent
        })
        this.add(exitTrigger)

        this.exitLabel = new Label({
            text: "",
            color: Color.White,
            x: 1850,
            y: 500,
            font: new Font({
                family: "MijnPixelFont",
                size: 20,
                unit: FontUnit.Px
            }),
            z: 1000
        })
        this.add(this.exitLabel)

        exitTrigger.on("collisionstart", (evt) => {
            if (this.isPlayerCollision(evt, player)) {
                this.isAtExit = true
                this.exitLabel.text = "press x to go to the next level"
            }
        })

        exitTrigger.on("collisionend", (evt) => {
            if (this.isPlayerCollision(evt, player)) {
                this.isAtExit = false
                this.exitLabel.text = ""
            }
        })

        this.createPoliceMoneySpot(player)
        this.createWatchTowerVision(player)

        this.createOneWayPlatform(0, 195, 315, 10, player)
        this.createOneWayPlatform(290, 340, 130, 15, player)
        this.createOneWayPlatform(75, 443, 265, 15, player)

        this.createOneWayPlatform(540, 120, 190, 10, player)
        this.createOneWayPlatform(710, 130, 60, 10, player)
        this.createOneWayPlatform(430, 215, 190, 10, player)
        this.createOneWayPlatform(550, 325, 200, 10, player)
        this.createOneWayPlatform(440, 365, 110, 10, player)
        this.createOneWayPlatform(390, 505, 380, 15, player)

        this.createOneWayPlatform(1030, 72, 230, 10, player)
        this.createOneWayPlatform(1085, 172, 85, 10, player)
        this.createOneWayPlatform(1200, 190, 180, 10, player)
        this.createOneWayPlatform(900, 230, 185, 10, player)
        this.createOneWayPlatform(1085, 295, 100, 10, player)
        this.createOneWayPlatform(820, 390, 155, 15, player)
        this.createOneWayPlatform(1090, 420, 275, 15, player)
        this.createOneWayPlatform(840, 487, 240, 10, player)

        this.createOneWayPlatform(1280, 300, 160, 15, player)

        this.createOneWayPlatform(1465, 195, 100, 10, player)
        this.createOneWayPlatform(1460, 285, 135, 15, player)
        this.createOneWayPlatform(1410, 435, 190, 10, player)

        this.createOneWayPlatform(1800, 480, 130, 10, player)
        this.createOneWayPlatform(2080, 510, 100, 15, player)

        this.createPoster(440, 570, 52, 41, Resources.PropagandaPoster)
        this.createPoster(720, 570, 52, 41, Resources.PropagandaPoster)
        this.createPoster(536, 447, 127, 66, Resources.PropagandaPoster)
        this.createPoster(960, 322, 54, 75, Resources.PropagandaPoster2)
        this.createPoster(952, 562, 59, 69, Resources.PropagandaPoster2)
        this.createPoster(1353, 562, 65, 69, Resources.PropagandaPoster3)
        this.createPoster(1520, 370, 60, 62, Resources.PropagandaPoster3)

        this.createHomelessNpc(600, 635, player)
        this.createHomelessNpc(1040, 635, player)
        this.createHomelessNpc(1500, 635, player)
        this.createHomelessNpc(1980, 635, player)

        const trader = new Trader(670, 121)
        trader.setPlayer(player)
        trader.setBuyFoodCallback(() => this.buyFoodFromTrader())
        this.add(trader)

        this.add(new Drone(800, 600, 100, 250))
        this.add(new Drone(1400, 400, 160, 350))

        this.createObjectivesLabel()

        this.add(new HUD())

        this.camera.strategy.lockToActorAxis(player, Axis.X)

        this.camera.strategy.limitCameraBounds(new BoundingBox({
            left: 0,
            top: 0,
            right: 2167,
            bottom: 726
        }))
    }

    onPreUpdate(engine, delta) {
        this.updateWatchTowerVision(delta)

        if (this.isCaughtByTower) {
            return
        }

        if (this.isAtExit && engine.input.keyboard.wasPressed(Keys.X)) {
            engine.goToScene("ironvale")
        }

        if (this.isAtPoliceMoney && engine.input.keyboard.wasPressed(Keys.X)) {
            this.stealOneMoney()
        }

        this.updatePoliceMoneyPrompt()
        this.updateObjectivesPosition()
    }

    isPlayerCollision(evt, player) {
        return evt.other === player || evt.other?.owner === player
    }

    createPoliceMoneySpot(player) {
        const policeMoneySpot = new Actor({
            x: 1810,
            y: 500,
            width: 60,
            height: 120,
            anchor: Vector.Zero,
            collisionType: CollisionType.Passive,
            color: Color.fromRGB(0, 100, 255, 0.25),
            z: 20
        })

        this.policeMoneySpot = policeMoneySpot
        this.add(policeMoneySpot)

        this.policeMoneyLabel = new Label({
            text: "",
            color: Color.White,
            font: new Font({
                family: "MijnPixelFont",
                size: 16,
                unit: FontUnit.Px
            }),
            z: 1002
        })

        this.policeMoneyLabel.anchor = new Vector(0.5, 0.5)
        this.add(this.policeMoneyLabel)

        policeMoneySpot.on("collisionstart", (evt) => {
            if (this.isPlayerCollision(evt, player)) {
                this.isAtPoliceMoney = true
                this.policeMoneyLabel.pos = new Vector(policeMoneySpot.pos.x + 105, policeMoneySpot.pos.y - 20)
                this.updatePoliceMoneyPrompt()
            }
        })

        policeMoneySpot.on("collisionend", (evt) => {
            if (this.isPlayerCollision(evt, player)) {
                this.isAtPoliceMoney = false
                this.policeMoneyLabel.text = ""
            }
        })
    }

    createWatchTowerVision(player) {
        this.watchPlayer = player

        this.watchTowerOrigin = new Vector(1960, 235)

        this.watchConeLength = 580
        this.watchConeHalfAngle = 0.22
        this.watchConeBaseWidth = Math.tan(this.watchConeHalfAngle) * this.watchConeLength * 2

        this.watchConeMinAngle = 1.2
        this.watchConeMaxAngle = 2.8

        this.watchConeAngle = this.watchConeMinAngle
        this.watchConeDirection = 1
        this.watchConeSpeed = 0.12

        this.watchTowerCone = new Actor({
            x: this.watchTowerOrigin.x,
            y: this.watchTowerOrigin.y,
            width: this.watchConeLength,
            height: this.watchConeBaseWidth,
            anchor: new Vector(0, 0.5),
            collisionType: CollisionType.PreventCollision,
            z: 25
        })

        const normalCone = this.createConeCanvas(
            "rgba(255, 240, 120, 0.18)",
            "rgba(255, 240, 120, 0.45)"
        )

        const alertCone = this.createConeCanvas(
            "rgba(255, 60, 60, 0.35)",
            "rgba(255, 40, 40, 0.75)"
        )

        this.watchTowerCone.graphics.add("normal", normalCone)
        this.watchTowerCone.graphics.add("alert", alertCone)
        this.watchTowerCone.graphics.use("normal")

        this.watchTowerCone.rotation = this.watchConeAngle

        this.add(this.watchTowerCone)
    }

    createConeCanvas(fillColor, strokeColor) {
        const length = this.watchConeLength
        const height = this.watchConeBaseWidth

        return new Canvas({
            width: length,
            height: height,
            cache: true,
            draw: (ctx) => {
                ctx.clearRect(0, 0, length, height)

                ctx.beginPath()
                ctx.moveTo(0, height / 2)
                ctx.lineTo(length, 0)
                ctx.lineTo(length, height)
                ctx.closePath()

                ctx.fillStyle = fillColor
                ctx.fill()

                ctx.strokeStyle = strokeColor
                ctx.lineWidth = 2
                ctx.stroke()
            }
        })
    }

    updateWatchTowerVision(delta) {
        if (!this.watchTowerCone || !this.watchPlayer || this.isCaughtByTower) {
            return
        }

        const dt = delta / 1000

        this.watchConeAngle += this.watchConeDirection * this.watchConeSpeed * dt

        if (this.watchConeAngle >= this.watchConeMaxAngle) {
            this.watchConeAngle = this.watchConeMaxAngle
            this.watchConeDirection = -1
        }

        if (this.watchConeAngle <= this.watchConeMinAngle) {
            this.watchConeAngle = this.watchConeMinAngle
            this.watchConeDirection = 1
        }

        this.watchTowerCone.pos = new Vector(this.watchTowerOrigin.x, this.watchTowerOrigin.y)
        this.watchTowerCone.rotation = this.watchConeAngle

        this.playerSeenByTower = this.isAtPoliceMoney && this.isPlayerInsideWatchCone()

        if (this.playerSeenByTower) {
            this.watchTowerCone.graphics.use("alert")
            this.gameOverFromTower()
        } else {
            this.watchTowerCone.graphics.use("normal")
        }
    }

    isPlayerInsideWatchCone() {
        if (!this.watchPlayer) {
            return false
        }

        const playerPoints = [
            new Vector(this.watchPlayer.pos.x, this.watchPlayer.pos.y),
            new Vector(this.watchPlayer.pos.x, this.watchPlayer.pos.y - 35),
            new Vector(this.watchPlayer.pos.x, this.watchPlayer.pos.y + 25)
        ]

        return playerPoints.some((point) => this.isPointInsideWatchCone(point))
    }

    isPointInsideWatchCone(point) {
        const dx = point.x - this.watchTowerOrigin.x
        const dy = point.y - this.watchTowerOrigin.y

        const distance = Math.sqrt(dx * dx + dy * dy)

        if (distance > this.watchConeLength) {
            return false
        }

        const angleToPoint = Math.atan2(dy, dx)
        const angleDifference = Math.abs(this.getAngleDifference(angleToPoint, this.watchConeAngle))

        return angleDifference <= this.watchConeHalfAngle
    }

    getAngleDifference(angleA, angleB) {
        let difference = angleA - angleB

        while (difference > Math.PI) {
            difference -= Math.PI * 2
        }

        while (difference < -Math.PI) {
            difference += Math.PI * 2
        }

        return difference
    }

    gameOverFromTower() {
        if (this.isCaughtByTower) {
            return
        }

        this.isCaughtByTower = true

        this.engine.lastScene = "southreach"
        this.engine.goToScene("gameover")
    }

    updatePoliceMoneyPrompt() {
        if (!this.policeMoneyLabel) {
            return
        }

        if (!this.isAtPoliceMoney) {
            return
        }

        if (this.playerSeenByTower) {
            this.policeMoneyLabel.text = "caught"
            return
        }

        if (this.moneyStolen >= this.totalMoney) {
            this.policeMoneyLabel.text = "all money stolen"
        } else {
            this.policeMoneyLabel.text = `press x to steal money ${this.moneyStolen}/${this.totalMoney}`
        }
    }

    stealOneMoney() {
        if (this.playerSeenByTower) {
            this.updatePoliceMoneyPrompt()
            return
        }

        if (this.moneyStolen >= this.totalMoney) {
            this.updatePoliceMoneyPrompt()
            return
        }

        this.moneyStolen += 1
        this.player.money += 1

        if (this.moneyStolen >= this.totalMoney && !this.hasReducedPeaceForStealing) {
            GameState.peace = Math.max(0, (GameState.peace ?? 0) - 10)
            this.hasReducedPeaceForStealing = true
        }

        this.updatePoliceMoneyPrompt()
        this.updateObjectivesText()
    }

    buyFoodFromTrader() {
        if (this.hasBoughtFood) {
            return "You already bought food."
        }

        if (this.player.money < this.totalMoney) {
            return "You need 100 coins."
        }

        this.player.money -= this.totalMoney
        this.player.food = 4
        this.hasBoughtFood = true

        this.updateObjectivesText()

        return "Pleasure doing business with you."
    }

    giveFoodToHomeless(npc) {
        if (npc.hasReceivedFood) {
            return "You already helped me."
        }

        if (!this.hasBoughtFood || this.player.food <= 0) {
            return "Please... I need food."
        }

        npc.hasReceivedFood = true
        this.player.food -= 1
        this.foodGiven += 1

        GameState.support = Math.min(100, (GameState.support ?? 0) + 5)

        this.updateObjectivesText()

        return "Thank you. The people support you."
    }

    createHomelessNpc(x, y, player) {
        const homeless = new ChoiceNpc(x, y)
        homeless.setPlayer(player)
        homeless.setFoodCallback((npc) => this.giveFoodToHomeless(npc))
        this.add(homeless)
        return homeless
    }

    createObjectivesLabel() {
        this.objectivesLabel = new Label({
            text: "",
            color: Color.White,
            font: new Font({
                family: "MijnPixelFont",
                size: 18,
                unit: FontUnit.Px
            }),
            z: 5000
        })

        this.objectivesLabel.anchor = Vector.Zero
        this.add(this.objectivesLabel)

        this.updateObjectivesText()
        this.updateObjectivesPosition()
    }

    updateObjectivesText() {
        let optionalObjective = ""

        if (this.moneyStolen < this.totalMoney) {
            optionalObjective = `(optional) steal money ${this.moneyStolen}/${this.totalMoney}`
        } else if (!this.hasBoughtFood) {
            optionalObjective = "(optional) buy food from the trader"
        } else {
            optionalObjective = `(optional) give food to the homeless ${this.foodGiven}/${this.totalFoodToGive}`
        }

        this.objectivesLabel.text =
            `Destroy posters ${this.destroyedPosters}/${this.totalPosters}\n` +
            optionalObjective
    }

    updateObjectivesPosition() {
        if (!this.objectivesLabel || !this.engine) {
            return
        }

        this.objectivesLabel.pos = new Vector(
            this.camera.pos.x + this.engine.drawWidth / 2 - 430,
            this.camera.pos.y - this.engine.drawHeight / 2 + 25
        )
    }

    createPoster(x, y, width, height, imageResource) {
        const poster = new Poster(x, y, width, height, imageResource)

        poster.hasBeenCountedForObjective = false

        const originalKill = poster.kill.bind(poster)

        poster.kill = () => {
            if (!poster.hasBeenCountedForObjective) {
                poster.hasBeenCountedForObjective = true
                this.destroyedPosters += 1
                this.updateObjectivesText()
            }

            originalKill()
        }

        this.add(poster)
        return poster
    }

    createPlatform(x, y, breedte, hoogte) {
        const platform = new Actor({
            x: x,
            y: y,
            width: breedte,
            height: hoogte,
            anchor: Vector.Zero,
            collisionType: CollisionType.Fixed,
            color: Color.Transparent,
            z: 10
        })

        this.add(platform)
    }

    createOneWayPlatform(x, y, breedte, hoogte, player) {
        const platform = new OneWayPlatform(x, y, breedte, hoogte)

        this.add(platform)
        player.addOneWayPlatform(platform)
    }

    restartLevel() {
        GameState.revertToCheckpoint()

        this.clear()
        this.camera.clearAllStrategies()

        this.startLevel(this.engine)
    }
}