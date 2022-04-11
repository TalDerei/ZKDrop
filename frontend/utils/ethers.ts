/** BigNumber to hex string of specified length */
export function toFixedHex(number: number | string, length = 32) {
  const str = BigInt(number).toString(16);
  return "0x" + str.padStart(length * 2, "0");
}