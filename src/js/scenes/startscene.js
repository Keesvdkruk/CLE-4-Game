import { Color, Scene, Label, Font, FontUnit, Actor, Rectangle } from "excalibur";
import { Game } from "../game";

export class StartScene extends Scene {
    onInitialize(engine) {
        const overlay = new Actor({
            x: engine.drawWidth / 2,
            y: engine.drawHeight / 2,
            width: engine.drawWidth,
            height: engine.drawHeight
        });
        overlay.graphics.use(new Rectangle({
            width: engine.drawWidth,
            height: engine.drawHeight,
            color: Color.fromRGB(0, 0, 0, 0.85)
        }));
        this.add(overlay);

        const settingsLabel = new Label({
            color: Color.White,
            x: engine.drawWidth / 2 - 250, // Misschien iets meer naar links schuiven als het font breed is!
            y: engine.drawHeight / 4,
            text: "State of Vestra",
            font: new Font({
                family: 'MijnPixelFont', // HIER ROEPEN WE JE NIEUWE FONT AAN!
                size: 75,
                unit: FontUnit.Px // Zorgt dat Excalibur weet dat we pixels bedoelen
            })
        });
        this.add(settingsLabel);

        const levelOneLabel = new Label({
            color: Color.White,
            x: engine.drawWidth / 2 - 100,
            y: engine.drawHeight / 2 + 50,
            text: "Level 1",
            font: new Font({
                family: 'MijnPixelFont', // EN HIER OOK!
                size: 50, // Pixel fonts zijn vaak wat groter, dus speel met deze grootte
                unit: FontUnit.Px
            })
        });
        this.add(levelOneLabel);

        const ironvaleLabel = new Label({
            color: Color.White,
            x: engine.drawWidth / 2 - 100,
            y: engine.drawHeight / 2 + 150,
            text: "Ironvale",
            font: new Font({
                family: 'MijnPixelFont', // EN HIER OOK!
                size: 50, // Pixel fonts zijn vaak wat groter, dus speel met deze grootte
                unit: FontUnit.Px
            })
        });
        this.add(ironvaleLabel);

        const eastwatchLabel = new Label({
            color: Color.White,
            x: engine.drawWidth / 2 - 100,
            y: engine.drawHeight / 2 + 250,
            text: "Eastwatch",
            font: new Font({
                family: 'MijnPixelFont', // EN HIER OOK!
                size: 50, // Pixel fonts zijn vaak wat groter, dus speel met deze grootte
                unit: FontUnit.Px
            })
        });
        this.add(eastwatchLabel);

        // Zorg dat de muis een handje wordt als je eroverheen zweeft
        levelOneLabel.on("pointerenter", () => engine.canvas.style.cursor = 'pointer');
        levelOneLabel.on("pointerleave", () => engine.canvas.style.cursor = 'default');

        ironvaleLabel.on("pointerenter", () => engine.canvas.style.cursor = 'pointer');
        ironvaleLabel.on("pointerleave", () => engine.canvas.style.cursor = 'default');

        eastwatchLabel.on("pointerenter", () => engine.canvas.style.cursor = 'pointer');
        eastwatchLabel.on("pointerleave", () => engine.canvas.style.cursor = 'default');

        levelOneLabel.on("pointerdown", () => this.handleClick("levelone"));
        ironvaleLabel.on("pointerdown", () => this.handleClick("ironvale"));
        eastwatchLabel.on("pointerdown", () => this.handleClick("eastwatch"));
    }

    handleClick(scene) {
        // Reset de muiscursor voordat we naar het volgende level gaan
        this.engine.canvas.style.cursor = 'default';
        this.engine.goToScene(scene);

    }
}