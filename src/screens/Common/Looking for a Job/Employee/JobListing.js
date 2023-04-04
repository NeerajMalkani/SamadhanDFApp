import { Text, View } from 'react-native';
import React, { useState, useEffect } from 'react';
import { ScrollView } from 'react-native-gesture-handler';
import { Styles } from '../../../../styles/styles';
import { HelperText, List, Chip, Snackbar } from 'react-native-paper';
import Provider from '../../../../api/Provider';
import Dropdown from '../../../../components/Dropdown';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useIsFocused } from '@react-navigation/native';
import { theme } from '../../../../theme/apptheme';
import DFButton from "../../../../components/Button";

let userID = null;
const Jobs = ({ data }) => {
  return (
    <View
      style={[
        Styles.padding10,
        Styles.border1,
        { position: 'relative' },
        Styles.marginBottom16,
      ]}
    >
      <View style={[Styles.width100per, Styles.flexRow]}>
        <View
          style={[
            { width: 50, height: 50 },
            Styles.backgroundSecondaryLightColor,
            { marginRight: 15 },
          ]}
        >
          <Icon
            name='account'
            style={{ alignSelf: 'center' }}
            color='#D5DBDF'
            size={50}
          />
        </View>
        <View style={[Styles.width70per]}>
          <Text
            style={{
              fontSize: 17,
            }}
          >
            {data.designation_name}
          </Text>
          <Text>{data.company_name}</Text>
        </View>
      </View>
      <View style={[Styles.marginTop16]}>
        <Chip mode='outlined'>
          <Text style={{ fontSize: 14 }}>
            Min Experience: {data.experience_year} years{' '}
            {data.experience_month + ' '}
            months
          </Text>
        </Chip>

        <Chip mode='outlined' style={{ marginTop: 5 }}>
          <Text style={{ fontSize: 14, marginTop: 10 }}>
            Salary: {data.ctc_salary}/month
          </Text>
        </Chip>
      </View>
      <Text style={{ marginTop: 16 }}>
        Job Location: {Object.values(data.job_locations).join(',')}
      </Text>
      <View style={{ marginBottom: 50 }} />
      {/* <Text
        style={{ position: 'absolute', bottom: 5, left: 200, color: 'gray' }}
      >
        posted 5 days ago
      </Text> */}
    </View>
  );
};
const JobListing = ({ route, navigation }) => {
  const [snackbar, setSnackbar] = useState(false);
  const [snackbarType, setSnackbarType] = useState('info');
  const [snackbarText, setSnackbarText] = useState('');
  const isFocused = useIsFocused();
  const [filters, setFilters] = useState({
    designation_refno: '0',
    state_refno: '0',
    district_refno: '0',
  });
  const [isButtonLoading, setIsButtonLoading] = useState(false);
  const [jobs, setJobs] = useState([]);
  const [designations, setDesignations] = useState([]);
  const [states, setStates] = useState([]);
  const [districts, setDistricts] = useState([]);
  const fetchDesignation = () => {
    Provider.createDFCommon(Provider.API_URLS.getdesignationname_employeeform, {
      data: {
        Sess_UserRefno: userID,
        designation_refno: 'all',
      },
    })
      .then((res) => setDesignations(res.data.data))
      .catch((error) => console.log(error));
  };
  const GetUserID = async () => {
    try {
      const userData = await AsyncStorage.getItem('user');
      if (userData !== null) {
        userID = JSON.parse(userData).UserID;
        fetchState();
        fetchDesignation();
      } else {
        navigation.navigate('LoginScreen');
      }
    } catch (error) {
      console.log(error);
    }
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
        Sess_UserRefno: userID,
        state_refno,
      },
    })
      .then((res) => {
        if (res.data.data) setDistricts(res.data.data);
      })
      .catch((error) => console.log(error));
  };
  const search = () => {
    setIsButtonLoading(true);
    if (
      filters.designation_refno === '0' &&
      filters.district_refno === '0' &&
      filters.state_refno === '0'
    ) {
      setSnackbar(true);
      setSnackbarType(theme.colors.error);
      setSnackbarText('Please input atleast 1 field to search');
      return;
    }
    const params = {
      designation_refno:
        filters.designation_refno === '0'
          ? '0'
          : designations.find(
              (item) => item.designation_name === filters.designation_refno,
            ).designation_refno,
      state_refno:
        filters.state_refno === '0'
          ? '0'
          : states.find((item) => item.state_name === filters.state_refno)
              .state_refno,
      district_refno:
        filters.district_refno === '0'
          ? '0'
          : districts.find(
              (item) => item.district_name === filters.district_refno,
            ).district_refno,
      Sess_UserRefno: userID,
    };
    //console.log('here');
    Provider.createDFCommon(Provider.API_URLS.employee_job_search, params)
      .then((res) => {
        setIsButtonLoading(false);
        if (res.data.data) {
          setJobs(res.data.data);
        } else {
          setSnackbar(true);
          setSnackbarType(theme.colors.backdrop);
          setSnackbarText('No Jobs Available');
        }
      })
      .catch((error) => {
        console.log(error);
        setIsButtonLoading(false);
      });
  };
  useEffect(() => {
    if (isFocused) GetUserID();
  }, [isFocused]);
  const onChange = (text, name) => {
    setFilters((state) => ({ ...state, [name]: text }));
  };
  return (
    <View style={[Styles.flex1, Styles.backgroundColor]}>
      <ScrollView style={[Styles.flex1]} keyboardShouldPersistTaps='handled'>
        <View style={[Styles.padding16]}>
          <List.Section>
            <Dropdown
              label='Designation'
              data={designations?.map((obj) => obj.designation_name)}
              selectedItem={filters.designation_refno}
              onSelected={(text) => onChange(text, 'designation_refno')}
            />
            <List.Accordion title='More Filters'>
              <Dropdown
                label='State'
                data={states?.map((obj) => obj.state_name)}
                selectedItem={filters.state_refno}
                onSelected={(text) => {
                  onChange(text, 'state_refno');
                  fetchDistricts(
                    states.find((obj) => obj.state_name === text).state_refno,
                  );
                }}
              />
              <Dropdown
                label='City'
                data={districts?.map((obj) => obj.district_name)}
                selectedItem={filters.district_refno}
                onSelected={(text) => {
                  onChange(text, 'district_refno');
                }}
              />
            </List.Accordion>
            {/* <Button mode='contained' onPress={() => search()}>
              Search
            </Button> */}
             <DFButton mode="contained" onPress={() => search()} title="Search" loader={isButtonLoading} />
            <HelperText>
              *Filling One Field is Mandatory to view Jobs
            </HelperText>
          </List.Section>
        </View>
        <View style={[Styles.padding16]}>
          {jobs?.map((obj) => (
            <Jobs data={obj} key={obj.empr_refno} />
          ))}
        </View>
      </ScrollView>
      <Snackbar
        visible={snackbar}
        onDismiss={() => setSnackbar(false)}
        duration={3000}
        style={{ backgroundColor: snackbarType }}
      >
        {snackbarText}
      </Snackbar>
    </View>
  );
};

export default JobListing;
