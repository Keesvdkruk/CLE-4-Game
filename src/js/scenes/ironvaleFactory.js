import { Actor, Color, CollisionType, Axis, BoundingBox, Scene, Vector } from "excalibur"
import { Player } from "../player"
import { Background } from "../background"
import { Resources } from "../resources"
import { ironvaleGround } from "../ironvaleGround"
import { ironvalePlatform } from "../ironvalePlatform"
import { ironvalePoster } from "../ironvalePoster"
import { IronvaleDrone } from "../ironvaleDrone"
import { IronvaleDrone2 } from "../ironvaleDrone2"
import { Prisoner } from "../prisoner"

export class IronvaleFactory extends Scene {

    onInitialize(engine) {
        const factoryBg = new Actor({
            x: 0,
            y: 0,
        })
        factoryBg.z = -10
        factoryBg.anchor = new Vector(0, 0)
        factoryBg.graphics.use(Resources.BgFactory.toSprite())

        this.add(factoryBg)

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
        this.add(new IronvaleDrone(700, 330))

        // Prisoners
        const prisoner1 = new Prisoner(170, 200)
        const prisoner2 = new Prisoner(1350, 165)
        const prisoner3 = new Prisoner(800, 470)

        prisoner1.onFreed = () => {
            console.log("Prisoner freed!")
        }

        this.add(prisoner1)
        this.add(prisoner2)
        this.add(prisoner3)

        // Player
        const player = new Player()
        this.add(player)

        // Camera
        this.camera.strategy.lockToActorAxis(player, Axis.X)
        this.camera.strategy.limitCameraBounds(new BoundingBox({
            left: 0,
            top: 0,
            right: 1770,
            bottom: 720
        }))
    }
}