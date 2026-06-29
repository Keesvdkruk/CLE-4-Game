import { Scene, Actor, CollisionType, Label, Font, Color, Timer, Keys } from "excalibur";
import { Resources } from "../resources.js";
import { Player } from "../player.js";
import { HUD } from "../HUD.js";

export class PeacefulRoadToSquare extends Scene {
    onInitialize(engine) {
        this.backgroundColor = Color.Black;

        const bgWidth = 1536;
        const bgY = engine.drawHeight / 2;
        const amountOfBackgrounds = 5;
        const levelWidth = bgWidth * amountOfBackgrounds;

        for (let i = 0; i < amountOfBackgrounds; i++) {
            const bg = new Actor({
                x: bgWidth / 2 + bgWidth * i,
                y: bgY
            });

            bg.graphics.use(Resources.CityRoad_3.toSprite());
            this.add(bg);
        }

        let combo = 0;
        let bestCombo = 0;
        let finalScore = 0;
        let lastPlatformX = 0;
        let touchedGround = true;
        let levelCompleted = false;
        let startTime = Date.now();
        let currentTime = 0;

        let savedBestCombo = localStorage.getItem("peacefulRoadBestCombo");
        let savedBestScore = localStorage.getItem("peacefulRoadBestScore");

        if (savedBestCombo !== null) {
            savedBestCombo = Number(savedBestCombo);
        }

        if (savedBestScore !== null) {
            savedBestScore = Number(savedBestScore);
        }

        const objective = new Label({
            text: "Objective: bereik rustig het centrale plein.",
            x: 40,
            y: 40,
            color: Color.White,
            font: new Font({
                family: "Upheaval",
                size: 24
            })
        });

        this.add(objective);

        const hud = new HUD();
        this.add(hud);

        const timeText = new Label({
            text: "Time: 0.00",
            x: 40,
            y: 70,
            color: Color.White,
            font: new Font({
                family: "Upheaval",
                size: 22
            })
        });

        this.add(timeText);

        const comboText = new Label({
            text: "Combo: 0",
            x: 40,
            y: 100,
            color: Color.White,
            font: new Font({
                family: "Upheaval",
                size: 22
            })
        });

        this.add(comboText);

        const bestComboText = new Label({
            text: savedBestCombo === null ? "Best Combo: --" : "Best Combo: " + savedBestCombo,
            x: 40,
            y: 340,
            color: Color.White,
            font: new Font({
                family: "Upheaval",
                size: 22
            })
        });

        this.add(bestComboText);

        const scoreText = new Label({
            text: savedBestScore === null ? "Best Score: --" : "Best Score: " + savedBestScore,
            x: 40,
            y: 340,
            color: Color.White,
            font: new Font({
                family: "Upheaval",
                size: 22
            })
        });

        this.add(scoreText);

        const retryText = new Label({
            text: "Druk R om opnieuw te gaan",
            x: 900,
            y: 40,
            color: Color.White,
            font: new Font({
                family: "Upheaval",
                size: 22
            })
        });

        this.add(retryText);

        const ground = new Actor({
            x: levelWidth / 2,
            y: 670,
            width: levelWidth,
            height: 60,
            collisionType: CollisionType.Fixed
        });

        ground.graphics.opacity = 0;
        this.add(ground);

        ground.on("collisionstart", (event) => {
            if (event.other.owner?.name === "player" && !levelCompleted) {
                combo = 0;
                lastPlatformX = 0;
                touchedGround = true;

                comboText.text = "Combo: 0";
            }
        });

        const leftBorder = new Actor({
            x: -25,
            y: engine.drawHeight / 2,
            width: 50,
            height: engine.drawHeight,
            collisionType: CollisionType.Fixed
        });

        leftBorder.graphics.opacity = 0;
        this.add(leftBorder);

        const makePlatform = (x, y, width, height = 6) => {
            const platform = new Actor({
                x,
                y,
                width,
                height,
                collisionType: CollisionType.Fixed,
                color: Color.fromRGB(210, 200, 160)
            });

            platform.graphics.opacity = 0;
            this.add(platform);

            platform.on("collisionstart", (event) => {
                if (event.other.owner?.name === "player" && !levelCompleted) {
                    if (touchedGround || x > lastPlatformX + 20) {
                        combo = touchedGround ? 1 : combo + 1;
                        touchedGround = false;
                        lastPlatformX = x;

                        if (combo > bestCombo) {
                            bestCombo = combo;
                        }

                        comboText.text = "Combo: " + combo;
                        bestComboText.text = "Best Combo: " + Math.max(bestCombo, savedBestCombo || 0);
                    }
                }
            });

            const shine = new Actor({
                x: x - width / 2,
                y: y - 4,
                width: 17,
                height: 3,
                color: Color.fromRGB(255, 245, 190)
            });

            shine.graphics.opacity = 0.75;
            shine.z = 100;
            this.add(shine);

            let shineX = x - width / 2;

            shine.on("preupdate", () => {
                shineX += 2;

                if (shineX > x + width / 2) {
                    shineX = x - width / 2;
                }

                shine.pos.x = shineX;
                shine.pos.y = y - 4;
                shine.graphics.opacity = 0.35 + Math.sin(performance.now() / 120) * 0.25;
            });

            return platform;
        };

        makePlatform(1105, 550, 112);
        makePlatform(1310, 495, 55);
        makePlatform(1610, 395, 160);
        makePlatform(1460, 465, 150);
        makePlatform(1970, 360, 60);
        makePlatform(2120, 260, 170);
        makePlatform(2520, 305, 160);
        makePlatform(2055, 550, 112);
        makePlatform(2642, 550, 112);
        makePlatform(2845, 495, 55);
        makePlatform(4380, 495, 55);
        makePlatform(5915, 495, 55);
        makePlatform(7450, 495, 55);
        makePlatform(3000, 465, 150);
        makePlatform(4540, 465, 150);
        makePlatform(6080, 465, 150);
        makePlatform(7620, 465, 150);
        makePlatform(3150, 395, 160);
        makePlatform(4690, 395, 160);
        makePlatform(6230, 395, 160);
        makePlatform(4179, 550, 112);
        makePlatform(5716, 550, 112);
        makePlatform(7250, 550, 112);
        makePlatform(2855, 185, 120);
        makePlatform(3590, 550, 112);
        makePlatform(5125, 550, 112);
        makePlatform(6660, 550, 112);
        makePlatform(6995, 460, 90);
        makePlatform(5460, 460, 90);
        makePlatform(3925, 460, 90);
        makePlatform(2390, 460, 90);
        makePlatform(3505, 360, 60);
        makePlatform(5040, 360, 60);
        makePlatform(6575, 360, 60);
        makePlatform(3655, 260, 170);
        makePlatform(5190, 260, 170);
        makePlatform(6725, 260, 170);
        makePlatform(4055, 305, 160);
        makePlatform(5590, 305, 160);
        makePlatform(7125, 305, 160);
        makePlatform(4390, 185, 120);
        makePlatform(5925, 185, 120);
        makePlatform(7460, 185, 120);

        const player = new Player();
        player.name = "player";
        player.pos.x = 120;
        player.pos.y = 560;
        this.add(player);

        const exitTrigger = new Actor({
            x: levelWidth + 30,
            y: 360,
            width: 220,
            height: 720,
            collisionType: CollisionType.Passive
        });

        exitTrigger.graphics.opacity = 0;
        this.add(exitTrigger);

        const startLevelTransition = () => {
            levelCompleted = true;
            currentTime = (Date.now() - startTime) / 1000;

            finalScore = bestCombo * 100 - Math.floor(currentTime * 5);

            if (finalScore < 0) {
                finalScore = 0;
            }

            if (bestCombo > 0 && (savedBestCombo === null || bestCombo > savedBestCombo)) {
                savedBestCombo = bestCombo;
                localStorage.setItem("peacefulRoadBestCombo", savedBestCombo);
            }

            if (savedBestScore === null || finalScore > savedBestScore) {
                savedBestScore = finalScore;
                localStorage.setItem("peacefulRoadBestScore", savedBestScore);
                scoreText.text = "Score: " + finalScore + "  NEW RECORD!";
            } else {
                scoreText.text = "Score: " + finalScore;
            }

            timeText.text = "Final Time: " + currentTime.toFixed(2);
            comboText.text = "Final Combo: " + bestCombo;
            bestComboText.text = "Best Combo: " + savedBestCombo;
            objective.text = "Je bereikt het centrale plein in vrede...";

            const fade = new Actor({
                x: this.camera.pos.x,
                y: this.camera.pos.y,
                width: engine.drawWidth,
                height: engine.drawHeight,
                color: Color.Black
            });

            fade.z = 9999;
            fade.graphics.opacity = 0;
            this.add(fade);

            const fadeTimer = new Timer({
                interval: 30,
                repeats: true,
                fcn: () => {
                    fade.pos.x = this.camera.pos.x;
                    fade.pos.y = this.camera.pos.y;
                    fade.graphics.opacity += 0.04;

                    if (fade.graphics.opacity >= 1) {
                        fade.graphics.opacity = 1;
                        fadeTimer.cancel();

                        engine.lastScene = "peacefulroadtosquare";
                        engine.goToScene("square");
                    }
                }
            });

            this.add(fadeTimer);
            fadeTimer.start();
        };

        exitTrigger.on("collisionstart", (event) => {
            if (event.other.owner?.name === "player" && !levelCompleted) {
                startLevelTransition();
            }
        });

        this.on("preupdate", () => {
            this.camera.pos.x = player.pos.x + 350;
            this.camera.pos.y = 360;

            if (this.camera.pos.x < engine.drawWidth / 2) {
                this.camera.pos.x = engine.drawWidth / 2;
            }

            if (this.camera.pos.x > levelWidth - engine.drawWidth / 2) {
                this.camera.pos.x = levelWidth - engine.drawWidth / 2;
            }

            objective.pos.x = this.camera.pos.x - engine.drawWidth / 2 + 240;
            objective.pos.y = this.camera.pos.y - engine.drawHeight / 2 + 40;

            timeText.pos.x = this.camera.pos.x - engine.drawWidth / 2 + 1040;
            timeText.pos.y = this.camera.pos.y - engine.drawHeight / 2 + 70;

            comboText.pos.x = this.camera.pos.x - engine.drawWidth / 2 + 1040;
            comboText.pos.y = this.camera.pos.y - engine.drawHeight / 2 + 100;

            bestComboText.pos.x = this.camera.pos.x - engine.drawWidth / 2 + 1040;
            bestComboText.pos.y = this.camera.pos.y - engine.drawHeight / 2 + 130;

            scoreText.pos.x = this.camera.pos.x - engine.drawWidth / 2 + 1040;
            scoreText.pos.y = this.camera.pos.y - engine.drawHeight / 2 + 160;

            retryText.pos.x = this.camera.pos.x + engine.drawWidth / 2 - 360;
            retryText.pos.y = this.camera.pos.y - engine.drawHeight / 2 + 40;

            if (!levelCompleted) {
                currentTime = (Date.now() - startTime) / 1000;
                timeText.text = "Time: " + currentTime.toFixed(2);
            }

            if (engine.input.keyboard.wasPressed(Keys.R)) {
                const resetSceneName = "peacefulroadtosquare_" + Date.now();

                engine.addScene(resetSceneName, new PeacefulRoadToSquare());
                engine.goToScene(resetSceneName);
            }
        });
    }
}