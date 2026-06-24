import { Scene, Label, Font, Color, Actor, Timer, CollisionType, Vector, Keys } from "excalibur";
import { Resources } from "../resources.js";
import { Player } from "../player.js";

export class VestraCity extends Scene {
    onInitialize(engine) {
        this.backgroundColor = Color.Black;

        const introBg = new Actor({
            x: engine.drawWidth / 2,
            y: engine.drawHeight / 2
        });

        introBg.graphics.use(Resources.VestraCity.toSprite());
        introBg.graphics.opacity = 0;
        this.add(introBg);

        const gateBg = new Actor({
            x: engine.drawWidth / 2,
            y: engine.drawHeight / 2
        });

        gateBg.graphics.use(Resources.VestraGate.toSprite());
        gateBg.graphics.opacity = 0;
        this.add(gateBg);

        const title = new Label({
            text: "",
            x: 360,
            y: 100,
            color: Color.White,
            font: new Font({
                family: "Upheaval",
                size: 75
            })
        });

        this.add(title);

        const year = new Label({
            text: "",
            x: 570,
            y: 180,
            color: Color.White,
            font: new Font({
                family: "Upheaval",
                size: 45
            })
        });

        this.add(year);

        const fullText = "VESTRA CITY";
        const fullYear = "1999";

        let introAlpha = 0;
        let titleIndex = 0;
        let yearIndex = 0;

        const introTimer = new Timer({
            interval: 180,
            repeats: true,
            fcn: () => {
                introAlpha += 0.08;

                if (introAlpha > 1) introAlpha = 1;

                introBg.graphics.opacity = introAlpha;

                if (titleIndex < fullText.length) {
                    title.text = fullText.substring(0, titleIndex + 1);
                    titleIndex++;
                } else if (yearIndex < fullYear.length) {
                    year.text = fullYear.substring(0, yearIndex + 1);
                    yearIndex++;
                } else {
                    introTimer.cancel();
                    switchTimer.start();
                }
            }
        });

        this.add(introTimer);

        let switchAlpha = 0;

        const switchTimer = new Timer({
            interval: 50,
            repeats: true,
            fcn: () => {
                switchAlpha += 0.02;

                if (switchAlpha >= 1) {
                    switchAlpha = 1;
                    switchTimer.cancel();
                    startLevel(engine);
                }

                introBg.graphics.opacity = 1 - switchAlpha;
                title.graphics.opacity = 1 - switchAlpha;
                year.graphics.opacity = 1 - switchAlpha;
                gateBg.graphics.opacity = switchAlpha;
            }
        });

        this.add(switchTimer);

        const startLevel = (engine) => {
            let hasKeycard = false;
            let nearDoor = false;

            const objective = new Label({
                text: "Objective: word niet gezien en sluip naar binnen.",
                x: 40,
                y: 40,
                color: Color.White,
                font: new Font({
                    family: "Upheaval",
                    size: 24
                })
            });

            this.add(objective);

            const ground = new Actor({
                x: engine.drawWidth / 2,
                y: 710,
                width: engine.drawWidth,
                height: 60,
                collisionType: CollisionType.Fixed
            });

            this.add(ground);



            const keycard = new Actor({
                x: 1040,
                y: 650,
                width: 30,
                height: 18,
                collisionType: CollisionType.Passive
            });

            keycard.graphics.use(Resources.Keycard.toSprite());
            keycard.scale = new Vector(0.08, 0.08);


            this.add(keycard);

            const smallDoorTrigger = new Actor({
                x: 360,
                y: 610,
                width: 70,
                height: 120,
                collisionType: CollisionType.Passive
            });

            this.add(smallDoorTrigger);

            const platform1 = new Actor({
                x: 685,
                y: 610,
                width: 335,
                height: 20,
                collisionType: CollisionType.Fixed,
                color: Color.Gray
            });
            platform1.graphics.opacity = 0;
            this.add(platform1);

            const roofPlatform = new Actor({
                x: 940,
                y: 510,
                width: 200,
                height: 20,
                collisionType: CollisionType.Fixed
            });

            roofPlatform.graphics.opacity = 0;
            this.add(roofPlatform);

            const platform3 = new Actor({
                x: 1165,
                y: 640,
                width: 135,
                height: 20,
                collisionType: CollisionType.Fixed,
                color: Color.Gray
            });
            platform3.graphics.opacity = 0;
            this.add(platform3);

            const vision = new Actor({
                x: 1190,
                y: 570,
                width: 520,
                height: 180,
                collisionType: CollisionType.Passive
            });

            vision.graphics.use(Resources.GuardVision.toSprite());
            vision.graphics.offset = new Vector(260, 0);
            vision.scale = new Vector(0.45, 0.45);
            this.add(vision);

            const visionHitbox = new Actor({
                x: 1150,
                y: 570,
                width: 420,
                height: 120,
                collisionType: CollisionType.Passive,
                color: Color.Red
            });

            visionHitbox.graphics.opacity = 0.0;
            this.add(visionHitbox);

            let lookingLeft = false;

            const guardTimer = new Timer({
                interval: 4000,
                repeats: true,
                fcn: () => {
                    lookingLeft = !lookingLeft;

                    if (lookingLeft) {
                        vision.pos.x = 550;
                        vision.pos.y = 570;
                        vision.scale = new Vector(-0.45, 0.45);

                        visionHitbox.pos.x = 760;
                        visionHitbox.pos.y = 570;
                    } else {
                        vision.pos.x = 1190;
                        vision.pos.y = 570;
                        vision.scale = new Vector(0.45, 0.45);

                        visionHitbox.pos.x = 1150;
                        visionHitbox.pos.y = 570;
                    }
                }
            });

            this.add(guardTimer);
            guardTimer.start();

            const player = new Player();
            player.name = "player";
            player.pos.x = 120;
            player.pos.y = 560;
            this.add(player);



            keycard.on("collisionstart", (event) => {
                if (event.other.owner?.name === "player") {
                    hasKeycard = true;
                    objective.text = "Keycard gevonden. Ga naar het kleine deurtje.";
                    keycard.kill();
                }
            });


            let caught = false;


            visionHitbox.on("collisionstart", (event) => {
                if (event.other.owner?.name === "player" && !caught) {
                    caught = true;

                    player.vel.x = 0;
                    player.vel.y = 0;

                    const fade = new Actor({
                        x: engine.drawWidth / 2,
                        y: engine.drawHeight / 2,
                        width: engine.drawWidth,
                        height: engine.drawHeight,
                        color: Color.Black
                    });

                    fade.graphics.opacity = 0;
                    this.add(fade);

                    const fadeTimer = new Timer({
                        interval: 40,
                        repeats: true,
                        fcn: () => {
                            fade.graphics.opacity += 0.05;

                            if (fade.graphics.opacity >= 1) {
                                fadeTimer.cancel();
                                engine.lastScene = "vestracity";
                                engine.goToScene("gameover");
                            }
                        }
                    });

                    this.add(fadeTimer);
                    fadeTimer.start();
                }
            });

            smallDoorTrigger.on("collisionstart", (event) => {
                if (event.other.owner?.name === "player") {
                    nearDoor = true;

                    if (hasKeycard) {
                        objective.text = "Druk op E om door het kleine deurtje te gaan.";
                    } else {
                        objective.text = "De deur zit op slot. Zoek eerst de keycard.";
                    }
                }
            });

            smallDoorTrigger.on("collisionend", (event) => {
                if (event.other.owner?.name === "player") {
                    nearDoor = false;

                    if (hasKeycard) {
                        objective.text = "Keycard gevonden. Ga naar het kleine deurtje.";
                    } else {
                        objective.text = "Objective: word niet gezien en sluip naar binnen.";
                    }
                }
            });
            this.on("preupdate", () => {
                if (nearDoor && hasKeycard && engine.input.keyboard.wasPressed(Keys.E)) {
                    engine.goToScene("vestracityinside");
                     console.log("E ingedrukt");
                }
            });
        };

        introTimer.start();
    }
}