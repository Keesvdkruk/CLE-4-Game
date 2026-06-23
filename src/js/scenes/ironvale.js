import { Actor, Color, CollisionType, Axis, BoundingBox, Scene } from "excalibur"
import { Drone } from "../drone"
import { Ground } from "../ground"
import { Platform } from "../platform"
import { Player } from "../player"
import { Poster } from "../poster"
import { Background } from "../background"
import { Resources } from "../resources"
import { ironvalePoster } from "../ironvalePoster"
import { ironvaleGround } from "../ironvaleGround"
import { ironvalePlatform } from "../ironvalePlatform"

export class Ironvale extends Scene {

    onInitialize(engine) {
        // Moving Background
        this.add(new Background(Resources.Bg1, 0.05, -104))
        this.add(new Background(Resources.Bg2, 0.2, -103))
        this.add(new Background(Resources.Bg3, 0.4, -102))
        this.add(new Background(Resources.Bg4, 0.6, -101))

        const ground = new ironvaleGround()
        this.add(ground)

        const leftWall = new Actor({
            x: -25,
            y: 360,
            width: 50,
            height: 720,
            color: Color.Transparent,
            collisionType: CollisionType.Fixed
        })
        this.add(leftWall)

        this.add(new ironvalePoster(400, 605))
        this.add(new ironvalePoster(1200, 605))
        this.add(new ironvalePoster(2500, 605))
        this.add(new ironvalePoster(1400, 210))

        this.add(new ironvalePlatform(600, 550, 350, 30))
        this.add(new ironvalePlatform(1000, 440, 350, 30))
        this.add(new ironvalePlatform(1200, 280, 450, 30))

        this.add(new Drone(700, 660))
        this.add(new Drone(1300, 260))

        const player = new Player()
        this.add(player)

        // Camera
        this.camera.strategy.lockToActorAxis(player, Axis.X)
        this.camera.strategy.limitCameraBounds(new BoundingBox({
            left: 0,
            top: 0,
            right: 4000,
            bottom: 720
        }))

    }
}