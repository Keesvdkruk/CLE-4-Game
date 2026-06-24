import { Actor, Color, CollisionType, Axis, BoundingBox, Scene } from "excalibur"
import { Drone } from "../drone"
import { Ground } from "../ground"
import { Platform } from "../platform"
import { Player } from "../player"
import { Poster } from "../poster"
import { Background } from "../background"
import { Resources } from "../resources"

export class IronvaleFactory extends Scene {

    onInitialize(engine) {
        this.add(new Background(Resources.BgIronvale, 0.05, -104))
        this.add(new Background(Resources.BgFactory1, 0.2, -103))
        this.add(new Background(Resources.BgFactory2, 0.4, -102))
        this.add(new Background(Resources.BgFactory3, 0.6, -101))

        const ground = new Ground()
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

        this.add(new Poster(500, 620))
        this.add(new Poster(1200, 620))
        this.add(new Poster(2500, 620))
        this.add(new Poster(1400, 220))

        this.add(new Drone(700, 660))
        this.add(new Drone(1300, 260))

        const player = new Player()
        this.add(player)

        this.camera.strategy.lockToActorAxis(player, Axis.X)
        this.camera.strategy.limitCameraBounds(new BoundingBox({
            left: 0,
            top: 0,
            right: 4000,
            bottom: 720
        }))

    }
}