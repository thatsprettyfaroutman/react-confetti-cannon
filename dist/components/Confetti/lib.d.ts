import { TLaunchPoint, IParticle } from './types';
import { Vector2 } from './Vector2';
export declare const uid: () => number;
export declare const createNewParticle: (launchPoint: TLaunchPoint, palette: string[]) => {
    id: number;
    width: number;
    height: number;
    rotation: number;
    rotationVelocity: number;
    position: Vector2;
    velocity: Vector2;
    friction: number;
    color: string;
};
export declare const drawParticle: (ctx: CanvasRenderingContext2D, particle: IParticle) => void;
