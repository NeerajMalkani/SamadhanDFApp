import { View, Text, ScrollView } from 'react-native';
import React, { useEffect, useState } from 'react';
import { TextInput, Button } from 'react-native-paper';
import { Styles } from '../../../styles/styles';
import Dropdown from '../../../components/Dropdown';
import moment from 'moment';
import { DateTimePicker } from '@hashiprobr/react-native-paper-datetimepicker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useIsFocused } from '@react-navigation/native';
import Provider from '../../../api/Provider';
let user = null;
const InvoiceReceipt = ({ route, navigation }) => {
  const [state, setState] = useState({});
  const isFocused = useIsFocused();
  const [purchaseno, setPurchaseNo] = useState([]);
  const [joborderno, setJobOrderNo] = useState([]);
  const fetchPurchaseOrderNo = () => {
    Provider.createDFManufacturer(
      Provider.API_URLS.get_purchaseorderno_vendororder_invoiceform,
      {
        data: {
          Sess_UserRefno: user.UserID,
          Sess_company_refno: user.Sess_company_refno,
          Sess_branch_refno: user.Sess_branch_refno,
        },
      },
    ).then((res) => {
      if (res.data.data) {
        setPurchaseNo(res.data.data);
      }
    });
  };

  const fetchOtherData = (mf_po_refno) => {
    Provider.createDFManufacturer(
      Provider.API_URLS.get_purchaseorderno_otherdata_vendororder_invoiceform,
      {
        data: {
          Sess_UserRefno: user.UserID,
          Sess_company_refno: user.Sess_company_refno,
          Sess_branch_refno: user.Sess_branch_refno,
          mf_po_refno,
        },
      },
    ).then((res) => {
      setState((state) => ({ ...state, ...res.data.data[0] }));
    });
    Provider.createDFManufacturer(
      Provider.API_URLS.get_joborderno_vendororder_invoiceform,
      {
        data: {
          Sess_UserRefno: user.UserID,
          Sess_company_refno: user.Sess_company_refno,
          Sess_branch_refno: user.Sess_branch_refno,
          mf_po_refno,
        },
      },
    ).then((res) => {
      setJobOrderNo(res.data.data);
    });
  };

  const fetchUser = async () => {
    const data = await AsyncStorage.getItem('user');
    if (data) {
      user = JSON.parse(data);
      fetchPurchaseOrderNo();
    }
  };
  useEffect(() => {
    if (isFocused) {
      fetchUser();
    }
  }, [isFocused]);

  return (
    <View style={[Styles.flex1, Styles.backgroundColor]}>
      <ScrollView
        keyboardShouldPersistTaps='handled'
        style={[
          Styles.flex1,
          Styles.paddingHorizontal16,
          Styles.paddingVertical16,
        ]}
      >
        <Dropdown
          data={purchaseno.map((obj) => obj.purchaseorderno)}
          label='Purchase Order No'
        />
        <Dropdown data={[]} label='Job Order No' />
        <TextInput
          mode='flat'
          label='Invoice No'
          style={{ backgroundColor: 'white' }}
        />
        <TextInput
          mode='flat'
          label='Invoice Entry Date'
          disabled={true}
          value={moment().format('DD-MM-YYYY')}
          style={{ backgroundColor: 'white' }}
        />
        <DateTimePicker
          label='Date of Invoice'
          value={new Date()}
          type='date'
          style={{ backgroundColor: 'white' }}
        />
        <TextInput
          mode='flat'
          label='Supplier Name'
          disabled={true}
          style={{ backgroundColor: 'white' }}
        />
        <TextInput
          mode='flat'
          label='Basic Amount'
          disabled={true}
          style={{ backgroundColor: 'white' }}
        />
        <TextInput
          mode='flat'
          label='Transporation Charges'
          style={{ backgroundColor: 'white' }}
        />
        <Button mode='contained' style={{ alignSelf: 'center', marginTop: 10 }}>
          Submit
        </Button>
      </ScrollView>
    </View>
  );
};

export default InvoiceReceipt;
