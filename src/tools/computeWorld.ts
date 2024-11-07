import { Matrix } from '@babylonjs/core'

export interface ModelTransformType {
  translateX: number
  translateY: number
  translateZ: number
  rotateX: number
  rotateY: number
  rotateZ: number
  scale: number
}

export default function computeWorld({ translateX, translateY, translateZ, rotateX, rotateY, rotateZ, scale }: ModelTransformType): Matrix {
  let world = Matrix.Identity().setTranslationFromFloats(translateX, translateY, translateZ)
  const scaleMatrix = Matrix.Scaling(scale, scale, scale)
  world = scaleMatrix.multiply(world)
  world = Matrix.RotationX(rotateX).multiply(world)
  world = Matrix.RotationY(rotateY).multiply(world)
  world = Matrix.RotationZ(rotateZ).multiply(world)
  return world
}
