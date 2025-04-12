
import { Dimensions } from 'react-native';

export const size = Dimensions.get('screen').width

export function boxShadow(
    color,
    offset = { height: 6, width: 0 },
    radius = 5,
    opacity = 1,
) {
    return {
        shadowColor: color,
        shadowOffset: offset,
        shadowOpacity: opacity,
        shadowRadius: radius,
        elevation: radius,
    };
}

export function boxShadowLess(
    color,
    offset = { height: 6, width: 0 },
    radius = 3,
    opacity = 0.21,
) {
    return {
        shadowColor: color,
        shadowOffset: offset,
        shadowOpacity: opacity,
        shadowRadius: radius,
        elevation: radius,
    };
}


export function boxShadowTwo(
    color = '#0000',
    offset = { height: 6, width: 0 },
    radius = 2,
    opacity = 0.2,
) {
    return {
        shadowColor: color,
        shadowOffset: offset,
        shadowOpacity: opacity,
        shadowRadius: radius,
        elevation: radius,
    };
}
export function boxShadowZero(
    color,
    offset = { height: 0, width: 0 },
    radius = 0,
    opacity = 0,
) {
    return {
        shadowColor: color,
        shadowOffset: offset,
        shadowOpacity: opacity,
        shadowRadius: radius,
        elevation: radius,
    };
}