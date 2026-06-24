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
            x: engine.drawWidth / 2 - 250, 
            y: engine.drawHeight / 4,
            text: "State of Vestra",
            font: new Font({
                family: 'MijnPixelFont', 
                size: 75,
                unit: FontUnit.Px 
            })
        });
        this.add(settingsLabel);

        const southreachLabel = new Label({
            color: Color.White,
            x: engine.drawWidth / 2 - 100,
            y: engine.drawHeight / 2 + 50,
            text: "Southreach",
            font: new Font({
                family: 'MijnPixelFont', 
                size: 50, 
                unit: FontUnit.Px
            })

        });
        const vestraCityLabel = new Label({
            color: Color.Red,
            x: engine.drawWidth / 2 - 180,
            y: engine.drawHeight / 2 + 150,
            text: "Vestra City",
            font: new Font({
                size: 60
            })
        });
        this.add(vestraCityLabel);

        vestraCityLabel.on("pointerdown", () => {
            this.engine.goToScene("vestracity");
        });
        this.add(southreachLabel);

        const ironvaleLabel = new Label({
            color: Color.White,
            x: engine.drawWidth / 2 - 100,
            y: engine.drawHeight / 2 + 100,
            text: "Ironvale",
            font: new Font({
                family: 'MijnPixelFont', 
                size: 50, 
                unit: FontUnit.Px
            })
        });
        this.add(ironvaleLabel);

         const ironvaleFactoryLabel = new Label({
            color: Color.White,
            x: engine.drawWidth / 2 - 100,
            y: engine.drawHeight / 2 + 150,
            text: "Ironvale Factory",
            font: new Font({
                family: 'MijnPixelFont', // EN HIER OOK!
                size: 50, // Pixel fonts zijn vaak wat groter, dus speel met deze grootte
                unit: FontUnit.Px
            })
        });
        this.add(ironvaleFactoryLabel);

        const eastwatchLabel = new Label({
            color: Color.White,
            x: engine.drawWidth / 2 - 100,
            y: engine.drawHeight / 2 + 200,
            text: "Eastwatch",
            font: new Font({
                family: 'MijnPixelFont', 
                size: 50, 
                unit: FontUnit.Px
            })
        });
        this.add(eastwatchLabel);

        southreachLabel.on("pointerenter", () => engine.canvas.style.cursor = 'pointer');
        southreachLabel.on("pointerleave", () => engine.canvas.style.cursor = 'default');

        ironvaleLabel.on("pointerenter", () => engine.canvas.style.cursor = 'pointer');
        ironvaleLabel.on("pointerleave", () => engine.canvas.style.cursor = 'default');

        ironvaleFactoryLabel.on("pointerenter", () => engine.canvas.style.cursor = 'pointer');
        ironvaleFactoryLabel.on("pointerleave", () => engine.canvas.style.cursor = 'default');

        eastwatchLabel.on("pointerenter", () => engine.canvas.style.cursor = 'pointer');
        eastwatchLabel.on("pointerleave", () => engine.canvas.style.cursor = 'default');

        southreachLabel.on("pointerdown", () => this.handleClick("southreach"));
        ironvaleLabel.on("pointerdown", () => this.handleClick("ironvale"));
        ironvaleFactoryLabel.on("pointerdown", () => this.handleClick("ironvalefactory"));
        eastwatchLabel.on("pointerdown", () => this.handleClick("eastwatch"));
    }

    handleClick(scene) {
        this.engine.canvas.style.cursor = 'default';
        this.engine.goToScene(scene);

    }
}