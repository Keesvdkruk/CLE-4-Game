import { Actor, Color, CollisionType, Axis, BoundingBox, Scene, Vector, Timer, Keys, Label, Font, } from "excalibur"
import { Drone } from "../drone"
import { Ground } from "../ground"
import { Player } from "../player"
import { Resources } from "../resources"

export class Eastwatch extends Scene {
    onInitialize(engine) {
        engine.backgroundColor = Color.fromHex('#000000');
        const bg = new Actor({
            x: 1774 / 2,
            y: engine.drawHeight / 2
        })
        bg.graphics.use(Resources.EastwatchOutside.toSprite())
        this.add(bg)

        const ground = new Actor({
            x: 2000,
            y: 730,
            width: 4000,
            height: 60,
            color: Color.fromHex("#1a1a2e00"),
            collisionType: CollisionType.Fixed
        })
        this.add(ground)

        const objective = new Label({
            text: "Objective: sluip de militaire basis binnen.",
            x: 40,
            y: 40,
            color: Color.White,
            font: new Font({ family: "MijnPixelFont", size: 24 })
        })
        this.add(objective)

        

        // linker muur
        const leftWall = new Actor({
            x: -25, y: 360,
            width: 50, height: 720,
            color: Color.Transparent,
            collisionType: CollisionType.Fixed
        })
        this.add(leftWall)

        // platform 1 - laag
        const platform1 = new Actor({
            x: 580, y: 610,
            width: 230, height: 20,
            color: Color.fromHex("#55555500"),
            collisionType: CollisionType.Fixed
        })
        this.add(platform1)

        // platform 2 - midden
        const platform2 = new Actor({
            x: 790, y: 530,
            width: 180, height: 20,
            color: Color.fromHex("#55555500"),
            collisionType: CollisionType.Fixed
        })
        this.add(platform2)

        // platform 3 - hoog
        const platform3 = new Actor({
            x: 1160, y: 315,
            width: 200, height: 10,
            color: Color.fromHex("#55555500"),
            collisionType: CollisionType.Fixed
        })
        this.add(platform3)

        const platform4 = new Actor({
            x: 960, y: 425,
            width: 220, height: 5,
            color: Color.fromHex("#55555500"),
            collisionType: CollisionType.Fixed
        })
        this.add(platform4)

        // platform 5 - dak van de basis
        const platform5 = new Actor({
            x: 1505, y: 213,
            width: 500, height: 20,
            color: Color.fromHex("#55555500"),
            collisionType: CollisionType.Fixed
        })
        this.add(platform5)

        const platform6 = new Actor({
            x: 930, y: 570,
            width: 200, height: 20,
            color: Color.fromHex("#55555500"),
            collisionType: CollisionType.Fixed
        })
        this.add(platform6)

        const platform7 = new Actor({
            x: 1150, y: 520,
            width: 220, height: 5,
            color: Color.fromHex("#55555500"),
            collisionType: CollisionType.Fixed
        })
        this.add(platform7)

        const platform8 = new Actor({
            x: 1380, y: 410,
            width: 220, height: 5,
            color: Color.fromHex("#55555500"),
            collisionType: CollisionType.Fixed
        })
        this.add(platform8)

        // hek / muur voor de ingang
        const gate = new Actor({
            x: 1745, y: 500,
            width: 20, height: 1100,
            color: Color.fromHex("#33333300"),
            collisionType: CollisionType.Fixed
        })
        this.add(gate)

        // deur trigger
        let nearDoor = false
        const doorTrigger = new Actor({
            x: 1565, y: 165,
            width: 50, height: 80,
            collisionType: CollisionType.Passive
        })
        doorTrigger.graphics.opacity = 0
        this.add(doorTrigger)

        // drone bewakers
        this.add(new Drone(600, 660))
        this.add(new Drone(1100, 350))

        const player = new Player()
        player.name = "player"
        player.pos.x = 100
        player.pos.y = 600
        this.add(player)

        // deur interactie
        doorTrigger.on("collisionstart", (event) => {
            if (event.other.owner?.name === "player") {
                nearDoor = true
                objective.text = "Druk op E om de basis binnen te gaan."
            }
        })

        doorTrigger.on("collisionend", (event) => {
            if (event.other.owner?.name === "player") {
                nearDoor = false
                objective.text = "Objective: sluip de militaire basis binnen."
            }
        })

        this.on("preupdate", () => {
            if (nearDoor && engine.input.keyboard.wasPressed(Keys.E)) {
                engine.goToScene("eastwatchinside")
            }

            // label vastzetten op scherm
            objective.pos.x = this.camera.x - engine.drawWidth / 2 + 40
            objective.pos.y = this.camera.y - engine.drawHeight / 2 + 40
        })

        this.camera.strategy.lockToActorAxis(player, Axis.X)
        this.camera.strategy.limitCameraBounds(new BoundingBox({
            left: 0, top: 0,
            right: 1774, bottom: 720
        }))
    }
}