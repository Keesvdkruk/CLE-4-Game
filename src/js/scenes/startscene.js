import { Color, Scene, Label, Font, FontUnit, Actor, Rectangle, TextAlign } from "excalibur";
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

        // --- TITLE ---
        const settingsLabel = new Label({
            color: Color.White,
            x: engine.drawWidth / 2,
            y: engine.drawHeight / 6,
            text: "State of Vestra",
            font: new Font({
                family: 'MijnPixelFont', 
                size: 75,
                unit: FontUnit.Px,
                textAlign: TextAlign.Center // Vertelt Excalibur om dit perfect te centreren
            })
        });
        this.add(settingsLabel);

        // --- MENU ITEMS ---
        // We verhogen de Y telkens met 60 pixels zodat ze mooi onder elkaar staan.
        const baseY = engine.drawHeight / 2;

        const southreachLabel = new Label({
            color: Color.White,
            x: engine.drawWidth / 2,
            y: baseY, 
            text: "Southreach",
            font: new Font({
                family: 'MijnPixelFont', 
                size: 50, 
                unit: FontUnit.Px,
                textAlign: TextAlign.Center
            })
        });
        this.add(southreachLabel);

        const ironvaleLabel = new Label({
            color: Color.White,
            x: engine.drawWidth / 2,
            y: baseY + 60,
            text: "Ironvale",
            font: new Font({
                family: 'MijnPixelFont', 
                size: 50, 
                unit: FontUnit.Px,
                textAlign: TextAlign.Center
            })
        });
        this.add(ironvaleLabel);

        const ironvaleFactoryLabel = new Label({
            color: Color.White,
            x: engine.drawWidth / 2,
            y: baseY + 120,
            text: "Ironvale Factory",
            font: new Font({
                family: 'MijnPixelFont', 
                size: 50, 
                unit: FontUnit.Px,
                textAlign: TextAlign.Center
            })
        });
        this.add(ironvaleFactoryLabel);

        const eastwatchLabel = new Label({
            color: Color.White,
            x: engine.drawWidth / 2,
            y: baseY + 180,
            text: "Eastwatch",
            font: new Font({
                family: 'MijnPixelFont', 
                size: 50, 
                unit: FontUnit.Px,
                textAlign: TextAlign.Center
            })
        });
        this.add(eastwatchLabel);
        
        const vestraCityLabel = new Label({
            color: Color.Red,
            x: engine.drawWidth / 2,
            y: baseY + 240,
            text: "Vestra City",
            font: new Font({
                family: 'MijnPixelFont', 
                size: 50, 
                unit: FontUnit.Px,
                textAlign: TextAlign.Center
            })
        });
        this.add(vestraCityLabel);

        // --- MUIS CURSOR LOGICA ---
        southreachLabel.on("pointerenter", () => engine.canvas.style.cursor = 'pointer');
        southreachLabel.on("pointerleave", () => engine.canvas.style.cursor = 'default');

        ironvaleLabel.on("pointerenter", () => engine.canvas.style.cursor = 'pointer');
        ironvaleLabel.on("pointerleave", () => engine.canvas.style.cursor = 'default');

        ironvaleFactoryLabel.on("pointerenter", () => engine.canvas.style.cursor = 'pointer');
        ironvaleFactoryLabel.on("pointerleave", () => engine.canvas.style.cursor = 'default');

        eastwatchLabel.on("pointerenter", () => engine.canvas.style.cursor = 'pointer');
        eastwatchLabel.on("pointerleave", () => engine.canvas.style.cursor = 'default');

        vestraCityLabel.on("pointerenter", () => engine.canvas.style.cursor = 'pointer');
        vestraCityLabel.on("pointerleave", () => engine.canvas.style.cursor = 'default');

        // --- KLIK LOGICA ---
        southreachLabel.on("pointerdown", () => this.handleClick("southreach"));
        ironvaleLabel.on("pointerdown", () => this.handleClick("ironvale"));
        ironvaleFactoryLabel.on("pointerdown", () => this.handleClick("ironvalefactory"));
        eastwatchLabel.on("pointerdown", () => this.handleClick("eastwatch"));
        vestraCityLabel.on("pointerdown", () => this.handleClick("roadtosquare"));
    }

    handleClick(scene) {
        this.engine.canvas.style.cursor = 'default';
        this.engine.goToScene(scene);
    }
}