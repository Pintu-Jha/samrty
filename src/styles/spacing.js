import { Dimensions } from 'react-native';
import {
  moderateScale,
  moderateScaleVertical,
  scale,
  verticalScale,
} from './responsiveStyles';

const {height, width} = Dimensions.get('window');
const {screenHeight, screenWidth} = Dimensions.get('screen');

export const spacing = {
  PADDING_2: moderateScale(2),
  PADDING_4: moderateScale(4),
  PADDING_5: moderateScale(5),
  PADDING_6: moderateScale(6),
  PADDING_8: moderateScale(8),
  PADDING_9: moderateScale(9),
  PADDING_VERTICAL_8: moderateScaleVertical(8),
  PADDING_10: moderateScale(10),
  PADDING_12: moderateScale(12),
  PADDING_14: moderateScale(14),
  PADDING_16: moderateScale(16),
  PADDING_18: moderateScale(18),
  PADDING_20: moderateScale(20),
  PADDING_22: moderateScale(22),
  PADDING_24: moderateScale(24),
  PADDING_28: moderateScale(28),
  PADDING_30: moderateScale(30),
  PADDING_32: moderateScale(32),
  PADDING_36: moderateScale(36),
  PADDING_44: moderateScale(44),
  PADDING_40: moderateScale(40),
  PADDING_48: moderateScale(48),
  PADDING_54: moderateScale(54),
  PADDING_68: moderateScale(68),
  PADDING_72: moderateScale(72),
  PADDING_80: moderateScale(80),
  PADDING_82: moderateScale(82),
  PADDING_120: moderateScale(120),

  HEIGHT_700: verticalScale(700),
  HEIGHT_420: verticalScale(420),
  HEIGHT_400: verticalScale(400),
  HEIGHT_380: verticalScale(380),
  HEIGHT_370: verticalScale(370),
  HEIGHT_350: verticalScale(350),
  HEIGHT_320: verticalScale(320),
  HEIGHT_300: verticalScale(300),
  HEIGHT_280: verticalScale(280),
  HEIGHT_240: verticalScale(240),
  HEIGHT_230: verticalScale(230),
  HEIGHT_226: verticalScale(226),
  HEIGHT_216: verticalScale(216),
  HEIGHT_196: verticalScale(196),
  HEIGHT_192: verticalScale(192),
  HEIGHT_182: verticalScale(182),
  HEIGHT_180: verticalScale(180),
  HEIGHT_178: verticalScale(178),
  HEIGHT_160: verticalScale(160),
  HEIGHT_136: verticalScale(136),
  HEIGHT_150: verticalScale(150),
  HEIGHT_110: verticalScale(110),
  HEIGHT_128: verticalScale(128),
  HEIGHT_105: verticalScale(105),
  HEIGHT_90: verticalScale(90),
  HEIGHT_88: verticalScale(88),
  HEIGHT_84: verticalScale(84),
  HEIGHT_82: verticalScale(82),
  HEIGHT_80: verticalScale(80),
  HEIGHT_78: verticalScale(78),
  HEIGHT_74: verticalScale(74),
  HEIGHT_72: verticalScale(72),
  HEIGHT_70: verticalScale(70),
  HEIGHT_68: verticalScale(68),
  HEIGHT_60: verticalScale(60),
  HEIGHT_56: verticalScale(56),
  HEIGHT_54: verticalScale(54),
  HEIGHT_52: verticalScale(52),
  HEIGHT_50: verticalScale(50),
  HEIGHT_40: verticalScale(40),
  HEIGHT_42: verticalScale(42),
  HEIGHT_44: verticalScale(44),
  HEIGHT_46: verticalScale(46),
  HEIGHT_48: verticalScale(48),
  HEIGHT_38: verticalScale(38),
  HEIGHT_36: verticalScale(36),
  HEIGHT_32: verticalScale(32),
  HEIGHT_30: verticalScale(30),
  HEIGHT_34: verticalScale(34),
  HEIGHT_28: verticalScale(28),
  HEIGHT_24: verticalScale(24),
  HEIGHT_22: verticalScale(22),
  HEIGHT_20: verticalScale(20),
  HEIGHT_18: verticalScale(18),
  HEIGHT_16: verticalScale(16),
  HEIGHT_14: verticalScale(14),
  HEIGHT_12: verticalScale(12),
  HEIGHT_10: verticalScale(10),
  HEIGHT_8: verticalScale(8),
  HEIGHT_6: verticalScale(6),
  HEIGHT_4: verticalScale(4),
  HEIGHT_2: verticalScale(2),
  HEIGHT_1: verticalScale(1),
  BUTTON_HEIGHT: moderateScaleVertical(48),
  FULL_HEIGHT: height,
  FULL_SCREEN_HEIGHT: screenHeight,

  FULL_WIDTH: width,
  FULL_SCREEN_WIDTH: screenWidth,
  WIDTH_1: scale(1),
  WIDTH_2: scale(2),
  WIDTH_4: scale(4),
  WIDTH_5: scale(5),
  WIDTH_6: scale(6),
  WIDTH_8: scale(8),
  WIDTH_10: scale(10),
  WIDTH_12: scale(12),
  WIDTH_14: scale(14),
  WIDTH_16: scale(16),
  WIDTH_18: scale(18),
  WIDTH_20: scale(20),
  WIDTH_22: scale(22),
  WIDTH_24: scale(24),
  WIDTH_28: scale(28),
  WIDTH_32: scale(32),
  WIDTH_36: scale(36),
  WIDTH_40: scale(40),
  WIDTH_42: scale(42),
  WIDTH_46: scale(46),
  WIDTH_48: scale(48),
  WIDTH_30: scale(30),
  WIDTH_34: scale(34),
  WIDTH_50: scale(50),
  WIDTH_56: scale(56),
  WIDTH_60: scale(60),
  WIDTH_62: scale(62),
  WIDTH_64: scale(64),
  WIDTH_68: scale(68),
  WIDTH_70: scale(70),
  WIDTH_74: scale(74),
  WIDTH_78: scale(78),
  WIDTH_80: scale(80),
  WIDTH_84: scale(84),
  WIDTH_88: scale(88),
  WIDTH_90: scale(90),
  WIDTH_105: scale(105),
  WIDTH_116: scale(116),
  WIDTH_124: scale(124),
  WIDTH_156: scale(156),
  WIDTH_160: scale(160),
  WIDTH_164: scale(164),
  WIDTH_184: scale(184),
  WIDTH_196: scale(196),
  WIDTH_200: scale(200),
  WIDTH_240: scale(240),
  WIDTH_245: scale(245),
  WIDTH_250: scale(250),
  WIDTH_260: scale(260),
  WIDTH_296: scale(296),
  WIDTH_312: scale(312),
  WIDTH_328: scale(328),
  WIDTH_344: scale(344),

  RADIUS_1: moderateScale(1),
  RADIUS_2: moderateScale(2),
  RADIUS_4: moderateScale(4),
  RADIUS_6: moderateScale(6),
  RADIUS_8: moderateScale(8),
  RADIUS_10: moderateScale(10),
  RADIUS_12: moderateScale(12),
  RADIUS_16: moderateScale(16),
  RADIUS_20: moderateScale(20),
  RADIUS_24: moderateScale(24),
  RADIUS_30: moderateScale(30),
  RADIUS_32: moderateScale(32),
  RADIUS_34: moderateScale(34),
  RADIUS_38: moderateScale(38),
  RADIUS_40: moderateScale(40),
  RADIUS_50: moderateScale(50),
  RADIUS_60: moderateScale(60),
  RADIUS_70: moderateScale(70),
  RADIUS_82: moderateScale(82),
  RADIUS_90: moderateScale(90),
  RADIUS_100: moderateScale(100),
  RADIUS_120: moderateScale(120),
  RADIUS_140: moderateScale(140),
  RADIUS_150: moderateScale(150),
  RADIUS_196: moderateScale(196),

  MARGIN_2: moderateScale(2),
  MARGIN_4: moderateScale(4),
  MARGIN_6: moderateScale(6),
  MARGIN_8: moderateScale(8),
  MARGIN_10: moderateScale(10),
  MARGIN_12: moderateScale(12),
  MARGIN_14: moderateScale(14),
  MARGIN_16: moderateScale(16),
  MARGIN_18: moderateScale(18),
  MARGIN_20: moderateScale(20),
  MARGIN_22: moderateScale(22),
  MARGIN_24: moderateScale(24),
  MARGIN_26: moderateScale(26),
  MARGIN_28: moderateScale(28),
  MARGIN_30: moderateScale(30),
  MARGIN_36: moderateScale(36),
  MARGIN_32: moderateScale(32),
  MARGIN_34: moderateScale(34),
  MARGIN_40: moderateScale(40),
  MARGIN_44: moderateScale(44),
  MARGIN_48: moderateScale(48),
  MARGIN_50: moderateScale(50),
  MARGIN_60: moderateScale(60),
  MARGIN_65: moderateScale(65),
  MARGIN_72: moderateScale(72),
  MARGIN_78: moderateScale(78),
  MARGIN_84: moderateScale(84),
  MARGIN_90: moderateScale(90),
  MARGIN_100: moderateScale(100),
  MARGIN_112: moderateScale(112),
  MARGIN_320: moderateScale(320),
  MARGIN_400: moderateScale(400),
  MARGIN_420: moderateScale(420),
  MARGIN_450: moderateScale(450),
  MARGIN_460: moderateScale(460),
  MARGIN_480: moderateScale(480),
};
