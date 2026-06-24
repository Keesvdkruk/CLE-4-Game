import { ImageSource, Loader } from 'excalibur'

export const Resources = {
    Idle: new ImageSource('/images/Idle.png'),
    Walk: new ImageSource('/images/Walk.png'),
    Jump: new ImageSource('/images/Jump.png'),
    Attack: new ImageSource('/images/Attack_1.png'),

    VestraCity: new ImageSource('/images/vestracity.png'),
    VestraGate: new ImageSource('/images/vestragate.png'),
    GuardVision: new ImageSource('/images/guardvision.png'),
    GameOver: new ImageSource('/images/gameover.png'),

    Keycard: new ImageSource('/images/keycard.png'),
    VestraInside: new ImageSource('/images/vestrainside.png'),
    VestraInsideOpen: new ImageSource('/images/vestrainside_open.png'),

    ProtestantWalk: new ImageSource('/images/protestant_walk.png'),
    SpeechBubble: new ImageSource("/images/speechbubble.png"),
    CityRoad: new ImageSource('/images/CityRoad.png'),
    CityRoad_2: new ImageSource('/images/CityRoad_2.png'),
    CityRoad_3: new ImageSource('/images/CityRoad_3.png'),
    Bullet: new ImageSource('/images/bullet.png'),
   SquareBackground: new ImageSource("/images/square_background.png"),
   SquareBroken: new ImageSource("/images/Square_Broken.png"),
}

export const ResourceLoader = new Loader(Object.values(Resources))