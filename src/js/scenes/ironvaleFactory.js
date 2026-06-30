import { Actor, Color, CollisionType, Axis, BoundingBox, Scene, Vector, Label, Font, Keys } from "excalibur"
import { Player } from "../player"
import { Background } from "../background"
import { Resources } from "../resources"
import { ironvaleGround } from "../ironvaleGround"
import { ironvalePlatform } from "../ironvalePlatform"
import { ironvalePoster } from "../ironvalePoster"
import { IronvaleDrone } from "../ironvaleDrone"
import { IronvaleDrone2 } from "../ironvaleDrone2"
import { Prisoner } from "../prisoner"
import { GameState } from "../state.js"
import { HUD } from "../hud.js"

export class IronvaleFactory extends Scene {

    objective
    prisonersFreed = 0
    canLeave = false
    playerNearDoor = false
    playerRef = null
    doorPrompt = null
    exitDoor = null


    onInitialize(engine) {
        this.add(new HUD())
        const factoryBg = new Actor({
            x: 0,
            y: 0,
        })
        factoryBg.z = -10
        factoryBg.anchor = new Vector(0, 0)
        factoryBg.graphics.use(Resources.BgFactory.toSprite())

        this.add(factoryBg)

        this.objective = new Label({
            text: "Bevrijd de arbeiders (0/3)",
            x: 40,
            y: 40,
            color: Color.White,
            font: new Font({
                family: "MijnPixelFont",
                size: 24
            })
        })

        this.objective.z = 100
        this.add(this.objective)

        const ground = new ironvaleGround()
        this.add(ground)

        // Level Borders
        const leftBorder = new Actor({
            x: -25,
            y: 360,
            width: 50,
            height: 720,
            collisionType: CollisionType.Fixed
        })
        this.add(leftBorder)

        const rightBorder = new Actor({
            x: 1770,
            y: 360,
            width: 40,
            height: 720,
            collisionType: CollisionType.Fixed
        });

        this.add(rightBorder);

        // Platform Opstelling
        this.add(new ironvalePlatform(0, 280, 355, 30))
        this.add(new ironvalePlatform(355, 470, 265, 30))
        this.add(new ironvalePlatform(470, 640, 270, 30))
        this.add(new ironvalePlatform(530, 310, 180, 30))
        this.add(new ironvalePlatform(655, 540, 320, 30))
        this.add(new ironvalePlatform(850, 320, 340, 30))
        this.add(new ironvalePlatform(1000, 640, 180, 30))
        this.add(new ironvalePlatform(1150, 440, 80, 30))
        this.add(new ironvalePlatform(1340, 540, 400, 30))
        this.add(new ironvalePlatform(1250, 250, 500, 30))

        // Drones
        this.add(new IronvaleDrone(200, 100))
        this.add(new IronvaleDrone(700, 345))

        // Player
        const player = new Player()
        this.add(player)

        // Prisoners
        const prisoner1 = new Prisoner(170, 200)
        const prisoner2 = new Prisoner(1350, 165)
        const prisoner3 = new Prisoner(800, 470)

        prisoner1.onFreed = () => this.prisonerFreed()
        prisoner2.onFreed = () => this.prisonerFreed()
        prisoner3.onFreed = () => this.prisonerFreed()

        this.add(prisoner1)
        this.add(prisoner2)
        this.add(prisoner3)

        // EXIT DOOR
        const exitDoor = new Actor({
            x: 1650,
            y: 200,
            width: 80,
            height: 120,
            collisionType: CollisionType.Passive
        })

        this.exitDoor = exitDoor

        exitDoor.on("collisionstart", (evt) => {
            if (evt.other.owner instanceof Player) {
                this.playerNearDoor = true
                this.playerRef = evt.other.owner
            }
        })

        exitDoor.on("collisionend", (evt) => {
            if (evt.other.owner instanceof Player) {
                this.playerNearDoor = false
                this.playerRef = null
            }
        })

        this.add(exitDoor)


        // DOOR PROMPT (moet NA add + NA exitDoor)
        this.doorPrompt = new Label({
            text: "",
            x: 0,
            y: 0,
            color: Color.White,
            font: new Font({
                family: "MijnPixelFont",
                size: 18
            })
        })

        this.doorPrompt.z = 200
        this.add(this.doorPrompt)

        // Camera
        this.camera.strategy.lockToActorAxis(player, Axis.X)
        this.camera.strategy.limitCameraBounds(new BoundingBox({
            left: 0,
            top: 0,
            right: 1770,
            bottom: 720
        }))
    }

    prisonerFreed() {

        this.prisonersFreed++

        GameState.peace = Math.max(0, GameState.peace - 2)
        console.log("Huidige Peace stat:", GameState.peace)
        GameState.support = Math.min(100, GameState.support + 12)
        console.log("Huidige Support stat:", GameState.support)

        this.objective.text =
            `Bevrijd de arbeiders (${this.prisonersFreed}/3)`

        if (this.prisonersFreed >= 3) {

            this.canLeave = true

            this.objective.text =
                "Alle arbeiders bevrijd, zoek de uitgang"
        }
    }

    onPreUpdate(engine) {

        if (this.objective) {
            this.objective.pos.x = Math.round(this.camera.pos.x + 180)
            this.objective.pos.y = Math.round(this.camera.pos.y - 320)
        }

        if (this.playerNearDoor && this.canLeave) {
            this.doorPrompt.text = "Druk E om door de deur te gaan"

            this.doorPrompt.pos = new Vector(
                this.exitDoor.pos.x - 150,
                this.exitDoor.pos.y - 80
            )
        } else {
            this.doorPrompt.text = ""
        }

        if (engine.input.keyboard.wasPressed(Keys.E)) {
            if (this.canLeave && this.playerNearDoor) {
                this.goToNextLevel(engine)
            }
        }
    }

    restartLevel() {

        this.prisonersFreed = 0
        this.canLeave = false

        this.clear()
        this.camera.clearAllStrategies()

        this.onInitialize(this.engine)
    }

    goToNextLevel(engine) {
        engine.goToScene("eastwatch")
    }


}