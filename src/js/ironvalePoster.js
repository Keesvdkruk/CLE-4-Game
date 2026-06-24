import { Actor, CollisionType, Color } from "excalibur"
import { Resources } from "./resources";

export class ironvalePoster extends Actor {
    constructor(x, y) {
        super({
            x: x,
            y: y,
            width: 235,
            height: 140,
            color: Color.LightGray,
            collisionType: CollisionType.PreventCollision,
            z: -1
        })

        this.graphics.use(Resources.IronvalePoster.toSprite());

    }
}