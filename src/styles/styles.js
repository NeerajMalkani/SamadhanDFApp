import { StyleSheet } from "react-native";
import { theme } from "../theme/apptheme";

export const Styles = StyleSheet.create({
  /* #region Colors */
  primaryColor: {
    color: theme.colors.primary,
  },
  primaryLightColor: {
    color: theme.colors.primary2,
  },
  secondaryColor: {
    color: theme.colors.secondary,
  },
  accentColor: {
    color: theme.colors.accent,
  },

  textColor: {
    color: theme.colors.text,
  },
  textSecondaryColor: {
    color: theme.colors.textSecondary,
  },
  textTertiaryColor: {
    color: theme.colors.textLightSecondary,
  },
  textColorWhite: {
    color: theme.colors.textLight,
  },

  backgroundColor: {
    backgroundColor: theme.colors.textLight,
  },
  backgroundSecondaryColor: {
    backgroundColor: theme.colors.backgroundSecondary,
  },

  redColor: {
    color: theme.colors.red,
  },
  greenColor: {
    color: theme.colors.green,
  },
  yellowColor: {
    color: theme.colors.yellow,
  },
  blueColor: {
    color: theme.colors.blue,
  },

  primaryBgColor: {
    backgroundColor: theme.colors.primary,
  },
  primaryLightBgColor: {
    backgroundColor: theme.colors.primary2,
  },
  secondaryBgColor: {
    backgroundColor: theme.colors.secondary,
  },
  accentBgColor: {
    backgroundColor: theme.colors.accent,
  },

  redBgColor: {
    backgroundColor: theme.multicolors.red,
  },
  greenBgColor: {
    backgroundColor: theme.multicolors.green,
  },
  yellowBgColor: {
    backgroundColor: theme.multicolors.yellow,
  },
  blueBgColor: {
    backgroundColor: theme.multicolors.blue,
  },
  /* #endregion */

  /* #region Borders */
  border0: {
    borderWidth: 0,
  },
  border1: {
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  border2: {
    borderWidth: 2,
    borderColor: theme.colors.border,
  },
  border4: {
    borderWidth: 4,
    borderColor: theme.colors.border,
  },

  borderBottom0: {
    borderBottomWidth: 0,
  },
  borderBottom1: {
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  borderBottom2: {
    borderBottomWidth: 2,
    borderBottomColor: theme.colors.border,
  },
  borderBottom4: {
    borderBottomWidth: 4,
    borderBottomColor: theme.colors.border,
  },

  borderTop0: {
    borderTopWidth: 0,
  },
  borderTop1: {
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
  borderTop2: {
    borderTopWidth: 2,
    borderTopColor: theme.colors.border,
  },
  borderTop4: {
    borderTopWidth: 4,
    borderTopColor: theme.colors.border,
  },

  borderLeft0: {
    borderLeftWidth: 0,
  },
  borderLeft1: {
    borderLeftWidth: 1,
    borderLeftColor: theme.colors.border,
  },
  borderLeft2: {
    borderLeftWidth: 2,
    borderLeftColor: theme.colors.border,
  },
  borderLeft4: {
    borderLeftWidth: 4,
    borderLeftColor: theme.colors.border,
  },

  borderRight0: {
    borderRightWidth: 0,
  },
  borderRight1: {
    borderRightWidth: 1,
    borderLeftColor: theme.colors.border,
  },
  borderLeft2: {
    borderRightWidth: 2,
    borderRightColor: theme.colors.border,
  },
  borderRight4: {
    borderRightWidth: 4,
    borderRightColor: theme.colors.border,
  },

  borderRadius0: {
    borderRadius: 0,
  },
  borderRadius1: {
    borderRadius: 1,
  },
  borderRadius2: {
    borderRadius: 2,
  },
  borderRadius4: {
    borderRadius: 4,
  },
  borderRadius8: {
    borderRadius: 8,
  },
  borderRadius16: {
    borderRadius: 16,
  },
  borderRadius32: {
    borderRadius: 32,
  },
  borderRadius64: {
    borderRadius: 64,
  },

  borderBottomRadius0: {
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
  },
  borderBottomRadius1: {
    borderBottomLeftRadius: 1,
    borderBottomRightRadius: 1,
  },
  borderBottomRadius2: {
    borderBottomLeftRadius: 2,
    borderBottomRightRadius: 2,
  },
  borderBottomRadius4: {
    borderBottomLeftRadius: 4,
    borderBottomRightRadius: 4,
  },
  borderBottomRadius8: {
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
  },
  borderBottomRadius16: {
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
  },
  borderBottomRadius32: {
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
  },
  borderBottomRadius64: {
    borderBottomLeftRadius: 64,
    borderBottomRightRadius: 64,
  },

  borderTopRadius0: {
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
  },
  borderTopRadius1: {
    borderTopLeftRadius: 1,
    borderTopRightRadius: 1,
  },
  borderTopRadius2: {
    borderTopLeftRadius: 2,
    borderTopRightRadius: 2,
  },
  borderTopRadius4: {
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
  },
  borderTopRadius8: {
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  borderTopRadius16: {
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  borderTopRadius32: {
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
  },
  borderTopRadius64: {
    borderTopLeftRadius: 64,
    borderTopRightRadius: 64,
  },
  /* #endregion */

  /* #region Padding */
  padding0: {
    padding: 0,
  },
  padding2: {
    padding: 2,
  },
  padding4: {
    padding: 4,
  },
  padding8: {
    padding: 8,
  },
  padding12: {
    padding: 12,
  },
  padding16: {
    padding: 16,
  },

  paddingTop0: {
    paddingTop: 0,
  },
  paddingBottom0: {
    paddingBottom: 0,
  },
  paddingStart0: {
    paddingStart: 0,
  },
  paddingEnd0: {
    paddingEnd: 0,
  },

  paddingTop2: {
    paddingTop: 2,
  },
  paddingBottom4: {
    paddingBottom: 2,
  },
  paddingStart12: {
    paddingStart: 2,
  },
  paddingEnd2: {
    paddingEnd: 2,
  },

  paddingTop4: {
    paddingTop: 4,
  },
  paddingBottom4: {
    paddingBottom: 4,
  },
  paddingStart4: {
    paddingStart: 4,
  },
  paddingEnd4: {
    paddingEnd: 4,
  },

  paddingTop8: {
    paddingTop: 8,
  },
  paddingBottom8: {
    paddingBottom: 8,
  },
  paddingStart8: {
    paddingStart: 8,
  },
  paddingEnd8: {
    paddingEnd: 8,
  },

  paddingTop12: {
    paddingTop: 12,
  },
  paddingBottom12: {
    paddingBottom: 12,
  },
  paddingStart12: {
    paddingStart: 12,
  },
  paddingEnd12: {
    paddingEnd: 12,
  },

  paddingTop16: {
    paddingTop: 16,
  },
  paddingBottom16: {
    paddingBottom: 16,
  },
  paddingStart16: {
    paddingStart: 16,
  },
  paddingEnd16: {
    paddingEnd: 16,
  },

  paddingVertical0: {
    paddingVertical: 0,
  },
  paddingVertical2: {
    paddingVertical: 2,
  },
  paddingVertical4: {
    paddingVertical: 4,
  },
  paddingVertical8: {
    paddingVertical: 8,
  },
  paddingVertical12: {
    paddingVertical: 12,
  },
  paddingVertical16: {
    paddingVertical: 16,
  },

  paddingHorizontal0: {
    paddingHorizontal: 0,
  },
  paddingHorizontal2: {
    paddingHorizontal: 2,
  },
  paddingHorizontal4: {
    paddingHorizontal: 4,
  },
  paddingHorizontal8: {
    paddingHorizontal: 8,
  },
  paddingHorizontal12: {
    paddingHorizontal: 12,
  },
  paddingHorizontal16: {
    paddingHorizontal: 16,
  },
  /* #endregion */

  /* #region Margin */
  margin0: {
    margin: 0,
  },
  margin2: {
    margin: 2,
  },
  margin4: {
    margin: 4,
  },
  margin8: {
    margin: 8,
  },
  margin12: {
    margin: 12,
  },
  margin16: {
    margin: 16,
  },

  marginTop0: {
    marginTop: 0,
  },
  marginBottom0: {
    marginBottom: 0,
  },
  marginStart0: {
    marginStart: 0,
  },
  marginEnd0: {
    marginEnd: 0,
  },

  marginTop2: {
    marginTop: 2,
  },
  marginBottom2: {
    marginBottom: 2,
  },
  marginStart2: {
    marginStart: 2,
  },
  marginEnd2: {
    marginEnd: 2,
  },

  marginTop4: {
    marginTop: 4,
  },
  marginBottom4: {
    marginBottom: 4,
  },
  marginStart4: {
    marginStart: 4,
  },
  marginEnd4: {
    marginEnd: 4,
  },

  marginTop8: {
    marginTop: 8,
  },
  marginBottom8: {
    marginBottom: 8,
  },
  marginStart8: {
    marginStart: 8,
  },
  marginEnd8: {
    marginEnd: 8,
  },

  marginTop12: {
    marginTop: 12,
  },
  marginBottom12: {
    marginBottom: 12,
  },
  marginStart12: {
    marginStart: 12,
  },
  marginEnd12: {
    marginEnd: 12,
  },

  marginTop16: {
    marginTop: 16,
  },
  marginBottom16: {
    marginBottom: 16,
  },
  marginStart16: {
    marginStart: 16,
  },
  marginEnd16: {
    marginEnd: 16,
  },

  marginVertical0: {
    marginVertical: 0,
  },
  marginVertical2: {
    marginVertical: 2,
  },
  marginVertical4: {
    marginVertical: 4,
  },
  marginVertical8: {
    marginVertical: 8,
  },
  marginVertical12: {
    marginVertical: 12,
  },
  marginVertical16: {
    marginVertical: 16,
  },

  marginHorizontal0: {
    marginHorizontal: 0,
  },
  marginHorizontal2: {
    marginHorizontal: 2,
  },
  marginHorizontal4: {
    marginHorizontal: 4,
  },
  marginHorizontal8: {
    marginHorizontal: 8,
  },
  marginHorizontal12: {
    marginHorizontal: 12,
  },
  marginHorizontal16: {
    marginHorizontal: 16,
  },
  /* #endregion */

  /* #region Flex */
  flex1: {
    flex: 1,
  },
  flex2: {
    flex: 2,
  },
  flex3: {
    flex: 3,
  },
  flex4: {
    flex: 4,
  },
  flex5: {
    flex: 5,
  },
  flex6: {
    flex: 6,
  },
  flex7: {
    flex: 7,
  },
  flex8: {
    flex: 8,
  },
  flex9: {
    flex: 9,
  },
  flex10: {
    flex: 10,
  },
  flexRow: {
    flexDirection: "row",
  },
  flexColumn: {
    flexDirection: "column",
  },
  flexRowReverse: {
    flexDirection: "row-reverse",
  },

  flexColumnReverse: {
    flexDirection: "column-reverse",
  },
  flexGrow: {
    flexGrow: 1,
  },
  flexWrap: {
    flexWrap: "wrap",
  },
  flexWrapReverse: {
    flexWrap: "wrap-reverse",
  },

  flexAlignStart: {
    alignItems: "flex-start",
  },
  flexAlignCenter: {
    alignItems: "center",
  },
  flexAlignEnd: {
    alignItems: "flex-end",
  },

  flexJustifyStart: {
    justifyContent: "flex-start",
  },
  flexJustifyCenter: {
    justifyContent: "center",
  },
  flexJustifyEnd: {
    justifyContent: "flex-end",
  },

  flexAlignSelfStart: {
    alignSelf: "flex-start",
  },
  flexAlignSelfCenter: {
    alignSelf: "center",
  },
  flexAlignSelfEnd: {
    alignSelf: "flex-end",
  },
  /* #endregion */

  /* #region Fonts */
  fontSize8: {
    fontSize: 8,
  },
  fontSize10: {
    fontSize: 10,
  },
  fontSize11: {
    fontSize: 11,
  },
  fontSize12: {
    fontSize: 12,
  },
  fontSize14: {
    fontSize: 14,
  },
  fontSize16: {
    fontSize: 16,
  },
  fontSize18: {
    fontSize: 18,
  },
  fontSize20: {
    fontSize: 20,
  },
  fontSize24: {
    fontSize: 24,
  },
  fontBold: {
    fontWeight: "bold",
  },
  fontRegular: {
    fontWeight: "normal",
  },
  /* #endregion */

  /* #region Width/Height */
  width24: {
    width: 24,
  },
  width32: {
    width: 32,
  },
  width40: {
    width: 40,
  },
  width48: {
    width: 48,
  },
  width56: {
    width: 56,
  },
  width64: {
    width: 64,
  },
  width50per: {
    width: "50%",
  },
  width100per: {
    width: "100%",
  },

  height24: {
    height: 24,
  },
  height32: {
    height: 32,
  },
  height40: {
    height: 40,
  },
  height48: {
    height: 48,
  },
  height56: {
    height: 56,
  },
  height64: {
    height: 64,
  },
  height50per: {
    height: "50%",
  },
  height100per: {
    height: "100%",
  },
  /* #endregion */

  /* #region Text */
  textLeft: {
    textAlign: "left",
  },
  textCenter: {
    textAlign: "center",
  },
  textRight: {
    textAlign: "right",
  },
  /* #endregion */
});
