import { Actor, CollisionType, Color } from "excalibur"

export class Poster extends Actor {
    constructor(x, y) {
        super({
            x: x,
            y: y,
            width: 80,
            height: 120,
            color: Color.LightGray,
            collisionType: CollisionType.PreventCollision,
            z: -1
        })
    }
}