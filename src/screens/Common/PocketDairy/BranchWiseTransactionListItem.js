import React from "react";
import { View } from "react-native";
import { Text } from "react-native-paper";
import { Styles } from "../../../styles/styles";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { creds, projectVariables } from "../../../utils/credentials";
import { theme } from "../../../theme/apptheme";

export const BranchWiseTransactionListItem = ({ current, type }) => {

    return (
        <>
            <View style={[Styles.flexColumn, Styles.width100per, Styles.flex1]}>
                <View style={[Styles.width100per, Styles.height24, Styles.flexRow, Styles.flexAlignStart, Styles.borderBottom1, Styles.marginBottom2]}>
                    {current.item.verified_status == "1" ? (
                        <>
                            <Text style={[Styles.fontBold]}>Admin Verify Status</Text><Text style={[Styles.primaryColor, Styles.fontBold, Styles.backgroundSecondaryColor, Styles.bordergray, Styles.borderRadius4, Styles.paddingHorizontal4, Styles.marginStart4]}>Confirm</Text>
                        </>
                    ) : (
                        <>
                            <Text style={[Styles.fontBold]}>Admin Verify Status</Text><Text style={[Styles.errorColor, Styles.fontBold, Styles.backgroundSecondaryColor, Styles.bordergray, Styles.borderRadius4, Styles.paddingHorizontal4, Styles.marginStart4]}>Pending</Text>
                        </>
                    )}

                </View>
                <View style={[Styles.width100per, Styles.flexRow, Styles.height80]}>
                    <View style={[Styles.width50per, Styles.flexColumn,]}>
                        <View style={[Styles.width100per, Styles.flexRow, Styles.flexJustifyStart, Styles.flexAlignCenter]}>
                            <Text>{(current.item.is_opening_balance != null ? current.item.is_opening_balance : "0") == "1" ? "Opening Balance" : current.item.pck_category_name != null ? current.item.pck_category_name : ""}</Text>
                        </View>
                        {current.item.pck_category_refno == 4 ? (
                            <View style={[Styles.width100per, Styles.flexRow, Styles.flexJustifyStart,
                            Styles.flexAlignCenter, Styles.marginTop4]}>
                                <Icon name="account-box" size={16} color={theme.colors.secondaryText} style={[Styles.marginEnd4]} /><Text style={[Styles.textSecondaryColor]}>{current.item.contact_name != null ? current.item.contact_name : ""}</Text>
                            </View>
                        )
                            :
                            (
                                <View style={
                                    [Styles.width100per, Styles.flexRow, Styles.flexJustifyStart,
                                    Styles.flexAlignCenter, Styles.marginTop4]
                                }>
                                    {(current.item.pck_sub_category_name != null && current.item.pck_sub_category_name != "") ?
                                        (
                                            <Text style={[Styles.textSecondaryColor]}>{current.item.pck_sub_category_name != null ? current.item.pck_sub_category_name : ""}</Text>
                                        ) : (
                                            <Text style={[Styles.textSecondaryColor]}>{current.item.pck_sub_category_name_other != null ? current.item.pck_sub_category_name_other : ""}</Text>
                                        )
                                    }

                                </View>
                            )

                        }

                        <View style={[Styles.width100per, Styles.marginTop4]}>
                            <Text style={[Styles.textLeft]}>{current.item.pck_trans_date != null ? current.item.pck_trans_date : ""}</Text>
                        </View>
                    </View>
                    <View style={[Styles.width50per, Styles.flexColumn, Styles.flexSpaceBetween]}>
                        <View style={[Styles.width100per, Styles.flexRow, Styles.flexJustifyEnd, Styles.flexAlignCenter]}>
                            <Icon name="currency-inr" size={14} /><Text>{current.item.amount != null ? current.item.amount : ""}</Text><Icon style={[Styles.marginStart4]} color={current.item.pck_transtype_refno == projectVariables.DEF_PCKDIARY_TRANSTYPE_SOURCE_REFNO ? theme.multicolors.green : theme.multicolors.red} name={current.item.pck_transtype_refno == projectVariables.DEF_PCKDIARY_TRANSTYPE_SOURCE_REFNO ? "plus-circle" : "minus-circle"} size={14} />
                        </View>
                        <View style={[Styles.width100per,]}>
                            <Text style={[Styles.textRight]}>Balance: <Icon name="currency-inr" size={14} />{current.item.current_balance != null ? current.item.current_balance : ""}</Text>
                        </View>


                    </View>
                </View>


            </View>




        </>
    );
};