export interface TilesSessionType {
    asset:              Asset;
    geometricError:     number;
    root:               Root;
    extensionsUsed:     string[];
    extensionsRequired: string[];
}

export interface Asset {
    version: string;
}

export interface Root {
    boundingVolume: BoundingVolume;
    geometricError: number;
    refine:         Refine;
    children:       RootChild[];
    extras:         Extras;
}

export interface BoundingVolume {
    box: number[];
}

export interface RootChild {
    boundingVolume: BoundingVolume;
    geometricError: number;
    refine:         Refine;
    children:       PurpleChild[];
    extras:         Extras;
}

export interface PurpleChild {
    boundingVolume: BoundingVolume;
    geometricError: number;
    refine:         Refine;
    content:        Content;
    children:       FluffyChild[];
    extras:         Extras;
}

export interface FluffyChild {
    boundingVolume: BoundingVolume;
    geometricError: number;
    refine:         Refine;
    content:        Content;
    children:       TentacledChild[];
    extras:         Extras;
}

export interface TentacledChild {
    boundingVolume: BoundingVolume;
    geometricError: number;
    refine:         Refine;
    content:        Content;
    children:       StickyChild[];
    extras:         Extras;
}

export interface StickyChild {
    boundingVolume: BoundingVolume;
    geometricError: number;
    content:        Content;
}

export interface Content {
    uri: string;
}

export interface Extras {
    comment: string;
}

export enum Refine {
    Replace = "REPLACE",
}
