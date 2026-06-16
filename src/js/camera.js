import { Actor, CollisionType, Color, Vector } from "excalibur"

export class CameraEnemy extends Actor {
    constructor(x, y) {
        super({
            x: x,
            y: y,
            width: 40,
            height: 40,
            color: Color.Red,
            collisionType: CollisionType.Fixed 
        })
    }

    onInitialize(engine) {
        this.actions.repeatForever(ctx => {
            ctx.moveBy(250, 0, 100)   
               .moveBy(-250, 0, 100)  
        })

        // --- BETRAPT WORDEN ---
        this.on('collisionstart', (evt) => {
            if (evt.other.name === 'player') {
                console.log("BETRAPT! Terug naar de start.")
                
                evt.other.pos = new Vector(100, 500)
                
                evt.other.vel = new Vector(0, 0)
            }
        })
    }
}