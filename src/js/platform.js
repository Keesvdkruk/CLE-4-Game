import { Actor, CollisionType, Color } from "excalibur"

export class Platform extends Actor {
    constructor(x, y, breedte, hoogte) {
        super({
            x: x,
            y: y,
            width: breedte,
            height: hoogte,
            color: Color.fromRGB(20, 13, 28), 
            collisionType: CollisionType.Fixed 
        })
    }
}