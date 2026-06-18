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
        // 1. Eerst maken we een test-sprite om de juiste wiskunde te doen
        const tempSprite = this.imageSource.toSprite()
        
        // Bereken hoeveel we het plaatje moeten opblazen om je 720p scherm te vullen
        const scaleFactor = engine.drawHeight / tempSprite.height
        
        // Nu we de schaal weten, berekenen we hoe breed 1 plaatje daadwerkelijk op je scherm is
        const realWidth = tempSprite.width * scaleFactor

        const graphics = []
        
        // 2. We starten op -2 (iets links van je level) en gaan door tot 15.
        // Zo hebben we ruim genoeg achtergrond voor het hele parcours!
        for (let i = -2; i < 15; i++) { 
            // Maak een gloednieuwe sprite voor elk stukje
            const sprite = this.imageSource.toSprite()
            
            // Blaas de sprite zélf op in plaats van de Actor
            sprite.scale = new Vector(scaleFactor, scaleFactor)
            
            graphics.push({
                graphic: sprite,
                // Schuif hem exact zijn 'nieuwe' opgeschaalde breedte op
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