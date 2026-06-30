import { Scene, Actor, CollisionType, Label, Font, Color, Keys, Timer, SpriteSheet, Animation, range } from "excalibur";

import { Resources } from "../resources.js";
import { Player } from "../player.js";
import { RoadToSquare } from "./roadtosquare.js";
import { Npc_1 } from "../npc_1.js";
import { Npc_2 } from "../npc_2.js";
import { PeacefulRoadToSquare } from "./peacefulroadtosquare.js";
import { HUD } from "../HUD.js";
import { MenuButton } from "./MenuButton.js";
import { GameState } from "../state.js";


export class Square extends Scene {
    onInitialize(engine) {
        GameState.currentScene = "peacefulroadtosquare";
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

        const hud = new HUD();
               this.add(hud);
       
               const menuButton = new MenuButton();
               this.add(menuButton);

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
            x: engine.drawWidth + 19,
            y: engine.drawHeight / 2,
            width: 50,
            height: engine.drawHeight,
            collisionType: CollisionType.Fixed
        });

        rightBorder.graphics.opacity = 0;
        this.add(rightBorder);

        const player = new Player();
        player.name = "player";
        player.pos.x = 120;
        player.pos.y = 460;
        this.add(player);

        let nearStatue = false;
        let statueDestroyed = false;

        const objective = new Label({
            text: "",
            x: 440,
            y: 40,
            color: Color.White,
            font: new Font({
                family: "Upheaval",
                size: 24
            })
        });

        this.add(objective);

        const retryTip = new Label({
            text: "Druk R om je tijd opnieuw te proberen.",
            x: 320,
            y: 120,
            color: Color.White,
            font: new Font({
                family: "Upheaval",
                size: 28
            })
        });

        retryTip.graphics.opacity = 0;
        this.add(retryTip);

        let tipWait = 0;

        const tipTimer = new Timer({
            interval: 40,
            repeats: true,
            fcn: () => {
                if (retryTip.graphics.opacity < 1 && tipWait === 0) {
                    retryTip.graphics.opacity += 0.04;
                } else {
                    tipWait++;

                    if (tipWait > 60) {
                        retryTip.graphics.opacity -= 0.03;
                    }

                    if (retryTip.graphics.opacity <= 0 && tipWait > 60) {
                        tipTimer.cancel();
                        retryTip.kill();
                    }
                }
            }
        });

        this.add(tipTimer);
        tipTimer.start();

        const rushCrowd = () => {
            for (let i = 0; i < 18; i++) {
                const x = -20 - i * 35;
                const y = 610 + (Math.random() * 30 - 15);

                const NpcClass = Math.random() < 0.5 ? Npc_1 : Npc_2;
                const npc = new NpcClass(x, y, true);

                npc.scale.setTo(0.23, 0.23);
                npc.vel.x = 260 + Math.random() * 100;
                npc.z = y;

                this.add(npc);
            }
        };

        const leaderSheet = SpriteSheet.fromImageSource({
            image: Resources.President,
            grid: {
                rows: 1,
                columns: 6,
                spriteWidth: 250,
                spriteHeight: 1024
            }
        });

        const leaderWalk = Animation.fromSpriteSheet(
            leaderSheet,
            range(0, 5),
            180
        );

        leaderWalk.loop = true;

        const kneelSheet = SpriteSheet.fromImageSource({
            image: Resources.President_kneel,
            grid: {
                rows: 1,
                columns: 8,
                spriteWidth: 192,
                spriteHeight: 1024
            }
        });

        const showEndScreen = () => {
            objective.kill();

            const blackFade = new Actor({
                x: engine.drawWidth / 2,
                y: engine.drawHeight / 2,
                width: engine.drawWidth,
                height: engine.drawHeight,
                color: Color.Black
            });

            blackFade.z = 9998;
            blackFade.graphics.opacity = 0;
            this.add(blackFade);

            const endBg = new Actor({
                x: engine.drawWidth / 2,
                y: engine.drawHeight / 2
            });

            const endSprite = Resources.EndScreen.toSprite();
            endBg.graphics.use(endSprite);
            endBg.scale.setTo(
                engine.drawWidth / endSprite.width,
                engine.drawHeight / endSprite.height
            );

            endBg.z = 9999;
            endBg.graphics.opacity = 0;
            this.add(endBg);

            const title = new Label({
                text: "VESTRA IS VRIJ",
                x: engine.drawWidth / 2 - 230,
                y: 10,
                color: Color.Black,
                font: new Font({
                    family: "Upheaval",
                    size: 56
                })
            });

            title.z = 10000;
            title.graphics.opacity = 0;
            this.add(title);

            const subtitle = new Label({
                text: "Het volk heeft gewonnen. Een nieuw hoofdstuk begint.",
                x: engine.drawWidth / 2 - 330,
                y: 60,
                color: Color.Black,
                font: new Font({
                    family: "Upheaval",
                    size: 24
                })
            });

            subtitle.z = 10000;
            subtitle.graphics.opacity = 0;
            this.add(subtitle);

            const fadeTimer = new Timer({
                interval: 40,
                repeats: true,
                fcn: () => {
                    blackFade.graphics.opacity += 0.03;

                    if (blackFade.graphics.opacity >= 1) {
                        blackFade.graphics.opacity = 1;
                    }

                    if (blackFade.graphics.opacity >= 0.85) {
                        endBg.graphics.opacity += 0.03;
                        title.graphics.opacity += 0.03;
                        subtitle.graphics.opacity += 0.03;
                    }

                    if (endBg.graphics.opacity >= 1) {
                        endBg.graphics.opacity = 1;
                        title.graphics.opacity = 1;
                        subtitle.graphics.opacity = 1;
                        fadeTimer.cancel();
                    }
                }
            });

            this.add(fadeTimer);
            fadeTimer.start();
        };

        const spawnLeader = () => {
            objective.text = "De leider van Vestra komt naar buiten...";

            const leader = new Actor({
                x: engine.drawWidth + 120,
                y: 645,
                width: 90,
                height: 180,
                collisionType: CollisionType.Passive
            });

            leader.graphics.use(leaderWalk.clone());
            leader.scale.setTo(-0.38, 0.38);
            leader.vel.x = -75;
            leader.z = 900;

            this.add(leader);

            leader.on("preupdate", () => {
                if (leader.pos.x <= 900) {
                    leader.vel.x = 0;
                    leader.graphics.use(leaderSheet.getSprite(5, 0));
                    leader.scale.setTo(-0.38, 0.38);

                    objective.text = "De leider stopt...";

                    const kneelWaitTimer = new Timer({
                        interval: 2000,
                        repeats: false,
                        fcn: () => {
                            leader.graphics.use(kneelSheet.getSprite(7, 0));
                            leader.scale.setTo(-0.38, 0.38);

                            objective.text = "De regering geeft zich over.";

                            const endWaitTimer = new Timer({
                                interval: 4000,
                                repeats: false,
                                fcn: () => {
                                    showEndScreen();
                                }
                            });

                            this.add(endWaitTimer);
                            endWaitTimer.start();
                        }
                    });

                    this.add(kneelWaitTimer);
                    kneelWaitTimer.start();

                    leader.off("preupdate");
                }
            });
        };

        const startBrokenFade = () => {
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

                        bg.graphics.use(Resources.SquareBroken.toSprite());
                        objective.text = "Het standbeeld ligt in puin.";

                        const fadeOutTimer = new Timer({
                            interval: 40,
                            repeats: true,
                            fcn: () => {
                                fade.graphics.opacity -= 0.04;

                                if (fade.graphics.opacity <= 0) {
                                    fadeOutTimer.cancel();
                                    fade.kill();

                                    const leaderTimer = new Timer({
                                        interval: 1200,
                                        repeats: false,
                                        fcn: () => {
                                            spawnLeader();
                                        }
                                    });

                                    this.add(leaderTimer);
                                    leaderTimer.start();
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

        const statueTrigger = new Actor({
            x: 650,
            y: 520,
            width: 260,
            height: 300,
            collisionType: CollisionType.Passive
        });

        statueTrigger.graphics.opacity = 0;
        this.add(statueTrigger);

        statueTrigger.on("collisionstart", (event) => {
            if (event.other.owner?.name === "player" && !statueDestroyed) {
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

            rushCrowd();

            objective.text = "De menigte bestormt het standbeeld!";
            this.camera.shake(12, 12, 1200);

            const waitTimer = new Timer({
                interval: 900,
                repeats: false,
                fcn: () => {
                    startBrokenFade();
                }
            });

            this.add(waitTimer);
            waitTimer.start();
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

            if (engine.input.keyboard.wasPressed(Keys.R)) {
                const scene = engine.lastScene || "roadtosquare";
                const resetSceneName = scene + "_" + Date.now();

                if (scene === "peacefulroadtosquare") {
                    engine.addScene(resetSceneName, new PeacefulRoadToSquare());
                } else {
                    engine.addScene(resetSceneName, new RoadToSquare());
                }

                engine.goToScene(resetSceneName);
            }
        });
    }
}