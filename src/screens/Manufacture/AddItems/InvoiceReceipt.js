import { View, ScrollView } from 'react-native';
import React, { useEffect, useState } from 'react';
import { TextInput, Button } from 'react-native-paper';
import { Styles } from '../../../styles/styles';
import Dropdown from '../../../components/Dropdown';

import { DateTimePicker } from '@hashiprobr/react-native-paper-datetimepicker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useIsFocused } from '@react-navigation/native';
import Provider from '../../../api/Provider';
let user = null;
const InvoiceReceipt = ({ route, navigation }) => {
  const [state, setState] = useState({
    mf_po_refno: '',
    mf_vo_refno: '',
    invoice_no: '',
    invoice_entry_date: new Date(),
    invoice_date: new Date(),
    transport_charges: '',
  });
  const onChange = (text, name) => {
    setState((state) => ({ ...state, [name]: text }));
  };
  const isFocused = useIsFocused();
  const [purchaseno, setPurchaseNo] = useState([]);
  const [joborderno, setJobOrderNo] = useState([]);
  const [production, setProduction] = useState({});
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
    )
      .then((res) => {
        setJobOrderNo(res.data.data);
      })
      .catch((error) => console.log(error));
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
  const fetchProduction = (mf_vo_refno) => {
    console.log({
      data: {
        Sess_UserRefno: user.UserID,
        Sess_company_refno: user.Sess_company_refno,
        Sess_branch_refno: user.Sess_branch_refno,
        mf_po_refno: purchaseno.find(
          (item) => item.purchaseorderno === state.mf_po_refno,
        ).mf_po_refno,
        mf_vo_refno: mf_vo_refno.mf_vo_refno,
        mf_vo_invoice_refno: '0',
      },
    });
    Provider.createDFManufacturer(
      Provider.API_URLS.get_orderproductioncalculation_vendororder_invoiceform,
      {
        data: {
          Sess_UserRefno: user.UserID,
          Sess_company_refno: user.Sess_company_refno,
          Sess_branch_refno: user.Sess_branch_refno,
          mf_po_refno: purchaseno.find(
            (item) => item.purchaseorderno === state.mf_po_refno,
          ).mf_po_refno,
          mf_vo_refno,
          mf_vo_invoice_refno: '0',
        },
      },
    )
      .then((res) => {
        console.log(res.data);
        setProduction(res.data.data);
      })
      .catch((error) => console.log(error));
  };

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
          onSelected={(text) => {
            onChange(text, 'mf_po_refno');
            fetchOtherData(
              purchaseno.find((item) => item.purchaseorderno === text)
                .mf_po_refno,
            );
            setState((state) => ({ ...state, mf_vo_refno: '' }));
          }}
        />
        <Dropdown
          data={joborderno.map((obj) => obj.joborderno)}
          label='Job Order No'
          selectedItem={state.mf_vo_refno}
          onSelected={(text) => {
            onChange(text, 'mf_vo_refno');

            fetchProduction(
              joborderno.find((item) => item.joborderno === text),
            );
          }}
        />
        <TextInput
          mode='flat'
          label='Invoice No'
          style={{ backgroundColor: 'white' }}
          onChangeText={(text) => onChange(text, 'invoice_no')}
        />
        <TextInput
          mode='flat'
          label='Invoice Entry Date'
          disabled={true}
          value={state.invoice_entry_date}
          style={{ backgroundColor: 'white' }}
        />
        <DateTimePicker
          label='Date of Invoice'
          value={state.invoice_date}
          type='date'
          style={{ backgroundColor: 'white' }}
          onChangeDate={(date) => onChange(date, 'invoice_date')}
        />
        <TextInput
          mode='flat'
          label='Supplier Name'
          disabled={true}
          value={state.supplier_name || ''}
          style={{ backgroundColor: 'white' }}
        />
        <TextInput
          mode='flat'
          label='Basic Amount'
          disabled={true}
          value={state.basic_amount || ''}
          style={{ backgroundColor: 'white' }}
        />
        <TextInput
          mode='flat'
          label='Transporation Charges'
          style={{ backgroundColor: 'white' }}
          onSelected={(text) => onChange(text, 'transport_charges')}
        />
        <Button mode='contained' style={{ alignSelf: 'center', marginTop: 10 }}>
          Submit
        </Button>
      </ScrollView>
    </View>
  );
};

export default InvoiceReceipt;
