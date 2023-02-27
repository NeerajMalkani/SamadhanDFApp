import { Text, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Button } from 'react-native-paper';

import Provider from '../../../../api/Provider';
import { Styles } from '../../../../styles/styles';
import { useIsFocused } from '@react-navigation/native';
let userID = null;
const AreaOfInterest = ({ route, navigation }) => {
  const focused = useIsFocused();
  const [groups, setGroups] = useState([]);
  const goToForm = (obj) => {
    navigation.navigate('JobSeekerForm', { employergroup: obj });
  };
  const GetUserID = async () => {
    const userData = await AsyncStorage.getItem('user');
    if (userData !== null) {
      userID = JSON.parse(userData).UserID;
      fetchJobGroup();
    } else {
      navigation.navigate('LoginScreen');
    }
  };

  useEffect(() => {
    if (focused) GetUserID();
  }, [focused]);

  const fetchJobGroup = () => {
    Provider.createDFCommon(
      Provider.API_URLS.getemployergroupname_employeeform,
      {
        data: { Sess_UserRefno: userID, employergroup_refno: 'all' },
      },
    )
      .then((res) => setGroups(res.data.data))
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
      >
        Select Your Area Of Interest
      </Text>
      {groups.map((obj) => (
        <Button
          mode='contained'
          key={obj.employergroup_refno}
          compact={true}
          onPress={() => goToForm(obj)}
          style={{
            marginBottom: 15,
          }}
        >
          <Text>{obj.employergroup_name}</Text>
        </Button>
      ))}
    </View>
  );
};

export default AreaOfInterest;
