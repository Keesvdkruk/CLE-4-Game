// Voeg FontSource toe aan de import!
import { ImageSource, FontSource, Loader } from 'excalibur'

export const Resources = {
    Idle: new ImageSource('/images/Idle.png'),
    Walk: new ImageSource('/images/Walk.png'),
    Jump: new ImageSource('/images/Jump.png'),
    Attack: new ImageSource('/images/Attack_1.png'),
    
    Bg1: new ImageSource('/images/ironvale1.png'), 
    Bg2: new ImageSource('/images/ironvale2.png'),
    Bg3: new ImageSource('/images/ironvale3.png'),
    Bg4: new ImageSource('/images/ironvale4.png'),

    Factory2: new ImageSource('/images/factory2.png'),
    Factory3: new ImageSource('/images/factory3.png'),
    Factory4: new ImageSource('/images/factory4.png'),

    Platform: new ImageSource('/images/Platform.png'),
    
    IronvalePoster: new ImageSource('/images/ironvalePoster.png'),

    PixelFont: new FontSource('/fonts/pixel.ttf', 'MijnPixelFont') 
}

export const ResourceLoader = new Loader(Object.values(Resources))