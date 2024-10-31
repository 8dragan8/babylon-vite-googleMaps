import * as THREE from 'three';
export default class ThreeObject {

    threeMesh: THREE.Mesh | THREE.Group
    minWGS84: number[] = []
    maxWGS84: number[] = []
    constructor( threeMesh: THREE.Mesh | THREE.Group, minWGS84: number[], maxWGS84: number[]) {
        this.threeMesh = threeMesh
        this.minWGS84 = minWGS84
        this.maxWGS84 = maxWGS84
    }
}