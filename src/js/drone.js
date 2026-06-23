import { Actor, Animation, CollisionType, Color, SpriteSheet, Vector } from "excalibur"
import { Player } from "./player.js"
import { Resources } from "./resources.js"

export class Drone extends Actor {
    constructor(x, y) {
        super({
            x: x,
            y: y,
            width: 40,
            height: 40,
            color: Color.Red,
            collisionType: CollisionType.Passive 
        })
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
            ctx.moveBy(250, 0, 100)   
               .moveBy(-250, 0, 100)  
        })

        // --- BETRAPT WORDEN ---
        this.on('collisionstart', (evt) => {
            if (evt.other.owner instanceof Player) {
                console.log("BETRAPT! Terug naar de start.")
                
                evt.other.owner.startKnockout()
            }
        })
    }

    onPostUpdate(engine) {
        if (this.graphics.current) {
            this.graphics.current.flipHorizontal = this.vel.x < 0
        }
    }
}