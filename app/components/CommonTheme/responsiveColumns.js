const fullWidth = 1170
const fullGutters = 30
const colWidth = 70

const [fw, fg, cw] = [fullWidth, fullGutters, colWidth]
export const responsiveCols = n => `${100 * (((n - 1) * fg + n * cw) / fw)}%`
export const fixedCols = n => `${(n - 1) * fg + n * cw}px`
