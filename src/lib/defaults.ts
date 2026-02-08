import type { DotType, CornerSquareType, CornerDotType } from 'qr-code-styling';

export const QR_DEFAULTS = {
    url: '',
    size: 500,
    margin: 20,
    dotColor: '#000000',
    bgColor: 'transparent',
    dotType: 'rounded' as DotType,
    cornerType: 'extra-rounded' as CornerSquareType,
    cornerColor: '#000000',
    cornerDotType: 'dot' as CornerDotType
};