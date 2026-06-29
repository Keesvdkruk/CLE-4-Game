import { Scene, Actor, CollisionType, Label, Font, Color, Keys, Timer } from "excalibur";
import { Resources } from "../resources.js";
import { Player } from "../player.js";
import { Npc_1 } from "../npc_1.js";
import { Npc_2 } from "../npc_2.js";
import { GameState } from "../state.js";
import { HUD } from "../HUD.js";

export class VestraCityInside extends Scene {
    onInitialize(engine) {
        const bg = new Actor({
            x: engine.drawWidth / 2,
            y: engine.drawHeight / 2
        });

        bg.graphics.use(Resources.VestraInside.toSprite());
        this.add(bg);

        const ground = new Actor({
            x: engine.drawWidth / 2,
            y: 670,
            width: engine.drawWidth,
            height: 60,
            collisionType: CollisionType.Fixed
        });

        this.add(ground);

        const hud = new HUD();
        this.add(hud);

        const leftBorder = new Actor({
            x: -25,
            y: engine.drawHeight / 2,
            width: 50,
            height: engine.drawHeight,
            collisionType: CollisionType.Fixed
        });

        leftBorder.graphics.opacity = 0;
        this.add(leftBorder);

        const rightBorder = new Actor({
            x: engine.drawWidth + 25,
            y: engine.drawHeight / 2,
            width: 50,
            height: engine.drawHeight,
            collisionType: CollisionType.Fixed
        });

        rightBorder.graphics.opacity = 0;
        this.add(rightBorder);

        const player = new Player();
        player.name = "player";
        player.pos.x = 1130;
        player.pos.y = 470;
        this.add(player);

        let nearLever = false;
        let leverChoiceMade = false;
        let gateOpen = false;
        let leavingScene = false;

        const choiceText = new Label({
            text: "",
            x: 250,
            y: 80,
            color: Color.White,
            font: new Font({
                family: "Upheaval",
                size: 24
            })
        });

        this.add(choiceText);


        


        const getRebelAmount = () => {
            return Math.max(4, Math.floor(GameState.support / 5));
        };

        const spawnProtestants = () => {
            const rebelAmount = getRebelAmount();

            for (let i = 0; i < rebelAmount; i++) {
                const x = 80 + i * 55 + (Math.random() * 20 - 10);
                const y = 600 + (Math.random() * 12 - 6);

                const protestant = Math.random() < 0.5
                    ? new Npc_1(x, y)
                    : new Npc_2(x, y);

                protestant.vel.x = 42 + Math.random() * 10;
                this.add(protestant);

                if (i === 2) {
                    const bubble = new Actor({
                        x: protestant.pos.x + 72,
                        y: protestant.pos.y - 110
                    });

                    bubble.graphics.use(Resources.SpeechBubble.toSprite());
                    bubble.scale.setTo(0.35, 0.35);
                    this.add(bubble);

                    const speechText = new Label({
                        text: "NAAR HET PLEIN!",
                        x: protestant.pos.x + 10,
                        y: protestant.pos.y - 130,
                        color: Color.Black,
                        font: new Font({
                            family: "Upheaval",
                            size: 16
                        })
                    });

                    this.add(speechText);

                    bubble.on("preupdate", () => {
                        bubble.pos.x = protestant.pos.x + 72;
                        bubble.pos.y = protestant.pos.y - 110;
                    });

                    speechText.on("preupdate", () => {
                        speechText.pos.x = protestant.pos.x + 10;
                        speechText.pos.y = protestant.pos.y - 130;
                    });
                }
            }
        };

        const goToCorrectRoadScene = () => {
            if (GameState.peace <= 50) {
                engine.goToScene("roadtosquare");
            } else {
                engine.goToScene("peacefulroadtosquare");
            }
        };

        const startExitFade = () => {
            leavingScene = true;

            choiceText.text = GameState.peace <= 50
                ? "De stad kookt over. De menigte trekt gewelddadig naar het plein..."
                : "De menigte trekt rustig richting het centrale plein...";

            GameState.saveCheckpoint();

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
                        goToCorrectRoadScene();
                    }
                }
            });

            this.add(fadeTimer);
            fadeTimer.start();
        };

        const leverTrigger = new Actor({
            x: 740,
            y: 560,
            width: 120,
            height: 130,
            collisionType: CollisionType.Passive
        });

        leverTrigger.graphics.opacity = 0;
        this.add(leverTrigger);

        leverTrigger.on("collisionstart", (event) => {
            if (event.other.owner?.name === "player" && !leverChoiceMade) {
                nearLever = true;
                choiceText.text = "E: open de poort     Q: houd de poort dicht";
            }
        });

        leverTrigger.on("collisionend", (event) => {
            if (event.other.owner?.name === "player" && !leverChoiceMade) {
                nearLever = false;
                choiceText.text = "";
            }
        });

        const exitTrigger = new Actor({
            x: engine.drawWidth + 40,
            y: 560,
            width: 120,
            height: 260,
            collisionType: CollisionType.Passive
        });

        exitTrigger.graphics.opacity = 0;
        this.add(exitTrigger);

        exitTrigger.on("collisionstart", (event) => {
            if (gateOpen && event.other.owner?.name === "player" && !leavingScene) {
                startExitFade();
            }
        });

        this.on("preupdate", () => {
            if (engine.input.keyboard.wasPressed(Keys.E)) {
                if (nearLever && !leverChoiceMade) {
                    leverChoiceMade = true;
                    gateOpen = true;

                    GameState.peace -= 20;

                    if (GameState.peace < 0) {
                        GameState.peace = 0;
                    }

                   

                    rightBorder.kill();

                    bg.graphics.use(Resources.VestraInsideOpen.toSprite());
                    choiceText.text = "De poort gaat open. Peace -20.";

                    const fade = new Actor({
                        x: engine.drawWidth / 2,
                        y: engine.drawHeight / 2,
                        width: engine.drawWidth,
                        height: engine.drawHeight,
                        color: Color.Black
                    });

                    fade.graphics.opacity = 0;
                    this.add(fade);

                    let fadingBack = false;

                    const fadeTimer = new Timer({
                        interval: 40,
                        repeats: true,
                        fcn: () => {
                            if (!fadingBack) {
                                fade.graphics.opacity += 0.04;

                                if (fade.graphics.opacity >= 1) {
                                    fade.graphics.opacity = 1;
                                    fadingBack = true;

                                    choiceText.text = "Rebellen stromen naar binnen. Aantal gebaseerd op Support.";
                                    spawnProtestants();
                                }
                            } else {
                                fade.graphics.opacity -= 0.04;

                                if (fade.graphics.opacity <= 0) {
                                    fade.graphics.opacity = 0;
                                    fadeTimer.cancel();
                                    fade.kill();
                                }
                            }
                        }
                    });

                    this.add(fadeTimer);
                    fadeTimer.start();
                }
            }

            if (engine.input.keyboard.wasPressed(Keys.Q)) {
                if (nearLever && !leverChoiceMade) {
                    leverChoiceMade = true;
                    gateOpen = true;

                    rightBorder.kill();

                    choiceText.text = "Je houdt de poort gesloten. Peace blijft gelijk. Loop naar rechts.";
                    updateStatsText();
                }
            }
        });
    }
}
