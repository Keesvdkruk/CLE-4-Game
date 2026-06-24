import { Actor, Vector, ParallaxComponent, GraphicsGroup } from "excalibur"

export class Background extends Actor {
    constructor(imageSource, parallaxSpeed, zIndex) {
        super({
            x: 0,       
            y: -400,       
            z: zIndex,
            anchor: Vector.Zero 
        })
        
        this.imageSource = imageSource
        this.parallaxSpeed = parallaxSpeed
    }

    onInitialize(engine) {
        const tempSprite = this.imageSource.toSprite()

        const scaleFactor = engine.drawHeight / tempSprite.height
        
        const realWidth = tempSprite.width * scaleFactor

        const graphics = []
        
        for (let i = -2; i < 15; i++) { 

            const sprite = this.imageSource.toSprite()
            
            sprite.scale = new Vector(scaleFactor, scaleFactor)
            
            graphics.push({
                graphic: sprite,
                offset: new Vector(i * realWidth, 0) 
            })
        }

        const group = new GraphicsGroup({
            members: graphics
        })

        this.graphics.use(group)
        this.addComponent(new ParallaxComponent(new Vector(this.parallaxSpeed, 0)))
    }
}