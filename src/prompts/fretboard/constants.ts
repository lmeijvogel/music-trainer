export const stringDistance = 14;
export const fullScaleLength = 800;
export const octavePosition = fullScaleLength / 2;

export const displayedFretCount = 12;

export const paddingTop = 10;
export const paddingLeft = 40;

export const fretMarkerDistance = 6;
export const fretMarkerRadius = 1.2;

export const strings = ["E5", "B4", "G4", "D4", "A3", "E3"];
const fretPadding = 1;
export const fretTop = paddingTop - fretPadding;

export const fretBottom = (strings.length - 1) * stringDistance + paddingTop + fretPadding;

export const activeRectangleTop = paddingTop - stringDistance / 2;
export const activeRectangleBottom = paddingTop + (strings.length - 0.5) * stringDistance;


