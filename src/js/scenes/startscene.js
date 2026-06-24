import { Color, Scene, Label, Font, Actor, Rectangle } from "excalibur";
import { Game } from "../game";


export class StartScene extends Scene {
    /**
     * 
     * @param {Game} engine 
     */
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
            x: engine.drawWidth / 2 - 160,
            y: engine.drawHeight / 4,
            text: "State of Venstra",
            font: new Font({
                size: 75
            })
        });
        this.add(settingsLabel);

        const levelOneLabel = new Label({
            color: Color.White,
            x: engine.drawWidth / 2 - 100,
            y: engine.drawHeight / 2 + 50,
            text: "level 1",
            font: new Font({
                size: 75
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
            this.engine.goToScene("square");
        });
        this.add(levelOneLabel);

        levelOneLabel.on("pointerdown", () => this.handleClick());
    }

    handleClick() {
        this.engine.goToScene("levelone");
    }
}
