import { Scene, Actor, CollisionType, Timer, Color } from "excalibur";
import { Resources } from "../resources.js";
import { RoadToSquare } from "./roadtosquare.js";
import { VestraCity } from "./vestracity.js";

export class GameOver extends Scene {

    onInitialize(engine) {
        this.backgroundColor = Color.Black;

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

            if (scene === "vestracity") {
                engine.removeScene("vestracity");
                engine.addScene("vestracity", new VestraCity());
            }

            engine.goToScene(scene);
        });
    }

    onActivate() {
        const engine = this.engine;

        const blackScreen = new Actor({
            x: engine.drawWidth / 2,
            y: engine.drawHeight / 2,
            width: engine.drawWidth,
            height: engine.drawHeight,
            color: Color.Black
        });

        blackScreen.z = 9999;
        blackScreen.graphics.opacity = 1;
        this.add(blackScreen);

        const fadeTimer = new Timer({
            interval: 30,
            repeats: true,
            fcn: () => {
                blackScreen.graphics.opacity -= 0.04;

                if (blackScreen.graphics.opacity <= 0) {
                    fadeTimer.cancel();
                    blackScreen.kill();
                }
            }
        });

        this.add(fadeTimer);
        fadeTimer.start();
    }
}