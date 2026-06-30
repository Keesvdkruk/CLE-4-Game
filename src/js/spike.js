import { Actor, Color, CollisionType, Vector } from "excalibur"
import { Player } from "./player"
import { Resources } from "./resources"

export class Spike extends Actor {

    constructor(x, y, width = 20, height = 20) {
        super({
            x,
            y,
            width,
            height,
            color: Color.Red,
            opacity: 0,
            collisionType: CollisionType.Fixed,
        })
    }

    onCollisionStart(self, other) {
        const owner = other.owner

        if (owner instanceof Player) {
            owner.startKnockout()
        }
    }
}