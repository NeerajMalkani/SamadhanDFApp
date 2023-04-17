import { Text, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Button } from 'react-native-paper';

import Provider from '../../../api/Provider';
import { Styles } from '../../../styles/styles';
import { useIsFocused } from '@react-navigation/native';
let userID = null;

const SelectGroupType = ({ route, navigation }) => {
  const [designation, setDesignation] = useState();
  const [groups, setGroups] = useState([]);
  const focused = useIsFocused();
  const goToForm = (obj) => {
    if (obj.jobgroup_refno === 1)
      navigation.navigate('AreaOfInterest', { jobgroup: obj });
    else navigation.navigate('JobPostingForm');
  };
  const GetUserID = async () => {
    const userData = await AsyncStorage.getItem('user');
    if (userData !== null) {
      userID = JSON.parse(userData).UserID;
      setDesignation(JSON.parse(userData).Sess_designation_refno);
      fetchJobGroup();
    } else {
      navigation.navigate('LoginScreen');
    }
  };
  useEffect(() => {
    if (focused) GetUserID();
  }, [focused]);

  const fetchJobGroup = () => {
    Provider.createDFCommon(Provider.API_URLS.getjobgroupname_employeeform, {
      data: { Sess_UserRefno: userID, jobgroup_refno: 'all' },
    })
      .then((res) => {
        setGroups(res.data.data);
      })
      .catch((error) => console.log(error));
  };

  return (
    <View style={[Styles.padding12]}>
      <Text
        style={{
          fontWeight: 'bold',
          textAlign: 'center',
          fontSize: 20,
          marginBottom: 100,
        }}
      ></Text>
      {designation === 1 || designation === 2 ? (
        <>
          <Button
            mode='contained'
            onPress={() => navigation.navigate('JobListingEmployer')}
            style={{
              marginBottom: 15,
            }}
          >
            Search Employee
          </Button>
          <Button
            mode='contained'
            onPress={() => navigation.navigate('JobPostingForm')}
            style={{
              marginBottom: 15,
            }}
          >
            Post a Job
          </Button>
        </>
      ) : (
        <>
          <Button
            mode='contained'
            onPress={() => navigation.navigate('AreaOfInterest')}
            style={{
              marginBottom: 15,
            }}
          >
            Update Your CV
          </Button>
          <Button
            mode='contained'
            onPress={() => navigation.navigate('JobListingEmployee')}
            style={{
              marginBottom: 15,
            }}
          >
            Search Job
          </Button>
        </>
      )}
    </View>
  );
};

export default SelectGroupType;
