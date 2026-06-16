import { Actor, CollisionType, Color } from "excalibur"

export class Platform extends Actor {
    constructor(x, y, breedte, hoogte) {
        super({
            x: x,
            y: y,
            width: breedte,
            height: hoogte,
            color: Color.Orange,
            collisionType: CollisionType.Fixed 
        })
    }
}