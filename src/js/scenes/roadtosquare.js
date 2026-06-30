import { Scene, Actor, CollisionType, Label, Font, Color, Timer, Keys, } from "excalibur";
import { Resources } from "../resources.js";
import { Player } from "../player.js";
import { HUD } from "../HUD.js";
import { MenuButton } from "./MenuButton.js";
import { GameState } from "../state.js";


export class RoadToSquare extends Scene {
    onInitialize(engine) {
        GameState.currentScene = "peacefulroadtosquare";
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

        const ground = new Actor({
            x: levelWidth / 2,
            y: 670,
            width: levelWidth,
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
        const makePlatform = (x, y, width, height = 6) => {
            const platform = new Actor({
                x,
                y,
                width,
                height,
                collisionType: CollisionType.Fixed,
                color: Color.fromRGB(210, 200, 160)
            });

            platform.graphics.opacity = 0.0;
            this.add(platform);

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

                shine.graphics.opacity =
                    0.35 + Math.sin(performance.now() / 120) * 0.25;
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

        let playerHit = false;
        let levelCompleted = false;
        let startTime = Date.now();
        let currentTime = 0;

        let bestTime = localStorage.getItem("roadToSquareBestTime");

        if (bestTime !== null) {
            bestTime = Number(bestTime);
        }


        const spawnBullet = () => {
            if (levelCompleted || playerHit) {
                return;
            }

            const bullet = new Actor({
                x: this.camera.pos.x + engine.drawWidth / 2 + 80,
                y: 180 + Math.random() * 450,
                width: 36,
                height: 14,
                collisionType: CollisionType.Passive
            });

            bullet.graphics.use(Resources.Bullet.toSprite());
            bullet.scale.setTo(0.05, 0.05);
            bullet.vel.x = -430;

            this.add(bullet);

            Resources.Gunshot.play(0.18);



            bullet.on("collisionstart", (event) => {
                if (event.other.owner?.name === "player" && !playerHit && !levelCompleted) {
                    playerHit = true;
                    console.log("Speler geraakt!");

                    engine.lastScene = "roadtosquare";
                    engine.goToScene("gameover");
                }
            });

            bullet.on("preupdate", () => {
                if (bullet.pos.x < this.camera.pos.x - engine.drawWidth / 2 - 100) {
                    bullet.kill();
                }
            });
        };

        const bulletTimer = new Timer({
            interval: 800,
            repeats: true,
            fcn: () => {
                spawnBullet();
            }
        });

        this.add(bulletTimer);
        bulletTimer.start();

        const objective = new Label({
            text: "Objective: volg de menigte richting het centrale plein.",
            x: 340,
            y: 40,
            color: Color.White,
            font: new Font({
                family: "Upheaval",
                size: 24
            })
        });

        this.add(objective);
        const scoreText = new Label({
            text: "Time: 0.00",
            x: 340,
            y: 70,
            color: Color.White,
            font: new Font({
                family: "Upheaval",
                size: 22
            })
        });

        this.add(scoreText);

        const highScoreText = new Label({
            text: bestTime === null ? "Best: --" : "Best: " + bestTime.toFixed(2),
            x: 340,
            y: 100,
            color: Color.White,
            font: new Font({
                family: "Upheaval",
                size: 22
            })
        });

        this.add(highScoreText);

        const retryText = new Label({
            text: "Druk R om opnieuw te gaan",
            x: 340,
            y: 130,
            color: Color.White,
            font: new Font({
                family: "Upheaval",
                size: 22
            })
        });

        this.add(retryText);

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
            bulletTimer.cancel();

            currentTime = (Date.now() - startTime) / 1000;

            if (bestTime === null || currentTime < bestTime) {
                bestTime = currentTime;
                localStorage.setItem("roadToSquareBestTime", bestTime);
                highScoreText.text = "Best: " + bestTime.toFixed(2);
            }

            scoreText.text = "Time: " + currentTime.toFixed(2);

            objective.text = "Je bereikt het centrale plein...";

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

                        engine.lastScene = "roadtosquare";
                        engine.goToScene("violencesquare");
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

            objective.pos.x = this.camera.pos.x - engine.drawWidth / 2 + 140;
            objective.pos.y = this.camera.pos.y - engine.drawHeight / 2 + 40;

            if (!levelCompleted && !playerHit) {
                currentTime = (Date.now() - startTime) / 1000;
                scoreText.text = "Time: " + currentTime.toFixed(2);
            }

            scoreText.pos.x = this.camera.pos.x - engine.drawWidth / 2 + 940;
            scoreText.pos.y = this.camera.pos.y - engine.drawHeight / 2 + 160;

            highScoreText.pos.x = this.camera.pos.x - engine.drawWidth / 2 + 940;
            highScoreText.pos.y = this.camera.pos.y - engine.drawHeight / 2 + 100;

            retryText.pos.x = this.camera.pos.x + engine.drawWidth / 2 - 360;
            retryText.pos.y = this.camera.pos.y - engine.drawHeight / 2 + 40;

            if (engine.input.keyboard.wasPressed(Keys.R)) {
                const resetSceneName = "roadtosquare_" + Date.now();

                engine.addScene(resetSceneName, new RoadToSquare());
                engine.goToScene(resetSceneName);
            }
        });
    }
}