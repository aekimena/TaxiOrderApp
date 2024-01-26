import {
  Keyboard,
  PermissionsAndroid,
  Pressable,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import Geolocation from 'react-native-geolocation-service';
import MapView, {Marker, PROVIDER_GOOGLE, Polyline} from 'react-native-maps';
import IonIcons from 'react-native-vector-icons/Ionicons';
import SearchModal from '../components/searchModal';
import {mapStyle} from '../constants/mapStyle';
import axios from 'axios';
import OverlayComp from '../components/OverlayComp';

// request location permission android. you should do the same for ios
const requestLocationPermission = async () => {
  try {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      {
        title: 'Geolocation Permission',
        message: 'Can we access your location?',
        buttonNeutral: 'Ask Me Later',
        buttonNegative: 'Cancel',
        buttonPositive: 'OK',
      },
    );
    console.log('granted', granted);
    if (granted === 'granted') {
      console.log('You can use Geolocation');
      return true;
    } else {
      console.log('You cannot use Geolocation');
      return false;
    }
  } catch (err) {
    return false;
  }
};

// marker for user's location
const CustomLocMarker = () => {
  return (
    <View style={{gap: 10, alignItems: 'center'}}>
      <View style={styles.markerTxt}>
        <Text style={{color: '#222', fontWeight: 'bold', fontSize: 15}}>
          My Location
        </Text>
      </View>
      <IonIcons name="person" color="#49A8E0" size={25} />
    </View>
  );
};

// marker for destination
const CustomDestMarker = () => {
  return (
    <View style={{gap: 10, alignItems: 'center'}}>
      <View style={styles.destMarker}>
        <Text style={styles.destMarkerTxt}>Command secondary school</Text>
      </View>
      <IonIcons name="location" color="#49A8E0" size={25} />
    </View>
  );
};

const Home = () => {
  const [locationLoading, setLocationLoading] = useState(false);
  const [region, setRegion] = useState(null);
  const [userLoc, setUserLoc] = useState(null);
  // dummy destination
  const dummyRegion = {
    latitude: 37.30320289751253,
    latitudeDelta: 0.21012816798118195,
    longitude: -122.02801594510674,
    longitudeDelta: 0.19999992102383146,
  };
  const [isModalVisible, setModalVisible] = useState(false);
  const [textSearch, setTextSearch] = useState('');
  const [destName, setDestName] = useState('To Where?');
  const mapRef = useRef(null);
  const [isDesSelected, setDesSelected] = useState(false);

  const [keyboardStatus, setKeyboardStatus] = useState(false);

  // useffect to hide bottom tab when the keyboard is active

  useEffect(() => {
    const showTab = Keyboard.addListener('keyboardDidShow', () => {
      setKeyboardStatus(true);
    });
    const hideTab = Keyboard.addListener('keyboardDidHide', () => {
      setKeyboardStatus(false);
    });

    return () => {
      showTab.remove();
      hideTab.remove();
    };
  }, []);

  // function for map zoom in

  function ZoomIn() {
    mapRef.current.animateToRegion(
      {
        ...region,
        latitudeDelta: region.latitudeDelta / 2,
        longitudeDelta: region.longitudeDelta / 2,
      },
      2 * 1000,
    );
  }

  // function for map zoom out
  function ZoomOut() {
    mapRef.current.animateToRegion(
      {
        ...region,
        latitudeDelta: region.latitudeDelta * 2,
        longitudeDelta: region.longitudeDelta * 2,
      },
      2 * 1000,
    );
  }

  const showLocation = () => {
    try {
      setLocationLoading(true);
      console.log('Loading...'); // dummy loader
      const result = requestLocationPermission();
      result.then(res => {
        console.log('res is:', res);
        if (res) {
          Geolocation.getCurrentPosition(
            position => {
              // set the current user location
              setUserLoc({
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
                latitudeDelta: 0.2,
                longitudeDelta: 0.2,
              });
              setLocationLoading(false);
              console.log('Loading stopped...'); // dummy loader
            },
            error => {
              // See error code charts below.
              console.log(error.code, error.message);
              setLocationLoading(false);
              console.log('Loading stopped...');
            },
            {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
          );
        }
      });
    } catch (error) {
      console.log(error);
    }
  };

  // show user's location when component mounts
  useEffect(() => {
    showLocation();
  }, []);

  // handle destination search. you need a valid API key to continue
  const handleSearch = async text => {
    setTextSearch(text);
    const requestData = {
      textQuery: text,
    };

    const headers = {
      'Content-Type': 'application/json',
      'X-Goog-Api-Key': API_KEY,
      'X-Goog-FieldMask': 'places.displayName,places.formattedAddress',
    };

    axios
      .post('https://places.googleapis.com/v1/places:searchText', requestData, {
        headers,
      })

      .then(response => {
        console.log(response.data); // do something with the response
      })
      .catch(error => {
        console.error('Error:', error);
      });
  };
  return (
    <SafeAreaView style={{flex: 1}}>
      <StatusBar
        translucent
        backgroundColor={isModalVisible ? 'rgba(0,0,0,0.7)' : 'transparent'}
      />
      <SearchModal
        // all these props should be in a context api
        isModalVisible={isModalVisible}
        setModalVisible={setModalVisible}
        inputText={textSearch}
        handleSearch={handleSearch}
        setDestName={setDestName}
        setDesSelected={setDesSelected}
      />
      {locationLoading ? (
        <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
          <Text>Loading..</Text>
        </View>
      ) : (
        <View style={{flex: 1}}>
          <MapView
            ref={mapRef}
            provider={PROVIDER_GOOGLE}
            customMapStyle={mapStyle}
            style={{flex: 1}}
            region={userLoc}
            onRegionChangeComplete={region => {
              setRegion(region);
            }}
            showsCompass={false}>
            {isDesSelected && (
              <Polyline
                coordinates={[userLoc, dummyRegion]}
                strokeColor="#49A8E0"
                strokeWidth={3}
              />
            )}
            <Marker coordinate={userLoc}>
              <CustomLocMarker />
            </Marker>
            {isDesSelected && (
              <Marker coordinate={dummyRegion}>
                <CustomDestMarker />
              </Marker>
            )}
          </MapView>

          <OverlayComp
            // these props should be in a context api
            userLoc={userLoc}
            zoomIn={ZoomIn}
            zoomOut={ZoomOut}
            mapRef={mapRef}
          />
        </View>
      )}
      {/* only show if keyboard isn't shown */}
      {!keyboardStatus && (
        <View style={styles.actionContainer}>
          <View style={styles.inputContainer}>
            <View style={styles.leftIconCont}>
              <IonIcons name="location-outline" color="#222" size={22} />
            </View>
            <View>
              <Text style={{color: '#222', fontSize: 20, fontWeight: '500'}}>
                My Location
              </Text>
            </View>
          </View>
          <View style={styles.inputContainer}>
            <View style={styles.leftIconCont}>
              <IonIcons name="arrow-forward-outline" color="#222" size={22} />
            </View>
            <Pressable style={{flex: 1}} onPress={() => setModalVisible(true)}>
              <Text style={{color: '#222', fontSize: 20}}>{destName}</Text>
            </Pressable>
            <View style={{flexDirection: 'row', alignItems: 'center', gap: 20}}>
              <IonIcons name="home-outline" color="#222" size={22} />
              <IonIcons name="briefcase-outline" color="#222" size={22} />
            </View>
          </View>
          <Pressable style={styles.btn}>
            <Text style={{color: '#fff', fontSize: 20, fontWeight: 'bold'}}>
              Continue
            </Text>
          </Pressable>
        </View>
      )}
    </SafeAreaView>
  );
};

export default Home;

const styles = StyleSheet.create({
  actionContainer: {
    backgroundColor: '#fff',
    height: 300,
    width: '100%',
    padding: 15,
    gap: 25,
    justifyContent: 'center',
  },
  inputContainer: {
    height: 65,
    width: '100%',
    backgroundColor: '#f5f5f5',
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 10,
    paddingHorizontal: 15,
    gap: 15,
  },

  flexRowBtw: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  markerTxt: {
    backgroundColor: '#fff',
    elevation: 2,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    padding: 10,
  },
  destMarker: {
    backgroundColor: '#fff',
    elevation: 2,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    padding: 10,
    maxWidth: 150,
  },
  destMarkerTxt: {
    color: '#222',
    fontWeight: 'bold',
    fontSize: 15,
    textAlign: 'center',
  },
  btn: {
    backgroundColor: '#49A8E0',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 15,
    borderRadius: 10,
  },
});
