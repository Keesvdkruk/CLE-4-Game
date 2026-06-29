import { Actor, CollisionType, Color } from "excalibur"

export class Ground extends Actor {
    constructor() {
        super({
            x: 2000,
            y: 650,           
            width: 4000,
            height: 40,
            collisionType: CollisionType.Fixed 
        })
        
        this.name = 'ground'
    }
}