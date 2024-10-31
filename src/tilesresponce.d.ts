export interface TilesResponse {
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
    refine:         string;
    transform:      number[];
    children:       RootChild[];
}

export interface BoundingVolume {
    box: number[];
}

export interface RootChild {
    boundingVolume: BoundingVolume;
    geometricError: number;
    refine:         string;
    children:       ChildChild[];
    extras:         Extras;
}

export interface ChildChild {
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
