import {
    Scene,
    Actor,
    CollisionType,
    Label,
    Font,
    Color,
    Keys,
    Timer
} from "excalibur";

import { Resources } from "../resources.js";
import { Player } from "../player.js";

export class Square extends Scene {

    onInitialize(engine) {

        this.backgroundColor = Color.Black;

        const bg = new Actor({
            x: engine.drawWidth / 2,
            y: engine.drawHeight / 2
        });

        bg.graphics.use(Resources.SquareBackground.toSprite());
        this.add(bg);

        const ground = new Actor({
            x: engine.drawWidth / 2,
            y: 730,
            width: engine.drawWidth,
            height: 60,
            collisionType: CollisionType.Fixed
        });

        ground.graphics.opacity = 0;
        this.add(ground);

        const player = new Player();
        player.name = "player";
        player.pos.x = 120;
        player.pos.y = 460;
        this.add(player);

        let nearStatue = false;
        let statueDestroyed = false;

        const objective = new Label({
            text: "",
            x: 40,
            y: 40,
            color: Color.White,
            font: new Font({
                family: "Upheaval",
                size: 24
            })
        });

        this.add(objective);

        const statueTrigger = new Actor({
            x: 820,
            y: 520,
            width: 260,
            height: 300,
            collisionType: CollisionType.Passive
        });

        statueTrigger.graphics.opacity = 0;
        this.add(statueTrigger);

        statueTrigger.on("collisionstart", (event) => {
            if (
                event.other.owner?.name === "player" &&
                !statueDestroyed
            ) {
                nearStatue = true;
                objective.text = "Druk E om het standbeeld neer te halen";
            }
        });

        statueTrigger.on("collisionend", (event) => {
            if (event.other.owner?.name === "player") {
                nearStatue = false;

                if (!statueDestroyed) {
                    objective.text = "";
                }
            }
        });

        const destroyStatue = () => {
            statueDestroyed = true;

            objective.text = "De menigte bestormt het standbeeld!";
            this.camera.shake(12, 12, 1200);

            const fade = new Actor({
                x: engine.drawWidth / 2,
                y: engine.drawHeight / 2,
                width: engine.drawWidth,
                height: engine.drawHeight,
                color: Color.Black
            });

            fade.z = 9999;
            fade.graphics.opacity = 0;
            this.add(fade);

            const fadeInTimer = new Timer({
                interval: 40,
                repeats: true,
                fcn: () => {
                    fade.graphics.opacity += 0.04;

                    if (fade.graphics.opacity >= 1) {
                        fade.graphics.opacity = 1;
                        fadeInTimer.cancel();

                        bg.graphics.use(
                            Resources.SquareBroken.toSprite()
                        );

                        objective.text = "Het standbeeld ligt in puin.";

                        const fadeOutTimer = new Timer({
                            interval: 40,
                            repeats: true,
                            fcn: () => {
                                fade.graphics.opacity -= 0.04;

                                if (fade.graphics.opacity <= 0) {
                                    fadeOutTimer.cancel();
                                    fade.kill();
                                }
                            }
                        });

                        this.add(fadeOutTimer);
                        fadeOutTimer.start();
                    }
                }
            });

            this.add(fadeInTimer);
            fadeInTimer.start();
        };

        this.on("preupdate", () => {
            this.camera.pos.x = engine.drawWidth / 2;
            this.camera.pos.y = engine.drawHeight / 2;

            if (
                nearStatue &&
                !statueDestroyed &&
                engine.input.keyboard.wasPressed(Keys.E)
            ) {
                destroyStatue();
            }
        });
    }
}