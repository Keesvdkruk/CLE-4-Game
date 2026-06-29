import { ScreenElement, Vector } from 'excalibur';
import { UiSpriteSheet } from './resources.js';

export class StatBar extends ScreenElement {
    constructor(x, y, row, maxValue) {
        super({
            x: x,
            y: y,
            anchor: new Vector(0, 0.5),
            z: 9999 
        });

        this.maxValue = maxValue;
        
        this.scale = new Vector(2.5, 2.5);
        
        this.frames = [
            UiSpriteSheet.getSprite(4, row), 
            UiSpriteSheet.getSprite(3, row), 
            UiSpriteSheet.getSprite(2, row), 
            UiSpriteSheet.getSprite(1, row), 
            UiSpriteSheet.getSprite(0, row)  
        ];
        
        this.graphics.use(this.frames[4]); 
    }

    updateValue(currentValue) {
        const percent = Math.max(0, Math.min(currentValue / this.maxValue, 1));
        
        let frameIndex = 0;
        if (percent > 0.8) {
            frameIndex = 4;
        } else if (percent > 0.6) {
            frameIndex = 3;
        } else if (percent > 0.4) {
            frameIndex = 2;
        } else if (percent > 0.1) {
            frameIndex = 1;
        } else {
            frameIndex = 0;
        }

        this.graphics.use(this.frames[frameIndex]);
    }
}