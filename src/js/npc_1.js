import { Actor, CollisionType, SpriteSheet, Animation, range } from "excalibur";
import { Resources } from "./resources.js";

export class Npc_1 extends Actor {
    constructor(x, y, walking = true) {
        super({
            x,
            y,
            width: 80,
            height: 150,
            collisionType: CollisionType.Passive
        });

        const npcSheet = SpriteSheet.fromImageSource({
            image: Resources.Npc_1,
            grid: {
                rows: 1,
                columns: 6,
                spriteWidth: 256,
                spriteHeight: 1024
            }
        });

        const npcWalk = Animation.fromSpriteSheet(
            npcSheet,
            range(0, 5),
            180
        );

        npcWalk.loop = true;

        if (walking) {
            // Lopende NPC
            this.graphics.use(npcWalk);
            this.vel.x = 45;
        } else {
            // Stilstaande NPC
            this.graphics.use(npcSheet.getSprite(0, 0));
            this.vel.x = 0;
        }

        this.scale.setTo(0.30, 0.30);
    }
}