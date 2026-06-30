import { Actor, Animation, CollisionType, Color, SpriteSheet, Vector } from "excalibur"
import { Player } from "./player.js"
import { Resources } from "./resources.js"

export class Drone extends Actor {
    constructor(x, y, snelheid = 100, bereik = 250) {
        super({
            x: x,
            y: y,
            width: 40,
            height: 40,
            color: Color.Red,
            collisionType: CollisionType.Passive 
        })

        this.snelheid = snelheid
        this.bereik = bereik
    }

    onInitialize(engine) {
        const walkSheet = SpriteSheet.fromImageSource({
            image: Resources.DroneWalk,
            grid: { rows: 1, columns: 4, spriteWidth: 48, spriteHeight: 48 }
        })

        const walkAnim = Animation.fromSpriteSheet(walkSheet, [0, 1, 2, 3], 80)

        this.graphics.add("walk", walkAnim)
        this.graphics.use("walk")

        this.actions.repeatForever(ctx => {
            ctx.moveBy(this.bereik, 0, this.snelheid)
               .moveBy(-this.bereik, 0, this.snelheid)
        })

        this.on("collisionstart", (evt) => {
            const hitPlayer =
                evt.other instanceof Player
                    ? evt.other
                    : evt.other?.owner instanceof Player
                        ? evt.other.owner
                        : null

            if (hitPlayer) {
                console.log("BETRAPT! Terug naar de start.")
                hitPlayer.startKnockout()
            }
        })
    }

    onPostUpdate(engine) {
        if (this.graphics.current) {
            this.graphics.current.flipHorizontal = this.vel.x < 0
        }
    }
}