import { Actor, CollisionType, Color, Vector } from "excalibur"
import { Resources } from "./resources";

export class Platform extends Actor {
    constructor(x, y, width = 200, height = 30) {
        super({
            pos: new Vector(x, y),
            width: Resources.Platform.width,
            height: Resources.Platform.height,
            anchor: new Vector(0, 0)
        });

        this.graphics.use(Resources.Platform.toSprite());
    }

    onInitialize(engine) {
        this.body.collisionType = CollisionType.Fixed
    }
}