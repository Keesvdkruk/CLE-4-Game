import { Actor, CollisionType, Vector, Color } from "excalibur"

export class OneWayPlatform extends Actor {
    constructor(x, y, breedte, hoogte) {
        super({
            x: x,
            y: y,
            width: breedte,
            height: hoogte,
            anchor: Vector.Zero,

            // Geen echte collision. Player handelt dit zelf af.
            collisionType: CollisionType.PreventCollision,

            // Debugkleur. Later veranderen naar Color.Transparent
            //color: Color.fromRGB(0, 255, 0, 0.45),
            color: Color.Transparent,

            z: 100
        })

        this.isOneWayPlatform = true
        this.breedte = breedte
        this.hoogte = hoogte
    }

    getLeft() {
        return this.pos.x
    }

    getRight() {
        return this.pos.x + this.breedte
    }

    getTop() {
        return this.pos.y
    }
}