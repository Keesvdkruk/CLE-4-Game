import { Actor, CollisionType, Color } from "excalibur"

export class Ground extends Actor {
    constructor() {
        super({
            x: 2000,
            y: 700,           
            width: 4000,
            height: 40,
            color: Color.Black,
            collisionType: CollisionType.Fixed 
        })
        
        this.name = 'ground'
    }
}