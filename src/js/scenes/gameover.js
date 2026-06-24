import { Scene, Actor, CollisionType } from "excalibur";
import { Resources } from "../resources.js";
import { RoadToSquare } from "./roadtosquare.js";

export class GameOver extends Scene {
    onInitialize(engine) {
        const sprite = Resources.GameOver.toSprite();

        const bg = new Actor({
            x: engine.drawWidth / 2,
            y: engine.drawHeight / 2
        });

        bg.graphics.use(sprite);

        bg.scale.setTo(
            engine.drawWidth / sprite.width,
            engine.drawHeight / sprite.height
        );

        this.add(bg);

        const retryButton = new Actor({
            x: engine.drawWidth / 2,
            y: 610,
            width: 430,
            height: 80,
            collisionType: CollisionType.Passive
        });

        retryButton.graphics.opacity = 0;
        this.add(retryButton);

        retryButton.on("pointerdown", () => {
            const scene = engine.lastScene || "start";

            if (scene === "roadtosquare") {
                engine.removeScene("roadtosquare");
                engine.addScene("roadtosquare", new RoadToSquare());
            }

            engine.goToScene(scene);
        });
    }
}