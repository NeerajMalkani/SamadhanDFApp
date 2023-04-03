import React, { useState, useEffect } from 'react';
import { View, Text } from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import MapView, { Marker } from 'react-native-maps';
import Geolib from 'geolib';

const App = () => {
  const [permission, setPermission] = useState(false);
  const [location, setLocation] = useState(null);
  const [distance, setDistance] = useState(0);

  const handleLocation = (position) => {
    const { latitude, longitude } = position.coords;
    const newLocation = { latitude, longitude };
    if (location) {
      const newDistance = Geolib.getDistance(location, newLocation);
      setDistance(distance + newDistance);
    }
    setLocation(newLocation);
  };

  useEffect(() => {
    Geolocation.requestAuthorization();
    Geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setLocation({ latitude, longitude });
      },
      (error) => {
        console.log(error);
      },
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
    );
    Geolocation.watchPosition(
      handleLocation,
      (error) => {
        console.log(error);
      },
      { enableHighAccuracy: true, distanceFilter: 10 }
    );
  }, []);

  useEffect(() => {
    AsyncStorage.setItem('distance', distance.toString());
  }, [distance]);

  return (
    <View>
      <MapView style={{ height: 400 }} initialRegion={{ latitude: 37.78825, longitude: -122.4324, latitudeDelta: 0.0922, longitudeDelta: 0.0421 }}>
        {location && <Marker coordinate={location} />}
     
