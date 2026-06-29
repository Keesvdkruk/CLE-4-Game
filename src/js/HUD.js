import { ScreenElement, Label, Font, FontUnit, Color, Vector } from 'excalibur';
import { StatBar } from './StatBar.js'; 
import { GameState } from './state.js'; 

export class HUD extends ScreenElement {
    constructor() {
        super({
            x: 30,
            y: 40, 
            z: 9999 
        });
    }

    onInitialize(engine) {
        // --- PEACE METER ---
        this.peaceLabel = new Label({
            text: "Peace",
            color: Color.White,
            font: new Font({ family: 'MijnPixelFont', size: 15, unit: FontUnit.Px }),
            x: 0, 
            y: 0 
        });
        this.peaceLabel.scale = new Vector(2, 2);
        this.addChild(this.peaceLabel);

        this.peaceBar = new StatBar(0, 45, 0, 100);
        this.addChild(this.peaceBar);


        // --- SUPPORT METER ---
        this.supportLabel = new Label({
            text: "Support",
            color: Color.White,
            font: new Font({ family: 'MijnPixelFont', size: 15, unit: FontUnit.Px }),
            x: 0, 
            y: 110
        });
        this.supportLabel.scale = new Vector(2, 2);
        this.addChild(this.supportLabel);

        this.supportBar = new StatBar(0, 155, 3, 20);
        this.addChild(this.supportBar);
    }

    onPreUpdate(engine, delta) {
        if (this.peaceBar) {
            this.peaceBar.updateValue(GameState.peace);
        }
        
        if (this.supportBar) {
            this.supportBar.updateValue(GameState.support);
        }
    }
}