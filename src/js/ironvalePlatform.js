import { Actor, CollisionType, Color, Vector } from "excalibur"
import { Resources } from "./resources";

export class ironvalePlatform extends Actor {
    constructor(x, y, width, height) {
        super({
            pos: new Vector(x, y),
            width: width,
            height: height,
            anchor: new Vector(0, 0),
            color: Color.Brown
        });
    }

    onInitialize(engine) {
        this.body.collisionType = CollisionType.Fixed
    }
}