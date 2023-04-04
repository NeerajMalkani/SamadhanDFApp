import { View, Text, StyleSheet } from 'react-native';
import React from 'react';
import { ScrollView } from 'react-native-gesture-handler';
import { Styles } from '../../../styles/styles';
import {
  TextInput,
  Checkbox,
  Button,
  IconButton,
  Portal,
} from 'react-native-paper';
import { Table, TableWrapper, Row, Col } from 'react-native-table-component';

import Dropdown from '../../../components/Dropdown';
import { theme } from '../../../theme/apptheme';
import Provider from '../../../api/Provider';
import { useState } from 'react';
import { useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ProductModal from './components/ProductModal';
function getKeyByValue(object, value) {
  return Object.keys(object).find((key) => object[key] === value);
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 10,
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  header: { height: 80, backgroundColor: theme.colors.primary },
  subheader: { height: 30, backgroundColor: 'white' },
  text: { textAlign: 'center', fontWeight: '400' },
  headertext: { textAlign: 'center', fontWeight: '800', color: 'white' },
  dataWrapper: { marginTop: -1 },
  row: { height: 50, backgroundColor: 'white' },
});

let Sess_UserRefno = 0;
let Sess_company_refno = 0;
let Sess_branch_refno = 0;
let Sess_group_refno = 0;

const AddUpdate = ({ index }) => {
  const [state, setState] = useState({
    client_user_refno: '0',
    project_name: '',
    contact_person: '',
    contact_mobile_no: '',
    project_desc: '',
    project_address: '',
    state_refno: '0',
    district_refno: '0',
    quot_unit_type_refno: '0',
    quot_type_refno: '0',
    product_refno: [],
    unit_refno: [],
    qty: [],
    rate: [],
    amount: [],
    remarks: [],
    image_pattern: [],
    short_desc: [],
    specification: [],
    terms_condition: '',
    client_send_status: '1',
  });
  const handleChange = (text, name) =>
    setState((state) => ({ ...state, [name]: text }));
  const [open, setOpen] = useState(false);
  const [clients, setClients] = useState([]);
  const [units, setUnits] = useState([]);
  const [clientDetails, setClientDetails] = useState({
    client_contact_name: '',
    client_contact_number: '',
  });
  const [states, setStates] = useState([]);
  const [districts, setDistricts] = useState([]);
  useEffect(() => {
    if (index === 0) {
      getUserData();
    } else {
      setClients([]);
    }
  }, [index]);
  const getUserData = async () => {
    const userData = await AsyncStorage.getItem('user');
    if (userData !== null) {
      Sess_UserRefno = JSON.parse(userData).UserID;
      Sess_branch_refno = JSON.parse(userData).Sess_branch_refno;
      Sess_company_refno = JSON.parse(userData).Sess_company_refno;
      Sess_group_refno = JSON.parse(userData).Sess_group_refno;
      fetchClients();
      fetchUnits();
      fetchState();
    }
  };

  const fetchUnits = () => {
    Provider.createDFArchitect(
      Provider.API_URLS.architect_get_unitofsales_budgetform,
      { data: { Sess_UserRefno } },
    ).then((res) => {
      setUnits(res.data.data);
    });
  };
  const fetchClients = () => {
    Provider.createDFArchitect(
      Provider.API_URLS.architect_get_clientname_budgetform,
      {
        data: {
          Sess_UserRefno,
          Sess_company_refno,
          Sess_branch_refno,
          Sess_group_refno,
        },
      },
    )
      .then((res) => {
        if (res.data.data) {
          setClients(res.data.data[0]?.client_data);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const fetchClientData = (ref) => {
    let params = {
      data: {
        Sess_UserRefno: Sess_UserRefno,
        client_user_refno: ref,
      },
    };
    Provider.createDFArchitect(
      Provider.API_URLS.architect_get_clientdetails_budgetform,
      params,
    )
      .then((response) => {
        if (response.data && response.data.data) {
          setClientDetails(response.data.data[0]);
        }
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const fetchState = () => {
    Provider.createDFCommon(Provider.API_URLS.GetStateDetails)
      .then((res) => {
        if (res.data.data) setStates(res.data.data);
      })
      .catch((error) => console.log(error));
  };
  const fetchDistricts = (state_refno) => {
    Provider.createDFCommon(Provider.API_URLS.GetDistrictDetailsByStateRefno, {
      data: {
        Sess_UserRefno,
        state_refno,
      },
    })
      .then((res) => {
        if (res.data.data) setDistricts(res.data.data);
      })
      .catch((error) => console.log(error));
  };

  return (
    <ScrollView style={[Styles.flex1, Styles.backgroundColor]}>
      <Portal>
        <ProductModal
          Sess_UserRefno={Sess_UserRefno}
          quot_type_refno={state.quot_type_refno}
          quot_unit_type_refno={
            units.find(
              (item) =>
                item?.quot_unit_type_name === state?.quot_unit_type_refno,
            )?.quot_unit_type_refno
          }
          open={open}
          setOpen={setOpen}
        />
      </Portal>
      <View style={[Styles.flex1, Styles.padding16]}>
        <Text
          style={[
            Styles.fontSize20,
            Styles.fontBold,
            Styles.marginBottom4,
            Styles.primaryColor,
            { marginBottom: '3%' },
          ]}
        >
          Client Details
        </Text>
        <View style={{ flexDirection: 'row' }}>
          <Dropdown
            label='Client Name'
            data={Object.values(clients)}
            onSelected={(e) => {
              setState((state) => ({ ...state, client_user_refno: e }));
              fetchClientData(getKeyByValue(clients, e));
            }}
            style={{
              backgroundColor: 'white',
              marginBottom: '3%',
              width: '90%',
            }}
          />
          <IconButton
            icon='plus'
            style={[Styles.primaryBgColor]}
            color='white'
          />
        </View>

        <TextInput
          label='Client Contact Name'
          disabled={true}
          mode='outlined'
          value={clientDetails.client_contact_name}
          returnKeyType='next'
          style={{ backgroundColor: 'white', marginBottom: '3%' }}
        />
        <TextInput
          label='Client Contact Number'
          disabled={true}
          value={clientDetails.client_contact_number}
          mode='outlined'
          returnKeyType='next'
          style={{ backgroundColor: 'white', marginBottom: '3%' }}
        />
        <Text
          style={[
            Styles.fontSize20,
            Styles.fontBold,
            Styles.marginBottom4,
            Styles.primaryColor,
            { marginBottom: '3%' },
          ]}
        >
          Project Details
        </Text>
        <TextInput
          label='Project Name'
          mode='outlined'
          value={state.project_name}
          onChangeText={(e) => handleChange('project_name', e)}
          returnKeyType='next'
          style={{ backgroundColor: 'white', marginBottom: '3%' }}
        />
        <TextInput
          label='Contact Person'
          mode='outlined'
          value={state.contact_person}
          onChangeText={(e) => handleChange('contact_person', e)}
          returnKeyType='next'
          style={{ backgroundColor: 'white', marginBottom: '3%' }}
        />
        <TextInput
          label='Contact Number'
          mode='outlined'
          value={state.contact_mobile_no}
          onChangeText={(e) => handleChange('contact_mobile_no', e)}
          returnKeyType='next'
          style={{ backgroundColor: 'white', marginBottom: '3%' }}
        />
        <TextInput
          label='Project Description'
          mode='outlined'
          value={state.project_desc}
          onChangeText={(e) => handleChange('project_desc', e)}
          returnKeyType='next'
          multiline={true}
          style={{ backgroundColor: 'white', marginBottom: '3%' }}
        />
        <TextInput
          label='Project Site Address'
          mode='outlined'
          value={state.project_address}
          onChangeText={(e) => handleChange('project_address', e)}
          multiline={true}
          returnKeyType='next'
          style={{ backgroundColor: 'white', marginBottom: '3%' }}
        />
        <Dropdown
          label='State'
          onSelected={(e) => {
            setState((state) => ({
              ...state,
              state_refno: e,
              district_refno: 0,
            }));
            fetchDistricts(
              states.find((item) => item.state_name === e).state_refno,
            );
          }}
          data={states.map((obj) => obj.state_name)}
          style={{ backgroundColor: 'white', marginBottom: '3%' }}
        />
        <Dropdown
          label='City'
          onSelected={(e) => {
            setState((state) => ({
              ...state,

              district_refno: e,
            }));
          }}
          data={districts.map((obj) => obj.district_name)}
          style={{ backgroundColor: 'white', marginBottom: '3%' }}
        />
        <Text
          style={[
            Styles.fontSize20,
            Styles.fontBold,
            Styles.marginBottom4,
            Styles.primaryColor,
            { marginBottom: '3%' },
          ]}
        >
          Budget Preparation Type
        </Text>
        <Dropdown
          label='Unit Of Sales'
          onSelected={(e) =>
            setState((state) => ({ ...state, quot_unit_type_refno: e }))
          }
          data={units.map((obj) => {
            return obj.quot_unit_type_name;
          })}
          style={{ backgroundColor: 'white', marginBottom: '3%' }}
        />
        <Checkbox.Item
          label='Inclusive Materials'
          color={theme.colors.primary}
          position='leading'
          onPress={() =>
            setState((state) => ({
              ...state,
              quot_type_refno: state.quot_type_refno === '0' ? '1' : '0',
            }))
          }
          labelStyle={{ textAlign: 'left' }}
          status={state.quot_type_refno === '1' ? 'checked' : 'unchecked'}
        />
        <Button
          mode='contained'
          onPress={() => {
            if (state.quot_unit_type_refno === '0') {
              return;
            }
            setOpen(true);
          }}
          style={{ marginBottom: '3%' }}
        >
          Add Product
        </Button>
        <Text
          style={[
            Styles.fontSize20,
            Styles.fontBold,
            Styles.marginBottom4,
            Styles.primaryColor,
            { marginBottom: '3%' },
          ]}
        >
          Product Details
        </Text>

        <View style={styles.container}>
          <ScrollView horizontal={true}>
            <View>
              <Table
                borderStyle={{
                  borderWidth: 1,
                  borderColor: '#C1C0B9',
                }}
              >
                <Row
                  data={[
                    'Product Name',
                    'Unit',
                    'Quantity',
                    'Rate',
                    'Remarks',
                    'Image Pattern Show',
                    'Action',
                  ]}
                  widthArr={[100, 80, 80, 80, 120, 140, 190]}
                  style={styles.header}
                  textStyle={styles.headertext}
                />
              </Table>
              <ScrollView style={styles.dataWrapper}>
                <Table
                  borderStyle={{
                    borderWidth: 1,
                    borderColor: '#C1C0B9',
                  }}
                ></Table>
              </ScrollView>
              <Table
                borderStyle={{
                  borderWidth: 1,
                  borderColor: '#C1C0B9',
                }}
              >
                <Row
                  data={['Sub Total', 'total']}
                  widthArr={[260, 530]}
                  style={styles.row}
                  textStyle={{ paddingHorizontal: 25 }}
                />
              </Table>
            </View>
          </ScrollView>
        </View>

        <Text
          style={[
            Styles.fontSize20,
            Styles.fontBold,
            Styles.marginBottom4,
            Styles.primaryColor,
            { marginBottom: '3%', marginTop: '3%' },
          ]}
        >
          Terms & Conditions
        </Text>
        <TextInput
          label='Terms & Conditions'
          style={{ backgroundColor: 'white', marginBottom: '3%' }}
          mode='outlined'
          multiline={true}
          numberOfLines={5}
          value={state.terms_condition}
          onChangeText={(e) => handleChange('terms_condition', e)}
        />
        <Button mode='contained' style={{ marginTop: '5%' }}>
          Submit
        </Button>
      </View>
    </ScrollView>
  );
};

export default AddUpdate;
