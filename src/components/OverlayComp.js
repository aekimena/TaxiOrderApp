import {Pressable, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import IonIcons from 'react-native-vector-icons/Ionicons';

const OverlayComp = ({userLoc, mapRef, zoomIn, zoomOut}) => {
  return (
    <View style={[styles.overlay, {paddingTop: 40, paddingBottom: 30}]}>
      <View style={styles.flexRowBtw}>
        <View style={styles.mapIconCont}>
          <IonIcons name="menu" color="#222" size={30} />
        </View>
      </View>
      <View style={[styles.flexRowBtw, {alignItems: 'flex-end'}]}>
        <View style={{gap: 15}}>
          <Pressable style={styles.mapIconCont} onPress={zoomIn}>
            <IonIcons name="add" color="#222" size={30} />
          </Pressable>
          <Pressable style={styles.mapIconCont} onPress={zoomOut}>
            <IonIcons name="remove" color="#222" size={30} />
          </Pressable>
        </View>
        <Pressable
          style={styles.mapIconCont}
          onPress={() => mapRef.current.animateToRegion(userLoc, 2 * 1000)}>
          <IonIcons name="compass-outline" color="#222" size={30} />
        </Pressable>
      </View>
    </View>
  );
};

export default OverlayComp;

const styles = StyleSheet.create({
  overlay: {
    height: '100%',
    width: '100%',
    position: 'absolute',
    justifyContent: 'space-between',
    padding: 15,
  },
  mapIconCont: {
    height: 50,
    width: 50,
    borderRadius: 25,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
  },
  flexRowBtw: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});
