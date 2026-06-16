import { ImageSource, Loader } from 'excalibur'

export const Resources = {
    Idle: new ImageSource('/images/Idle.png'),
    Walk: new ImageSource('/images/Walk.png'),
    Jump: new ImageSource('/images/Jump.png'),
    Attack: new ImageSource('/images/Attack_1.png')
}

export const ResourceLoader = new Loader(Object.values(Resources))