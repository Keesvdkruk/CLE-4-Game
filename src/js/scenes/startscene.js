import { Color, Scene, Label, Font, FontUnit, Actor, Rectangle, TextAlign } from "excalibur";
import { Resources } from "../resources.js";
import { GameState } from "../state.js";

export class StartScene extends Scene {
    onInitialize(engine) {
        const bg = new Actor({
            x: engine.drawWidth / 2,
            y: engine.drawHeight / 2
        });

        bg.graphics.use(Resources.StartScreen.toSprite());
        this.add(bg);

        const darkOverlay = new Actor({
            x: engine.drawWidth / 2,
            y: engine.drawHeight / 2,
            width: engine.drawWidth,
            height: engine.drawHeight
        });

        darkOverlay.graphics.use(new Rectangle({
            width: engine.drawWidth,
            height: engine.drawHeight,
            color: Color.fromRGB(0, 0, 0, 0.35)
        }));

        this.add(darkOverlay);

        const title = new Label({
            text: "STATE OF VESTRA",
            x: engine.drawWidth / 2,
            y: 120,
            color: Color.White,
            font: new Font({
                family: "MijnPixelFont",
                size: 78,
                unit: FontUnit.Px,
                textAlign: TextAlign.Center
            })
        });

        this.add(title);

        const subtitle = new Label({
            text: "Een stad onder controle. Een volk op het randje.",
            x: engine.drawWidth / 2,
            y: 220,
            color: Color.White,
            font: new Font({
                family: "MijnPixelFont",
                size: 28,
                unit: FontUnit.Px,
                textAlign: TextAlign.Center
            })
        });

        this.add(subtitle);

        const startLabel = new Label({
            text: "START GAME",
            x: engine.drawWidth / 2,
            y: 390,
            color: Color.White,
            font: new Font({
                family: "MijnPixelFont",
                size: 54,
                unit: FontUnit.Px,
                textAlign: TextAlign.Center
            })
        });

        this.add(startLabel);

        const resetLabel = new Label({
            text: "RESET SAVE",
            x: engine.drawWidth / 2,
            y: 460,
            color: Color.Red,
            font: new Font({
                family: "MijnPixelFont",
                size: 38,
                unit: FontUnit.Px,
                textAlign: TextAlign.Center
            })
        });

        this.add(resetLabel);

        const resetFeedback = new Label({
            text: "",
            x: engine.drawWidth / 2,
            y: 515,
            color: Color.White,
            font: new Font({
                family: "MijnPixelFont",
                size: 24,
                unit: FontUnit.Px,
                textAlign: TextAlign.Center
            })
        });

        this.add(resetFeedback);

        const infoLabel = new Label({
            text: "Peace en Support bepalen hoe Vestra eindigt.",
            x: engine.drawWidth / 2,
            y: 600,
            color: Color.White,
            font: new Font({
                family: "MijnPixelFont",
                size: 24,
                unit: FontUnit.Px,
                textAlign: TextAlign.Center
            })
        });

        this.add(infoLabel);

        startLabel.on("pointerenter", () => {
            engine.canvas.style.cursor = "pointer";
            startLabel.color = Color.Yellow;
        });

        startLabel.on("pointerleave", () => {
            engine.canvas.style.cursor = "default";
            startLabel.color = Color.White;
        });

        resetLabel.on("pointerenter", () => {
            engine.canvas.style.cursor = "pointer";
            resetLabel.color = Color.White;
        });

        resetLabel.on("pointerleave", () => {
            engine.canvas.style.cursor = "default";
            resetLabel.color = Color.Red;
        });

        startLabel.on("pointerdown", () => {
            engine.canvas.style.cursor = "default";
            engine.goToScene("roadtosquare");
        });

        resetLabel.on("pointerdown", () => {
            GameState.resetAll();
            resetFeedback.text = "Save gereset: Peace 100 | Support 0";
        });
    }
}