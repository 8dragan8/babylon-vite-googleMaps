export default function multiplyMatrixes(mat1: any, mat2: Float64Array, result: any): number[] {
  const m = mat1
  const otherM = mat2
  const offset = 0

  const tm0 = m[0]
  const tm1 = m[1]
  const tm2 = m[2]
  const tm3 = m[3]
  const tm4 = m[4]
  const tm5 = m[5]
  const tm6 = m[6]
  const tm7 = m[7]
  const tm8 = m[8]
  const tm9 = m[9]
  const tm10 = m[10]
  const tm11 = m[11]
  const tm12 = m[12]
  const tm13 = m[13]
  const tm14 = m[14]
  const tm15 = m[15]
  const om0 = otherM[0]
  const om1 = otherM[1]
  const om2 = otherM[2]
  const om3 = otherM[3]
  const om4 = otherM[4]
  const om5 = otherM[5]
  const om6 = otherM[6]
  const om7 = otherM[7]
  const om8 = otherM[8]
  const om9 = otherM[9]
  const om10 = otherM[10]
  const om11 = otherM[11]
  const om12 = otherM[12]
  const om13 = otherM[13]
  const om14 = otherM[14]
  const om15 = otherM[15]

  result[offset] = tm0 * om0 + tm1 * om4 + tm2 * om8 + tm3 * om12
  result[offset + 1] = tm0 * om1 + tm1 * om5 + tm2 * om9 + tm3 * om13
  result[offset + 2] = tm0 * om2 + tm1 * om6 + tm2 * om10 + tm3 * om14
  result[offset + 3] = tm0 * om3 + tm1 * om7 + tm2 * om11 + tm3 * om15

  result[offset + 4] = tm4 * om0 + tm5 * om4 + tm6 * om8 + tm7 * om12
  result[offset + 5] = tm4 * om1 + tm5 * om5 + tm6 * om9 + tm7 * om13
  result[offset + 6] = tm4 * om2 + tm5 * om6 + tm6 * om10 + tm7 * om14
  result[offset + 7] = tm4 * om3 + tm5 * om7 + tm6 * om11 + tm7 * om15

  result[offset + 8] = tm8 * om0 + tm9 * om4 + tm10 * om8 + tm11 * om12
  result[offset + 9] = tm8 * om1 + tm9 * om5 + tm10 * om9 + tm11 * om13
  result[offset + 10] = tm8 * om2 + tm9 * om6 + tm10 * om10 + tm11 * om14
  result[offset + 11] = tm8 * om3 + tm9 * om7 + tm10 * om11 + tm11 * om15

  result[offset + 12] = tm12 * om0 + tm13 * om4 + tm14 * om8 + tm15 * om12
  result[offset + 13] = tm12 * om1 + tm13 * om5 + tm14 * om9 + tm15 * om13
  result[offset + 14] = tm12 * om2 + tm13 * om6 + tm14 * om10 + tm15 * om14
  result[offset + 15] = tm12 * om3 + tm13 * om7 + tm14 * om11 + tm15 * om15
  return result
}
