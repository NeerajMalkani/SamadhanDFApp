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
import Provider, { BASE_URL_Architect } from '../../../api/Provider';
import { useState } from 'react';
import { useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ProductModal from './components/ProductModal';
import { useRef } from 'react';
import ClientRBSheet from './components/ClientRBSheet';
import * as ImagePicker from 'expo-image-picker';
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
let Sess_CompanyAdmin_UserRefno = 0;

const AddUpdate = ({ index, unload, navigation }) => {
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

    terms_condition: '',
    client_send_status: '1',
  });
  const chooseFile = async (index) => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setTable((state) => {
        state[index].image_pattern = result;
        return state;
      });
    }
  };
  const refRBSheet = useRef();

  const [table, setTable] = useState([]);

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

  const addBudget = async () => {
    const formData = new FormData();
    formData.append('Sess_UserRefno', Sess_UserRefno);
    formData.append('Sess_company_refno', Sess_company_refno);
    formData.append('Sess_branch_refno', Sess_branch_refno);
    formData.append('Sess_CompanyAdmin_UserRefno', Sess_CompanyAdmin_UserRefno);
    Object.keys(state).map((obj) => {
      formData.append(obj, state[obj]);
    });
    formData.append(
      'product_refno',
      table.map((obj) => obj.product_refno),
    );
    formData.append(
      'unit_refno',
      table.map((obj) => obj.unit_refno),
    );
    formData.append(
      'qty',
      table.map((obj) => obj.quantity),
    );
    formData.append(
      'remarks',
      table.map((obj) => obj.remarks || ''),
    );
    formData.append(
      'image_pattern',
      table.map((obj) => ({
        name: 'appimage1212.jpg',
        type: obj.type + '/*',
        uri: obj.uri,
      })),
    );
    formData.append(
      'short_desc',
      table.map((obj) => obj.short_desc || ''),
    );
    formData.append(
      'specification',
      table.map((obj) => obj.specification || ''),
    );
    console.log('formdata', {
      data: {
        ...state,
        state_refno: states.find(
          (item) => item.state_name === state.state_refno,
        ).state_refno,
        district_refno: districts.find(
          (item) => item.district_name === state.district_refno,
        ).district_refno,
        quot_unit_type_name: units.find(
          (item) => item.quot_unit_type_name === state.quot_unit_type_refno,
        ).quot_unit_type_refno,
        Sess_CompanyAdmin_UserRefno,
        Sess_UserRefno,
        Sess_branch_refno,
        Sess_company_refno,
        product_refno: table.map((obj) => obj.product_refno),
        unit_refno: table.map((obj) => obj.unit_refno),
        qty: table.map((obj) => obj.quantity),
        rate: table.map((obj) => obj.rate),
        amount: table.map((obj) => Number(obj.quantity) * Number(obj.rate)),
        remarks: table.map((obj) => obj.remarks || ''),
        short_desc: table.map((obj) => obj.short_desc),
        specification: table.map((obj) => obj.specification),
        image_pattern: table.map((obj) => ({
          name: 'appimage1212.jpg',
          type: obj.image_pattern.type + '/*',
          uri: obj.image_pattern.uri,
        })),
      },
    });
    Provider.createDFArchitectWithHeader(
      Provider.API_URLS.architect_budget_create,
      {
        data: {
          ...state,
          state_refno: states.find(
            (item) => item.state_name === state.state_refno,
          ).state_refno,
          district_refno: districts.find(
            (item) => item.district_name === state.district_refno,
          ).district_refno,
          quot_unit_type_refno: units.find(
            (item) => item.quot_unit_type_name === state.quot_unit_type_refno,
          ).quot_unit_type_refno,
          Sess_CompanyAdmin_UserRefno,
          Sess_UserRefno,
          Sess_branch_refno,
          Sess_company_refno,
          product_refno: table.map((obj) => obj.product_refno),
          unit_refno: table.map((obj) => obj.unit_refno),
          qty: table.map((obj) => obj.quantity),
          rate: table.map((obj) => obj.rate),
          amount: table.map((obj) => Number(obj.quantity) * Number(obj.rate)),
          remarks: table.map((obj) => obj.remarks || ''),
          short_desc: table.map((obj) => obj.short_desc),
          specification: table.map((obj) => obj.specification),
          image_pattern: table.map((obj) => {
            return obj.image_pattern;
          }),
        },
      },
    )
      .then((res) => {
        console.log('res', res.data);
        // setState({
        //   client_user_refno: '0',
        //   project_name: '',
        //   contact_person: '',
        //   contact_mobile_no: '',
        //   project_Desc: '',
        //   project_address: '',
        //   state_refno: '0',
        //   district_refno: '0',
        //   quot_unit_type_refno: '0',
        //   quot_type_refno: '0',

        //   terms_condition: '',
        //   client_send_status: '1',
        // });
        // setClientDetails({
        //   client_contact_name: '',
        //   client_contact_number: '',
        // });
        // setTable([]);
        unload('Budget Created Successfully', theme.colors.success);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const updateProduct = (i, name, value) => {
    setTable((state) => {
      state[i][name] = value;
      return [...state];
    });
  };
  const getUserData = async () => {
    const userData = await AsyncStorage.getItem('user');
    if (userData !== null) {
      Sess_UserRefno = JSON.parse(userData).UserID;
      Sess_branch_refno = JSON.parse(userData).Sess_branch_refno;
      Sess_company_refno = JSON.parse(userData).Sess_company_refno;
      Sess_group_refno = JSON.parse(userData).Sess_group_refno;
      Sess_CompanyAdmin_UserRefno =
        JSON.parse(userData).Sess_CompanyAdmin_UserRefno;
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
  const remove = (index) => {
    setTable((state) => {
      state = state.filter((item, i) => index !== i);
      return state;
    });
  };
  return (
    <ScrollView style={[Styles.flex1, Styles.backgroundColor]}>
      <ClientRBSheet
        refRBSheet={refRBSheet}
        userID={Sess_UserRefno}
        Sess_company_refno={Sess_company_refno}
        unload={unload}
        fetchClients={fetchClients}
      />
      <Portal>
        <ProductModal
          setTable={setTable}
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

        <Dropdown
          label='Client Name'
          data={Object.values(clients || {})}
          onSelected={(e) => {
            setState((state) => ({ ...state, client_user_refno: e }));
            fetchClientData(getKeyByValue(clients, e));
          }}
          style={{
            backgroundColor: 'white',
            marginBottom: '3%',
          }}
        />
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <Button
            onPress={() => {
              navigation.navigate('AddClientScreen', {
                type: 'client',
                fetchData: fetchClients,
              });
            }}
            mode='contained'
          >
            Add Client
          </Button>
          <Button onPress={() => refRBSheet.current.open()}>
            Search Client
          </Button>
        </View>
        <TextInput
          label='Client Contact Name'
          disabled={true}
          mode='outlined'
          value={clientDetails.client_contact_name}
          returnKeyType='next'
          style={{ backgroundColor: 'white', marginVertical: '3%' }}
        />
        <TextInput
          label='Client Contact Number'
          disabled={true}
          maxLength={10}     
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
          defaultValue={state.project_name}
          onChangeText={(e) => handleChange(e, 'project_name')}
          returnKeyType='next'
          style={{ backgroundColor: 'white', marginBottom: '3%' }}
        />
        <TextInput
          label='Contact Person'
          mode='outlined'
          defaultValue={state.contact_person}
          onChangeText={(e) => {
            if (e.length < 11) handleChange(e, 'contact_person');
          }}
          returnKeyType='next'
          style={{ backgroundColor: 'white', marginBottom: '3%' }}
        />
        <TextInput
          label='Contact Number'
          mode='outlined'
          maxLength={10}  
          keyboardType='phone-pad'
          defaultValue={state.contact_mobile_no}
          onChangeText={(e) => handleChange(e, 'contact_mobile_no')}
          returnKeyType='next'
          style={{ backgroundColor: 'white', marginBottom: '3%' }}
        />
        <TextInput
          label='Project Description'
          mode='outlined'
          defaultValue={state.project_desc}
          onChangeText={(e) => handleChange(e, 'project_desc')}
          returnKeyType='next'
          multiline={true}
          style={{ backgroundColor: 'white', marginBottom: '3%' }}
        />
        <TextInput
          label='Project Site Address'
          mode='outlined'
          defaultValue={state.project_address}
          onChangeText={(e) => handleChange(e, 'project_address')}
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
              unload('Please select a unit first', theme.colors.error);
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
                    'Amount',
                    'Remarks',
                    'Image Pattern Show',
                    'Action',
                  ]}
                  widthArr={[150, 100, 100, 100, 100, 140, 120, 120]}
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
                >
                  <TableWrapper style={{ flexDirection: 'row' }}>
                    <Col
                      height={80}
                      textStyle={styles.text}
                      width={150}
                      data={[...table.map((obj) => obj.product_name)]}
                    />
                    <Col
                      height={80}
                      textStyle={styles.text}
                      width={100}
                      data={[...table.map((obj) => obj.unit_name)]}
                    />
                    <Col
                      height={80}
                      textStyle={styles.text}
                      width={100}
                      data={[
                        ...table.map((obj, index) => (
                          <View key={index} style={{ padding: 10 }}>
                            <TextInput
                              mode='outlined'
                              onChangeText={(e) =>
                                updateProduct(index, 'quantity', e)
                              }
                              value={obj.quantity}
                              key={index}
                              keyboardType='numeric'
                            />
                          </View>
                        )),
                      ]}
                    />

                    <Col
                      height={80}
                      textStyle={styles.text}
                      width={100}
                      data={[
                        ...table.map((obj, index) => (
                          <View key={index} style={{ padding: 10 }}>
                            <TextInput
                              mode='outlined'
                              onChangeText={(e) =>
                                updateProduct(index, 'rate', e)
                              }
                              value={obj.rate}
                              key={index}
                              keyboardType='numeric'
                            />
                          </View>
                        )),
                      ]}
                    />
                    <Col
                      height={80}
                      textStyle={styles.text}
                      width={100}
                      data={[
                        ...table.map((obj, index) => (
                          <View key={index} style={{ padding: 10 }}>
                            <TextInput
                              mode='outlined'
                              value={String(
                                Number(obj.quantity) * Number(obj.rate) ||
                                  0 * Number(obj.rate),
                              )}
                              disabled={true}
                              key={index}
                              keyboardType='numeric'
                            />
                          </View>
                        )),
                      ]}
                    />
                    <Col
                      height={80}
                      textStyle={styles.text}
                      width={140}
                      data={[
                        ...table.map((obj, index) => (
                          <View key={index} style={{ padding: 10 }}>
                            <TextInput
                              mode='outlined'
                              value={obj.remarks}
                              onChangeText={(e) =>
                                updateProduct(index, 'remarks', e)
                              }
                              key={index}
                            />
                          </View>
                        )),
                      ]}
                    />
                    <Col
                      height={80}
                      textStyle={styles.text}
                      width={120}
                      data={[
                        ...table.map((obj, index) => (
                          <View key={index} style={{ padding: 10 }}>
                            <Button
                              mode='contained'
                              onPress={async () => await chooseFile(index)}
                            >
                              Add Image
                            </Button>
                          </View>
                        )),
                      ]}
                    />
                    <Col
                      height={80}
                      textStyle={styles.text}
                      width={120}
                      data={[
                        ...table.map((obj, index) => (
                          <View key={index} style={{ padding: 10 }}>
                            <Button
                              mode='contained'
                              onPress={() => remove(index)}
                            >
                              Remove
                            </Button>
                          </View>
                        )),
                      ]}
                    />
                  </TableWrapper>
                </Table>
              </ScrollView>
              <Table
                borderStyle={{
                  borderWidth: 1,
                  borderColor: '#C1C0B9',
                }}
              >
                <Row
                  data={[
                    'Sub Total',
                    table.reduce(
                      (a, obj) =>
                        a + Number(obj.quantity) * Number(obj.rate) ||
                        0 * Number(obj.rate),
                      0,
                    ),
                  ]}
                  widthArr={[450, 480]}
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
          defaultValue={state.terms_condition}
          onChangeText={(e) => handleChange(e, 'terms_condition')}
        />
        <Checkbox.Item
          label='Send to Client'
          color={theme.colors.primary}
          position='leading'
          onPress={() =>
            setState((state) => ({
              ...state,
              client_send_status: state.client_send_status === '0' ? '1' : '0',
            }))
          }
          labelStyle={{ textAlign: 'left' }}
          status={state.client_send_status === '1' ? 'checked' : 'unchecked'}
        />
        <Button
          onPress={() => addBudget()}
          mode='contained'
          style={{ marginTop: '5%' }}
        >
          Submit
        </Button>
      </View>
    </ScrollView>
  );
};

export default AddUpdate;
