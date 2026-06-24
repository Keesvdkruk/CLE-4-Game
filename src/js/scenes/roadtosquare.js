import { Scene, Actor, CollisionType, Label, Font, Color, Timer } from "excalibur";
import { Resources } from "../resources.js";
import { Player } from "../player.js";

export class RoadToSquare extends Scene {
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

        const ground = new Actor({
            x: levelWidth / 2,
            y: 670,
            width: levelWidth,
            height: 60,
            collisionType: CollisionType.Fixed
        });


        ground.graphics.opacity = 0;
        this.add(ground);

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

            platform.graphics.opacity = 0.2;
            this.add(platform);

            return platform;
        };

        makePlatform(1105, 550, 112);
        makePlatform(1310, 500, 70);
        makePlatform(1610, 400, 160);
        makePlatform(1460, 465, 150);
        makePlatform(1970, 365, 60);
        makePlatform(2120, 255, 170);
        makePlatform(2520, 305, 160);
        makePlatform(2055, 550, 112);
        makePlatform(2642, 550, 112);
        makePlatform(2845, 500, 70);
        makePlatform(4380, 500, 70);
        makePlatform(5915, 500, 70);
        makePlatform(7450, 500, 70);
        makePlatform(3000, 465, 150);
        makePlatform(4540, 465, 150);
        makePlatform(6080, 465, 150);
        makePlatform(7620, 465, 150);
        makePlatform(3150, 400, 160);
        makePlatform(4690, 400, 160);
        makePlatform(6230, 400, 160);
        makePlatform(4179, 550, 112);
        makePlatform(5716, 550, 112);
        makePlatform(7250, 550, 112);
        makePlatform(2855, 190, 120);
        makePlatform(3590, 550, 112);
        makePlatform(5125, 550, 112);
        makePlatform(6660, 550, 112);
        makePlatform(6995, 460, 90);
        makePlatform(5460, 460, 90);
        makePlatform(3925, 460, 90);
        makePlatform(2390, 460, 90);
        makePlatform(3505, 365, 60);
        makePlatform(5040, 365, 60);
        makePlatform(6575, 365, 60);
        makePlatform(3655, 255, 170);
        makePlatform(5190, 255, 170);
        makePlatform(6725, 255, 170);
        makePlatform(4055, 305, 160);
        makePlatform(5590, 305, 160);
        makePlatform(7125, 305, 160);

        const player = new Player();
        player.name = "player";
        player.pos.x = 120;
        player.pos.y = 560;
        this.add(player);

        let playerHit = false;
        let levelCompleted = false;

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
            x: 40,
            y: 40,
            color: Color.White,
            font: new Font({
                family: "Upheaval",
                size: 24
            })
        });

        this.add(objective);

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

            objective.pos.x = this.camera.pos.x - engine.drawWidth / 2 + 40;
            objective.pos.y = this.camera.pos.y - engine.drawHeight / 2 + 40;
        });
    }
}