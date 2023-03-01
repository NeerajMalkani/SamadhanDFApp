import React from 'react';
import { useState, useEffect } from 'react';
import Provider from '../../../api/Provider';
import { View, Text } from 'react-native';
import { TextInput, List } from 'react-native-paper';
import { theme } from '../../../theme/apptheme';
import { Styles } from '../../../styles/styles';

function Slitting({ user, mf_po_no, width }) {
  const [state, setState] = React.useState({});
  useEffect(() => {
    console.log({
      data: {
        Sess_UserRefno: user.UserID,
        Sess_company_refno: user.Sess_company_refno,
        Sess_branch_refno: user.Sess_branch_refno,
        mf_po_refno: mf_po_no,
      },
    });
    let params = {
      data: {
        Sess_UserRefno: user.UserID,
        Sess_company_refno: user.Sess_company_refno,
        Sess_branch_refno: user.Sess_branch_refno,
        mf_po_refno: mf_po_no,
      },
    };

    Provider.createDFManufacturer(
      Provider.API_URLS.get_slittingdetails_vendororderform,
      params,
    )
      .then((res) => {
        if (res.data.data) {
          setState(res.data.data);
        }
      })
      .catch((e) => console.log(e));
  }, [mf_po_no, user, setState]);

  return (
    <View>
      <Text
        style={[Styles.paddingHorizontal16, Styles.fontBold, Styles.fontSize16]}
      >
        Slitting Details
      </Text>
      {/* <List.Item title='Weight(kg)' description={state[0]?.length} />
      <List.Item title='Width of GP Slitting' description={width} /> */}
    </View>
  );
}
export default Slitting;
