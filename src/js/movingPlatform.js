import { Actor, CollisionType, Color, Vector } from "excalibur"

export class MovingPlatform extends Actor {

    constructor(x, y, width, height, distance, speed) {
        super({
            x,
            y,
            width,
            height,
            collisionType: CollisionType.Fixed,
            color: Color.White,
            opacity: 0.3
        })

        this.startX = x
        this.distance = distance
        this.speed = speed
        this.direction = 1
    }

    onPreUpdate(engine, delta) {

        this.pos.x += this.speed * this.direction * (delta / 1000)

        if (this.pos.x >= this.startX + this.distance) {
            this.direction = -1
        }

        if (this.pos.x <= this.startX) {
            this.direction = 1
        }
    }
}