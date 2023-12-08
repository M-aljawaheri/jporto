// ------------------------------------
// This provides a 2 dimensional array.
// Dimensions are x & y.
// Each cell is a string.
// It is implemented as a function object.
// Prototype functions: setValue, getValue.
// Example usage:
//   matrix = new Matrix();
//   matrix.setValue(3, 4, 1234);
//   const value = matrix.getValue(3, 4);
function Matrix() {
    this.getValue = (x: number, y: number): string => this[`${x}:${y}`];

    this.setValue = (x: number, y: number, value: string) => {
      this[`${x}:${y}`] = value;
    };
  }

  export default Matrix;