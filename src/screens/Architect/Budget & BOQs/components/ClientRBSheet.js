import { View, Text, ScrollView } from 'react-native';
import React from 'react';
import { HelperText, Button } from 'react-native-paper';
import RBSheet from 'react-native-raw-bottom-sheet';
import { AutocompleteDropdown } from 'react-native-autocomplete-dropdown';
import Provider from '../../../../api/Provider';
import { theme } from '../../../../theme/apptheme';
import { Styles } from '../../../../styles/styles';
import { communication } from '../../../../utils/communication';
const ClientRBSheet = ({
  refRBSheet,
  unload,
  fetchClients,
  userID,
  Sess_company_refno,
}) => {
  const [mobilenoData, setMobileNoData] = React.useState([]);
  const [mobileno, setMobileNo] = React.useState('');
  const [errorMN, setMNError] = React.useState(false);
  const [isButtonDisabled, setIsButtonDisabled] = React.useState(true);
  const [companyData, setCompanyData] = React.useState([]);
  const [companyName, setCompanyName] = React.useState('');
  const [otherClients, setOtherClients] = React.useState([]);
  const [errorCON, setCONError] = React.useState(false);
  const onCompanyNameSelected = (selectedItem) => {
    setCompanyName(selectedItem);
   
    setCONError(false);
    FetchOtherClients(selectedItem, 'company');
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

  const onMobileNumberSelected = (selectedItem) => {
    setMobileNo(selectedItem);
    setMNError(false);
    FetchOtherClients(selectedItem, 'mobile');
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
        if (response.data && response.data.code === 200) {
          refRBSheet.current.close();
          fetchClients();
        } else {
          unload(communication.InsertError, theme.colors.error);
        }
      })
      .catch((e) => {
        console.log(e);
        unload(communication.NetworkError, theme.colors.error);
      });
  };
  return (
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
        <View style={[Styles.flex1, Styles.backgroundColor, Styles.padding16]}>
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
                onChangeText: (e) => {
                  onCompanyNameSelected(e);
                },
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
          <View style={[Styles.flexColumn, Styles.border1, Styles.marginTop16]}>
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
  );
};

export default ClientRBSheet;
