export const MATERIAL_COLORS = ['red', 'pink', 'purple', 'deep-purple', 'indigo', 'blue', 'light-blue', 'cyan', 'teal', 'green', 'light-green', 'lime', 'yellow', 'amber', 'orange', 'deep-orange', 'brown', 'grey', 'blue-grey'];
export const MATERIAL_COLORS_DATA = require('../../../node_modules/material-colors/dist/colors.json');
const EXAMINATION_COLORS = [50, 100, 200, 300];
export const EXAMINATION_COLOR = (i: number) => EXAMINATION_COLORS[i % EXAMINATION_COLORS.length];
