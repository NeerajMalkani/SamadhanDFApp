import React from 'react';
import { useState, useEffect } from 'react';
import Provider from '../../../api/Provider';
import { View, Text } from 'react-native';
import { TextInput, List, DataTable } from 'react-native-paper';
import { theme } from '../../../theme/apptheme';
import { Styles } from '../../../styles/styles';

function Coil({ user, mf_po_no, width }) {
  const [state, setState] = React.useState({});
  useEffect(() => {
    let params = {
      data: {
        Sess_UserRefno: user.UserID,
        Sess_company_refno: user.Sess_company_refno,
        Sess_branch_refno: user.Sess_branch_refno,
        mf_po_refno: mf_po_no,
      },
    };

    Provider.createDFManufacturer(
      Provider.API_URLS.get_coildetails_vendororderform,
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
        Coil Details
      </Text>
      {/* <List.Item title='Weight(kg)' description={state[0]?.length} />
      <List.Item title='Width of GP Coil' description={width} /> */}

      <View style={[Styles.padding16]}>
        <DataTable
          style={[
            Styles.backgroundSecondaryColor,
            Styles.borderRadius4,
            Styles.flexJustifyCenter,
            Styles.bordergray,
            Styles.fontBold,
          ]}
        >
          <DataTable.Header style={[Styles.primaryBgColor]}>
            <DataTable.Title textStyle={[Styles.whiteColor]}
              style={[Styles.whiteColor, { flex: 1, justifyContent: "center" }]}
            >
              Coil #
            </DataTable.Title>
            <DataTable.Title textStyle={[Styles.whiteColor]}
              style={[
                Styles.borderLeft1,
                { flex: 3, justifyContent: "center" },
              ]}
              numeric
            >
              Weight (Kg)
            </DataTable.Title>
            <DataTable.Title textStyle={[Styles.whiteColor]}
              style={[
                Styles.borderLeft1,
                { flex: 3, justifyContent: "center" },
              ]}
              numeric
            >
              Width of GP Coil (Mtr)
            </DataTable.Title>
          </DataTable.Header>


          {(state != null && state.length > 0) &&
            state.map((item, index) => (
              <DataTable.Row key={index} style={[Styles.backgroundColor]}>
                <DataTable.Cell
                  style={[{ flex: 1, justifyContent: "center" }]}
                >
                  {index}
                </DataTable.Cell>
                <DataTable.Cell
                  style={[
                    Styles.borderLeft1,
                    { flex: 3, justifyContent: "center" },
                  ]}
                >
                  {item.weight}
                </DataTable.Cell>
                <DataTable.Cell
                  style={[
                    Styles.borderLeft1,
                    { flex: 3, justifyContent: "center" },
                  ]}
                >
                  {width}
                </DataTable.Cell>
              </DataTable.Row>
            ))
          }

        </DataTable>
      </View>

    </View>
  );
}
export default Coil;
