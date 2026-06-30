import { ScreenElement, Color, Label, Font, FontUnit } from "excalibur";

export class MenuButton extends ScreenElement {

    constructor() {
        super({
            x: 1225,
            y: 35,
            z: 10000
        });
    }

    onInitialize(engine) {

        this.button = new Label({
            text: "☰",
            color: Color.White,
            font: new Font({
                family: "MijnPixelFont",
                size: 32,
                unit: FontUnit.Px
            })
        });

        this.addChild(this.button);

        this.button.on("pointerenter", () => {
            engine.canvas.style.cursor = "pointer";
            this.button.color = Color.Yellow;
        });

        this.button.on("pointerleave", () => {
            engine.canvas.style.cursor = "default";
            this.button.color = Color.White;
        });

        this.button.on("pointerdown", () => {
            engine.canvas.style.cursor = "default";
            engine.goToScene("menu");
        });
    }
}