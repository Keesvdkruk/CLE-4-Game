import { Actor, Color, CollisionType, Axis, BoundingBox, Scene } from "excalibur"
import { CameraEnemy } from "../camera"
import { Ground } from "../ground"
import { Platform } from "../platform"
import { Player } from "../player"
import { Poster } from "../poster"

export class LevelOne extends Scene {

    onInitialize(engine) {

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

        this.add(new Platform(600, 550, 200, 30))
        this.add(new Platform(1000, 450, 200, 30))
        this.add(new Platform(1400, 300, 300, 30))

        this.add(new CameraEnemy(700, 660))

        this.add(new CameraEnemy(1300, 260))

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