import { Actor, Color, CollisionType, Axis, BoundingBox, Scene, Vector, Timer, Keys, Label, Font } from "excalibur"
import { Drone } from "../drone"
import { Player } from "../player"
import { Resources } from "../resources"

export class EastwatchInside extends Scene {
    onInitialize(engine) {

        const bg = new Actor({
            x: engine.drawWidth / 2,
            y: engine.drawHeight / 2
        })
        bg.graphics.use(Resources.EastwatchInside.toSprite())
        this.add(bg)

        const ground = new Actor({
            x: 2000,
            y: 710,
            width: 4000,
            height: 60,
            color: Color.fromHex("#1a1a2e"),
            collisionType: CollisionType.Fixed
        })
        this.add(ground)

        const leftWall = new Actor({
            x: -25, y: 360,
            width: 50, height: 720,
            color: Color.Transparent,
            collisionType: CollisionType.Fixed
        })
        this.add(leftWall)

        const floor1left = new Actor({
            x: 300, y: 560,
            width: 350, height: 20,
            color: Color.fromHex("#2d3748"),
            collisionType: CollisionType.Fixed
        })
        this.add(floor1left)

        const floor1right = new Actor({
            x: 850, y: 560,
            width: 350, height: 20,
            color: Color.fromHex("#2d3748"),
            collisionType: CollisionType.Fixed
        })
        this.add(floor1right)

        const floor2left = new Actor({
            x: 200, y: 400,
            width: 250, height: 20,
            color: Color.fromHex("#2d3748"),
            collisionType: CollisionType.Fixed
        })
        this.add(floor2left)

        const floor2mid = new Actor({
            x: 650, y: 400,
            width: 300, height: 20,
            color: Color.fromHex("#2d3748"),
            collisionType: CollisionType.Fixed
        })
        this.add(floor2mid)

        const floor2right = new Actor({
            x: 1150, y: 400,
            width: 250, height: 20,
            color: Color.fromHex("#2d3748"),
            collisionType: CollisionType.Fixed
        })
        this.add(floor2right)

        const floor3 = new Actor({
            x: 700, y: 250,
            width: 600, height: 20,
            color: Color.fromHex("#2d3748"),
            collisionType: CollisionType.Fixed
        })
        this.add(floor3)

        const wallLeft = new Actor({
            x: -10, y: 360,
            width: 20, height: 720,
            color: Color.fromHex("#2d3748"),
            collisionType: CollisionType.Fixed
        })
        this.add(wallLeft)

        const wallRight = new Actor({
            x: 1400, y: 360,
            width: 20, height: 720,
            color: Color.fromHex("#2d3748"),
            collisionType: CollisionType.Fixed
        })
        this.add(wallRight)

        const wallMid = new Actor({
            x: 490, y: 470,
            width: 20, height: 160,
            color: Color.fromHex("#2d3748"),
            collisionType: CollisionType.Fixed
        })
        this.add(wallMid)

        let nearServer = false

        const serverTrigger = new Actor({
            x: 900, y: 200,
            width: 140, height: 100,
            collisionType: CollisionType.Passive
        })
        serverTrigger.graphics.opacity = 0
        this.add(serverTrigger)

        const serverBlock = new Actor({
            x: 900, y: 220,
            width: 100, height: 40,
            color: Color.fromHex("#1a365d"),
            collisionType: CollisionType.Fixed
        })
        this.add(serverBlock)

        const serverLight = new Actor({
            x: 900, y: 200,
            width: 10, height: 10,
            color: Color.fromHex("#48bb78"),
            collisionType: CollisionType.PreventCollision
        })
        this.add(serverLight)

        const blinkTimer = new Timer({
            interval: 600,
            repeats: true,
            fcn: () => {
                serverLight.color = serverLight.color.toString() === Color.fromHex("#48bb78").toString()
                    ? Color.fromHex("#1a365d")
                    : Color.fromHex("#48bb78")
            }
        })
        this.add(blinkTimer)
        blinkTimer.start()

        this.add(new Drone(400, 540))
        this.add(new Drone(850, 380))
        this.add(new Drone(1100, 310))

        const visionHitbox = new Actor({
            x: 700, y: 360,
            width: 350, height: 80,
            collisionType: CollisionType.Passive,
            color: Color.Red
        })
        visionHitbox.graphics.opacity = 0
        this.add(visionHitbox)

        let lookingLeft = false
        const guardTimer = new Timer({
            interval: 3000,
            repeats: true,
            fcn: () => {
                lookingLeft = !lookingLeft
                visionHitbox.pos.x = lookingLeft ? 450 : 700
            }
        })
        this.add(guardTimer)
        guardTimer.start()

        const player = new Player()
        player.name = "player"
        player.pos.x = 120
        player.pos.y = 640
        this.add(player)

        // HUD label — volgt de camera via preupdate
        const objective = new Actor({
            x: 40,
            y: 40,
            collisionType: CollisionType.PreventCollision
        })
        const objectiveLabel = new Label({
            text: "Objective: vind de serverruimte en steel de data.",
            x: 0,
            y: 0,
            color: Color.White,
            font: new Font({ family: "MijnPixelFont", size: 24 })
        })
        this.add(objective)
        objective.addChild(objectiveLabel)

        this.on("preupdate", () => {
            // Zet de actor op de linkerbovenhoek van de huidige camera-viewport
            objective.pos.x = this.camera.pos.x - engine.drawWidth / 2 + 40
            objective.pos.y = this.camera.pos.y - engine.drawHeight / 2 + 40

            if (nearServer && !dataStolen && engine.input.keyboard.wasPressed(Keys.E)) {
                dataStolen = true
                engine.goToScene("vestracity")
            }
        })

        let caught = false
        let dataStolen = false

        this.on("activate", () => {
            caught = false
            dataStolen = false
        })

        visionHitbox.on("collisionstart", (event) => {
            if (event.other.owner?.name === "player" && !caught && !dataStolen) {
                caught = true
                player.vel.x = 0
                player.vel.y = 0

                const fade = new Actor({
                    x: engine.drawWidth / 2,
                    y: engine.drawHeight / 2,
                    width: engine.drawWidth,
                    height: engine.drawHeight,
                    color: Color.Black
                })
                fade.graphics.opacity = 0
                this.add(fade)

                const fadeTimer = new Timer({
                    interval: 40,
                    repeats: true,
                    fcn: () => {
                        fade.graphics.opacity += 0.05
                        if (fade.graphics.opacity >= 1) {
                            fadeTimer.cancel()
                            engine.lastScene = "eastwatchinside"
                            engine.goToScene("vestracity.js")
                        }
                    }
                })
                this.add(fadeTimer)
                fadeTimer.start()
            }
        })

        serverTrigger.on("collisionstart", (event) => {
            if (event.other.owner?.name === "player") {
                nearServer = true
                objectiveLabel.text = "Druk op E om de data te stelen."
            }
        })

        serverTrigger.on("collisionend", (event) => {
            if (event.other.owner?.name === "player") {
                nearServer = false
                objectiveLabel.text = "Objective: vind de serverruimte en steel de data."
            }
        })

        this.camera.strategy.lockToActorAxis(player, Axis.X)
        this.camera.strategy.limitCameraBounds(new BoundingBox({
            left: 0, top: 0,
            right: 1400, bottom: 720
        }))
    }
}