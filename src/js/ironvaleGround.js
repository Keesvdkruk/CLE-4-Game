import { Actor, CollisionType, Color } from "excalibur"
import { Resources } from "./resources";

export class ironvaleGround extends Actor {
    constructor() {
        super({
            x: 2000,
            y: 710,           
            width: 4000,
            height: 30,
            color: Color.Black, 
            collisionType: CollisionType.Fixed 
        })
        
        this.name = 'ground'


    }    

}