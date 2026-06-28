import { Actor, Color, CollisionType, Rectangle } from "excalibur"
import { Player } from "./player.js"

export class Laser extends Actor {
    constructor(x, y, breedte, hoogte) {
        super({
            x: x,
            y: y,
            width: breedte,
            height: hoogte,
            collisionType: CollisionType.Passive,
            z: 10
        })

        this.isActive = true
        this.toggleTimer = 0
        this.toggleInterval = 2000 
        
        // We maken twee keiharde, losse 'plaatjes' (Rectangles)
        this.laserAan = new Rectangle({ width: breedte, height: hoogte, color: Color.Red })
        this.laserUit = new Rectangle({ width: breedte, height: hoogte, color: Color.Transparent }) 
        
        // We slaan ze op in het graphics systeem, net als bij je animaties
        this.graphics.add("aan", this.laserAan)
        this.graphics.add("uit", this.laserUit)
        
        this.graphics.use("aan")
    }

    onInitialize(engine) {
        // Zwaartekracht absoluut uit
        if (this.body) {
            this.body.useGravity = false
        }

        this.on('collisionstart', (evt) => {
            if (this.isActive && evt.other.owner instanceof Player) {
                evt.other.owner.startKnockout()
            }
        })
    }

    onPreUpdate(engine, delta) {
        // Voorkom dat hij kan bewegen
        if (this.body) {
            this.vel.x = 0
            this.vel.y = 0
        }

        this.toggleTimer += delta

        // De wissel logica
        if (this.toggleTimer >= this.toggleInterval) {
            this.isActive = !this.isActive
            this.toggleTimer = 0 
            
            // We wisselen het 'plaatje' af, veilig via de engine
            if (this.isActive) {
                this.graphics.use("aan")
            } else {
                this.graphics.use("uit")
            }
        }
    }
}