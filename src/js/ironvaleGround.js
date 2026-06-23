import { Actor, CollisionType, Color } from "excalibur"
import { Resources } from "./resources";

export class ironvaleGround extends Actor {
    constructor() {
        super({
            x: 2000,
            y: 700,           
            width: 4000,
            height: 40,
            color: Color.Brown, 
            collisionType: CollisionType.Fixed 
        })
        
        this.name = 'ground'


    }    

}