import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useRef } from 'react';
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  View,
} from 'react-native';
import { AutocompleteDropdown } from 'react-native-autocomplete-dropdown';
import RBSheet from 'react-native-raw-bottom-sheet';
import {
  Button,
  Card,
  HelperText,
  Snackbar,
  Subheading,
  Text,
  TextInput,
} from 'react-native-paper';
import Provider from '../../../api/Provider';
import Dropdown from '../../../components/Dropdown';
import { Styles } from '../../../styles/styles';
import { theme } from '../../../theme/apptheme';
import { communication } from '../../../utils/communication';
import { APIConverter } from '../../../utils/apiconverter';
import { useIsFocused } from '@react-navigation/native';

let userID = 0,
  Sess_group_refno = 0,
  Sess_company_refno = '0',
  Sess_branch_refno = '0',
  Sess_CompanyAdmin_UserRefno = '0';
function getKeyByValue(object, value) {
  return Object.keys(object).find((key) => object[key] === value);
}
const EstimationPreviewScreen = ({ route, navigation }) => {
  //#region Variables
  const [snackbarVisible, setSnackbarVisible] = React.useState(false);
  const [snackbarText, setSnackbarText] = React.useState('');
  const [snackbarColor, setSnackbarColor] = React.useState(
    theme.colors.success,
  );

  const [otherClients, setOtherClients] = React.useState([]);
  const [selectedData, setSelectedData] = React.useState([]);
  const [selectedClient, setSelectedClient] = React.useState('');
  const [isButtonDisabled, setIsButtonDisabled] = React.useState(true);

  const [clientsFullData, setClientsFullData] = React.useState([]);
  const [clients, setClients] = React.useState([]);
  const [clientName, setClientName] = React.useState('');
  const [errorCN, setCNError] = React.useState(false);

  const [mobilenoData, setMobileNoData] = React.useState([]);
  const [mobileno, setMobileNo] = React.useState('');
  const [errorMN, setMNError] = React.useState(false);

  const [companyData, setCompanyData] = React.useState([]);
  const [companyName, setCompanyName] = React.useState('');
  const [errorCON, setCONError] = React.useState(false);

  const [lengthFeet, setLengthFeet] = React.useState('1');
  const [lengthInches, setLengthInches] = React.useState('0');

  const [widthFeet, setWidthFeet] = React.useState('1');
  const [widthInches, setWidthInches] = React.useState('0');
  const [totalSqFt, setTotalSqft] = React.useState('1.0000');
  const refRBSheet = useRef();
  //#endregion
  const isFocused = useIsFocused();
  //#region Functions

  useEffect(() => {
    if (isFocused) GetUserID();
  }, [isFocused]);

  const GetUserID = async () => {
    const userData = await AsyncStorage.getItem('user');
    if (userData !== null) {
      const userDataParsed = JSON.parse(userData);

      userID = userDataParsed.UserID;
      Sess_group_refno = userDataParsed.Sess_group_refno;
      Sess_company_refno = userDataParsed.Sess_company_refno;
      Sess_branch_refno = userDataParsed.Sess_branch_refno;
      Sess_CompanyAdmin_UserRefno = userDataParsed.Sess_CompanyAdmin_UserRefno;
      FetchImageGalleryProductDetail();
    }
  };

  console.log(selectedData.client_data);
  const FetchImageGalleryProductDetail = () => {
    let params = {
      data: {
        Sess_UserRefno: userID,
        Sess_group_refno: Sess_group_refno,
        service_refno: route.params.data.serviceID,
        designtype_refno: route.params.data.designTypeID,
        product_refno: route.params.data.productID,
        designgallery_refno: route.params.data.id,
      },
    };
    console.log(params);
    Provider.createDFContractor(Provider.API_URLS.Getgotoestimation, params)
      .then((response) => {
        if (response.data && response.data.code === 200) {
          if (response.data.data) {
            response.data.data = APIConverter(response.data.data);
            setSelectedData(response.data.data[0]);
          }
        }
      })
      .catch((e) => {
        setSnackbarText(e.message);
        setSnackbarColor(theme.colors.error);
        setSnackbarVisible(true);
      });
  };
  const AddMoreDesigns = () => {
    InsertDesignEstimationEnquiry('add');
  };

  const FetchClients = () => {
    let params = {
      data: {
        Sess_UserRefno: userID,
        Sess_group_refno: Sess_group_refno,
        client_user_refno: 'all',
      },
    };
    Provider.createDFCommon(Provider.API_URLS.MyClientUserRefNoCheck, params)
      .then((response) => {
        if (response.data && response.data.code === 200) {
          if (response.data.data) {
            response.data.data = APIConverter(response.data.data);
            setClientsFullData(response.data.data);
            let clientData = response.data.data.map((data) => data.companyName);
            setClients(clientData);
          }
        } else {
          setClients([]);
          setClientsFullData([]);
        }
      })
      .catch((e) => {
        setClients([]);
        setClientsFullData([]);
      });
  };

  const FetchOtherClients = (selectedItem, type) => {
    let params = {
      data: {
        Sess_UserRefno: userID,
        company_name: selectedItem,
      },
    };
    if (type === 'company') {
      params.data.company_name = selectedItem;
    } else {
      params.data.mobile_no = selectedItem;
    }
    Provider.createDFCommon(
      type === 'company'
        ? Provider.API_URLS.CompanyNameAutocompleteClientSearch
        : Provider.API_URLS.MobileNoAutocompleteClientSearch,
      params,
    )
      .then((response) => {
        if (response.data && response.data.code === 200) {
          if (response.data.data) {
            let clientData = [];
            response.data.data.map((data, i) => {
              clientData.push({
                id: i,
                title:
                  type === 'company'
                    ? data.companyname_Result
                    : data.mobile_no_Result,
              });
            });
            if (type === 'company') {
              setCompanyData(clientData);
            } else {
              setMobileNoData(clientData);
            }
          }
        } else {
          setCompanyData([]);
          setMobileNoData([]);
        }
      })
      .catch((e) => {
        setCompanyData([]);
        setMobileNoData([]);
      });
  };

  const SearchClient = () => {
    let params = {
      data: {
        Sess_UserRefno: userID,
        Sess_company_refno,
        company_name_s: companyName,
        mobile_no_s: mobileno,
      },
    };
    Provider.createDFCommon(Provider.API_URLS.ClientSearch, params)
      .then((response) => {
        console.log(response.data);
        if (response.data && response.data.code === 200) {
          if (response.data.data) {
            setOtherClients(response.data.data);
          }
        } else {
          setOtherClients([]);
        }
      })
      .catch((e) => {
        setOtherClients([]);
      });
  };

  const FetchEstimationMaterialSetupData = (
    materialSetupID,
    from,
    userDesignEstimationID,
    labourCost,
  ) => {
    let params = {
      MaterialSetupID: materialSetupID,
    };
    Provider.getAll(
      `generaluserenquiryestimations/getdesignestimateenquiriesformaterialsetup?${new URLSearchParams(
        params,
      )}`,
    )
      .then((response) => {
        if (response.data && response.data.code === 200) {
          if (response.data.data) {
            const targetSqFt = totalSqFt;
            let subtotalCal = 0;
            response.data.data.map((k, i) => {
              const destinationSqFt = CalculateSqFtData(k);
              let newAmount =
                (parseFloat(targetSqFt) * parseFloat(k.amount)) /
                parseFloat(destinationSqFt);
              newAmount =
                newAmount - newAmount * (parseFloat(k.generalDiscount) / 100);
              subtotalCal += newAmount;
            });
            InsertDesignEstimationEnquiry(
              from,
              '2',
              subtotalCal,
              userDesignEstimationID,
              labourCost,
            );
          }
        }
      })
      .catch((e) => {});
  };

  const FetchEstimationData = (userDesignEstimationID, from) => {
    let params = {
      UserDesignEstimationID: userDesignEstimationID,
    };
    Provider.getAll(
      `generaluserenquiryestimations/getdesignestimateenquiries?${new URLSearchParams(
        params,
      )}`,
    )
      .then((response) => {
        if (response.data && response.data.code === 200) {
          if (response.data.data) {
            FetchEstimationMaterialSetupData(
              response.data.data[0].id,
              from,
              userDesignEstimationID,
              response.data.data[0].labourCost,
            );
          }
        }
      })
      .catch((e) => {});
  };

  const InsertDesignEstimationEnquiry = (
    from,
    number,
    subtotal,
    userDesignEstimationID,
    labourCost,
  ) => {
    if (route.params.isContractor) {
      const params = {
        data: {
          Sess_UserRefno: userID,
          Sess_group_refno: Sess_group_refno,
          service_refno: route.params.data.serviceID,
          designtype_refno: route.params.data.designTypeID,
          product_refno: route.params.data.productID,
          designgallery_refno: route.params.data.id,
          lengthfoot: lengthFeet,
          lengthinches: lengthInches,
          widthheightfoot: widthFeet,
          widthheightinches: widthInches,
          totalfoot: totalSqFt,
          Sess_company_refno,
          Sess_branch_refno,
          Sess_CompanyAdmin_UserRefno,
          client_user_refno: getKeyByValue(
            selectedData.client_data,
            clientName,
          ),
        },
      };

      Provider.createDFContractor(
        Provider.API_URLS.contractor_createquote,
        params,
      )
        .then((response) => {
          console.log(response.data.data);
          if (response.data && response.data.code === 200) {
            if (from === 'add') {
              if (route.params.from === 'home') {
                navigation.navigate('HomeScreen');
              } else {
                navigation.navigate('ImageGalleryScreen');
              }
            } else {
              console.log(response.data.data);
              navigation.navigate('GetEstimationScreen', {
                userDesignEstimationID:
                  response.data.data.cont_estimation_refno,
                designImage: route.params.data.designImage,
                isContractor: route.params.isContractor,
                fetchData: route.params.fetchData,
                clientID: route.params.isContractor
                  ? getKeyByValue(selectedData.client_data, clientName)
                  : 0,
              });
            }
          } else {
            setSnackbarText(communication.InsertError);
            setSnackbarColor(theme.colors.error);
            setSnackbarVisible(true);
          }
        })
        .catch((e) => {
          console.log(e);
          setSnackbarText(communication.NetworkError);
          setSnackbarColor(theme.colors.error);
          setSnackbarVisible(true);
        });
    } else {
      const params = {
        data: {
          Sess_UserRefno: userID,
          Sess_group_refno: Sess_group_refno,
          clickaddmorecheck: from == 'add' ? '1' : '0',
          service_refno: route.params.data.serviceID,
          designtype_refno: route.params.data.designTypeID,
          product_refno: route.params.data.productID,
          designgallery_refno: route.params.data.id,
          lengthfoot: lengthFeet,
          lengthinches: lengthInches,
          widthheightfoot: widthFeet,
          widthheightinches: widthInches,
          totalfoot: totalSqFt,
        },
      };

      Provider.createDFCommon(Provider.API_URLS.getsc_estimation, params)
        .then((response) => {
          //console.log(response.data);
          if (response.data && response.data.code === 200) {
            //if (number === "2") {
            if (from === 'add') {
              if (route.params.from === 'home') {
                navigation.navigate('HomeScreen');
              } else {
                navigation.navigate('ImageGalleryScreen');
              }
            } else {
              navigation.navigate('GetEstimationScreen', {
                userDesignEstimationID: response.data.data.estimation_refno,
                designImage: route.params.data.designImage,
                isContractor: route.params.isContractor,
                fetchData: route.params.fetchData,
                clientID: route.params.isContractor
                  ? clientsFullData.find((el) => {
                      return el.companyName === clientName;
                    }).id
                  : 0,
              });
            }
            // } else {
            //   console.log('step-7');
            //   FetchEstimationData(response.data.data.estimation_refno, from);
            // }
          } else {
            setSnackbarText(communication.InsertError);
            setSnackbarColor(theme.colors.error);
            setSnackbarVisible(true);
          }
        })
        .catch((e) => {
          console.log(e);
          setSnackbarText(communication.NetworkError);
          setSnackbarColor(theme.colors.error);
          setSnackbarVisible(true);
        });
    }
  };
  const InsertOtherClient = (selectedID) => {
    const params = {
      data: {
        Sess_UserRefno: userID,
        Sess_company_refno,
        Sess_branch_refno,
        client_user_refno: selectedID,
      },
    };
    Provider.createDFCommon(Provider.API_URLS.ClientAdd, params)
      .then((response) => {
        console.log(response.data);
        if (response.data && response.data.code === 200) {
          refRBSheet.current.close();
          FetchImageGalleryProductDetail();
        } else {
          setSnackbarText(communication.InsertError);
          setSnackbarColor(theme.colors.error);
          setSnackbarVisible(true);
        }
      })
      .catch((e) => {
        console.log(e);
        setSnackbarText(communication.NetworkError);
        setSnackbarColor(theme.colors.error);
        setSnackbarVisible(true);
      });
  };

  const CreateQuote = () => {
    let isValid = true;
    if (clientName.length === 0) {
      isValid = false;
      setCNError(true);
    }
    if (isValid) {
      InsertDesignEstimationEnquiry('get', '1');
    }
  };

  const CalculateSqFt = (lf, li, wf, wi) => {
    if (lf > 0 && li > -1 && wf > 0 && wi > -1) {
      const inches =
        ((parseInt(lf) * 12 + parseInt(li)) *
          (parseInt(wf) * 12 + parseInt(wi))) /
        144;
      setTotalSqft(parseFloat(inches).toFixed(4));
    } else {
      setTotalSqft(0);
    }
  };

  const CalculateSqFtData = (data) => {
    if (data) {
      const lengthFeetIn = data['length'].toString().split('.');
      const widthFeetIn = data['width'].toString().split('.');
      const lf = lengthFeetIn[0];
      const li = lengthFeetIn.length > 1 ? lengthFeetIn[1] : 0;
      const wf = widthFeetIn[0];
      const wi = widthFeetIn.length > 1 ? widthFeetIn[1] : 0;
      const inches =
        ((parseInt(lf) * 12 + parseInt(li)) *
          (parseInt(wf) * 12 + parseInt(wi))) /
        144;
      return parseFloat(inches).toFixed(4);
    } else {
      return 0;
    }
  };

  const CreateNumberDropdown = (startCount, endCount) => {
    let arrNumbers = [];
    for (var i = startCount; i <= endCount; i++) {
      arrNumbers.push(i.toString());
    }
    return arrNumbers;
  };

  const onClientNameSelected = (selectedItem) => {
    setClientName(selectedItem);
    setCNError(false);
  };

  const onCompanyNameSelected = (selectedItem) => {
    setCompanyName(selectedItem);
    setCONError(false);
    FetchOtherClients(selectedItem, 'company');
  };

  const onMobileNumberSelected = (selectedItem) => {
    setMobileNo(selectedItem);
    setMNError(false);
    FetchOtherClients(selectedItem, 'mobile');
  };

  const onLengthFeetSelected = (selectedItem) => {
    setLengthFeet(selectedItem);
    CalculateSqFt(selectedItem, lengthInches, widthFeet, widthInches);
  };

  const onLengthInchesSelected = (selectedItem) => {
    setLengthInches(selectedItem);
    CalculateSqFt(lengthFeet, selectedItem, widthFeet, widthInches);
  };

  const onWidthFeetSelected = (selectedItem) => {
    setWidthFeet(selectedItem);
    CalculateSqFt(lengthFeet, lengthInches, selectedItem, widthInches);
  };

  const onWidthInchesSelected = (selectedItem) => {
    setWidthInches(selectedItem);
    CalculateSqFt(lengthFeet, lengthInches, widthFeet, selectedItem);
  };

  //#endregion

  return (
    <View style={[Styles.flex1]}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        enabled
      >
        <ScrollView
          style={[Styles.flex1, Styles.backgroundColor, { marginBottom: 64 }]}
          contentInsetAdjustmentBehavior='automatic'
          keyboardShouldPersistTaps='handled'
          nestedScrollEnabled
        >
          <Image
            source={{ uri: route.params.data.designImage }}
            style={[Styles.width100per, { height: 192 }]}
          />
          <View style={[Styles.flexColumn, Styles.border1, Styles.marginTop16]}>
            <View
              style={[
                Styles.flexRow,
                Styles.borderBottom1,
                Styles.padding16,
                Styles.flexAlignCenter,
              ]}
            >
              <Subheading style={[Styles.flex1, Styles.textSecondaryColor]}>
                Design Code
              </Subheading>
              <Subheading style={[Styles.flex1]}>
                {selectedData.designNumber}
              </Subheading>
            </View>
            <View
              style={[
                Styles.flexRow,
                Styles.borderBottom1,
                Styles.padding16,
                Styles.flexAlignCenter,
              ]}
            >
              <Subheading style={[Styles.flex1, Styles.textSecondaryColor]}>
                Design Type
              </Subheading>
              <Subheading style={[Styles.flex1]}>
                {selectedData.designTypeName}
              </Subheading>
            </View>
            <View
              style={[
                Styles.flexRow,
                Styles.borderBottom1,
                Styles.padding16,
                Styles.flexAlignCenter,
              ]}
            >
              <Subheading style={[Styles.flex1, Styles.textSecondaryColor]}>
                Category Name
              </Subheading>
              <Subheading style={[Styles.flex1]}>
                {selectedData.categoryName}
              </Subheading>
            </View>
            <View
              style={[Styles.flexRow, Styles.padding16, Styles.flexAlignCenter]}
            >
              <Subheading style={[Styles.flex1, Styles.textSecondaryColor]}>
                Product Name
              </Subheading>
              <Subheading style={[Styles.flex1]}>
                {selectedData.productName}
              </Subheading>
            </View>
          </View>
          {route.params.isContractor && (
            <View
              style={[Styles.padding16, Styles.paddingBottom0, { zIndex: 10 }]}
            >
              <Dropdown
                label='Client Name'
                data={
                  selectedData.client_data
                    ? Object.values(selectedData?.client_data)
                    : clients
                }
                onSelected={onClientNameSelected}
                isError={errorCN}
                selectedItem={clientName}
              />
              <HelperText type='error' visible={errorCN}>
                {communication.InvalidClient}
              </HelperText>
              <View
                style={[
                  Styles.flexRow,
                  Styles.marginTop8,
                  { justifyContent: 'space-between' },
                ]}
              >
                <Button
                  mode='outlined'
                  onPress={() => refRBSheet.current.open()}
                >
                  Search & Add
                </Button>
                <Button
                  mode='contained'
                  onPress={() => {
                    navigation.navigate('AddClientScreen', {
                      type: 'client',
                      fetchData: FetchImageGalleryProductDetail,
                    });
                  }}
                >
                  Create New
                </Button>
              </View>
            </View>
          )}
          <View style={[Styles.paddingHorizontal16, Styles.paddingBottom16]}>
            <Subheading style={[Styles.marginTop16]}>Length</Subheading>
            <View style={[Styles.flexRow, Styles.flexAlignCenter]}>
              <View
                style={[Styles.paddingStart0, Styles.paddingEnd8, Styles.flex5]}
              >
                <Dropdown
                  label='Feet'
                  data={CreateNumberDropdown(1, 50)}
                  onSelected={onLengthFeetSelected}
                  selectedItem={lengthFeet}
                />
              </View>
              <Text style={[Styles.flex1, Styles.paddingStart4]}>ft</Text>
              <View
                style={[Styles.paddingStart8, Styles.paddingEnd0, Styles.flex5]}
              >
                <Dropdown
                  label='Inches'
                  data={CreateNumberDropdown(0, 11)}
                  onSelected={onLengthInchesSelected}
                  selectedItem={lengthInches}
                />
              </View>
              <Text style={[Styles.flex1_5, Styles.paddingStart4]}>inch</Text>
            </View>
            <Subheading style={[Styles.marginTop32]}>Width / Height</Subheading>
            <View
              style={[
                Styles.flexRow,
                Styles.flexAlignCenter,
                Styles.marginBottom32,
              ]}
            >
              <View
                style={[Styles.paddingStart0, Styles.paddingEnd8, Styles.flex5]}
              >
                <Dropdown
                  label='Feet'
                  data={CreateNumberDropdown(1, 50)}
                  onSelected={onWidthFeetSelected}
                  selectedItem={widthFeet}
                />
              </View>
              <Text style={[Styles.flex1, Styles.paddingStart4]}>ft</Text>
              <View
                style={[Styles.paddingStart8, Styles.paddingEnd0, Styles.flex5]}
              >
                <Dropdown
                  label='Inches'
                  data={CreateNumberDropdown(0, 11)}
                  onSelected={onWidthInchesSelected}
                  selectedItem={widthInches}
                />
              </View>
              <Text style={[Styles.flex1_5, Styles.paddingStart4]}>inch</Text>
            </View>
            <TextInput
             mode="outlined"
              label='Total (Sq.Ft.)'
              value={totalSqFt}
              editable={false}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
      <View
        style={[
          Styles.backgroundColor,
          Styles.width100per,
          Styles.marginTop32,
          Styles.padding16,
          { position: 'absolute', bottom: 0, elevation: 3 },
        ]}
      >
        {route.params.isContractor ? (
          <Card.Content>
            <Button mode='contained' onPress={() => CreateQuote()}>
              Create Quote
            </Button>
          </Card.Content>
        ) : (
          <Card.Content
            style={[Styles.flexRow, { justifyContent: 'space-between' }]}
          >
            <Button mode='outlined' onPress={() => AddMoreDesigns()}>
              Add More
            </Button>
            <Button
              mode='contained'
              onPress={() => InsertDesignEstimationEnquiry('get', '1')}
            >
              Get Estimation
            </Button>
          </Card.Content>
        )}
      </View>
      <RBSheet
        ref={refRBSheet}
        closeOnDragDown={true}
        closeOnPressMask={true}
        dragFromTopOnly={true}
        height={640}
        animationType='fade'
        customStyles={{
          wrapper: { backgroundColor: 'rgba(0,0,0,0.5)' },
          draggableIcon: { backgroundColor: '#000' },
        }}
      >
        <ScrollView
          style={[Styles.flex1, Styles.backgroundColor]}
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps='handled'
          nestedScrollEnabled
        >
          <View
            style={[Styles.flex1, Styles.backgroundColor, Styles.padding16]}
          >
            <View style={[Styles.flexColumn]}>
              <AutocompleteDropdown
                clearOnFocus={false}
                closeOnBlur={true}
                direction='down'
                suggestionsListContainerStyle={{
                  borderColor: theme.colors.border,
                  borderWidth: 1,
                }}
                inputContainerStyle={{
                  backgroundColor: theme.colors.textLight,
                  borderBottomColor: errorCON
                    ? theme.colors.error
                    : theme.colors.textfield,
                  borderBottomWidth: 1,
                }}
                textInputProps={{
                  placeholder: 'Company Name',
                  value: companyName,
                  placeholderTextColor: errorCON
                    ? theme.colors.error
                    : theme.colors.textSecondary,
                  onChangeText: onCompanyNameSelected,
                }}
                renderItem={(item) => (
                  <View style={[Styles.paddingVertical16]}>
                    <Text
                      style={{
                        color: theme.colors.text,
                        paddingHorizontal: 16,
                      }}
                    >
                      {item ? item.title : ''}
                    </Text>
                  </View>
                )}
                onClear={() => {
                  setIsButtonDisabled(true);
                  setCompanyName('');
                  setCompanyData([]);
                }}
                onSelectItem={(item) => {
                  if (item) {
                    setIsButtonDisabled(false);
                    setCompanyName(item.title);
                  }
                }}
                dataSet={companyData}
              />
              <HelperText type='error' visible={errorCON}>
                {communication.InvalidClient}
              </HelperText>
              <AutocompleteDropdown
                clearOnFocus={false}
                closeOnBlur={true}
                direction='down'
                suggestionsListContainerStyle={{
                  borderColor: theme.colors.border,
                  borderWidth: 1,
                }}
                inputContainerStyle={{
                  backgroundColor: theme.colors.textLight,
                  borderBottomColor: errorMN
                    ? theme.colors.error
                    : theme.colors.textfield,
                  borderBottomWidth: 1,
                }}
                textInputProps={{
                  placeholder: 'Mobile No',
                  value: mobileno,
                  placeholderTextColor: errorMN
                    ? theme.colors.error
                    : theme.colors.textSecondary,
                  onChangeText: onMobileNumberSelected,
                }}
                renderItem={(item) => (
                  <View style={[Styles.paddingVertical8]}>
                    <Text
                      style={{
                        color: theme.colors.text,
                        paddingHorizontal: 16,
                      }}
                    >
                      {item ? item.title : ''}
                    </Text>
                    <Text
                      style={{
                        color: theme.colors.textSecondary,
                        paddingHorizontal: 16,
                      }}
                    >
                      {item ? item.contact : ''}
                    </Text>
                  </View>
                )}
                onClear={() => {
                  setIsButtonDisabled(true);
                  setMobileNo('');
                  setMobileNoData([]);
                }}
                onSelectItem={(item) => {
                  if (item) {
                    setIsButtonDisabled(false);
                    setMobileNo(item.title);
                  }
                }}
                dataSet={mobilenoData}
              />
              <HelperText type='error' visible={errorMN}>
                {communication.InvalidClient}
              </HelperText>
            </View>
            <Button
              mode='contained'
              disabled={isButtonDisabled}
              style={[Styles.marginTop32, { zIndex: -1 }]}
              onPress={SearchClient}
            >
              Search
            </Button>
            <View
              style={[Styles.flexColumn, Styles.border1, Styles.marginTop16]}
            >
              {otherClients &&
                otherClients.map((v, k) => {
                  return (
                    <View
                      style={[
                        Styles.flexRow,
                        Styles.padding16,
                        Styles.flexAlignCenter,
                        Styles.borderBottom1,
                        { justifyContent: 'space-between' },
                      ]}
                    >
                      <View style={[Styles.flexColumn]}>
                        <Text style={{ color: theme.colors.text }}>
                          {v.Search_company_name}
                        </Text>
                        <Text style={{ color: theme.colors.text }}>
                          {v.Search_mobile_no}
                        </Text>
                      </View>
                      <Button
                        mode='contained'
                        disabled={isButtonDisabled}
                        onPress={() => InsertOtherClient(v.Search_user_refno)}
                      >
                        Add
                      </Button>
                    </View>
                  );
                })}
            </View>
          </View>
        </ScrollView>
      </RBSheet>
      <Snackbar
        visible={snackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
        duration={3000}
        style={{ backgroundColor: snackbarColor }}
      >
        {snackbarText}
      </Snackbar>
    </View>
  );
};

export default EstimationPreviewScreen;
