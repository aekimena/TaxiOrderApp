import {Pressable, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import IonIcons from 'react-native-vector-icons/Ionicons';

const SearchList = ({setDesSelected, setDestName, setModalVisible, item}) => {
  return (
    <Pressable
      style={{flexDirection: 'row', alignItems: 'center', gap: 15}}
      onPress={() => {
        setDesSelected(true);
        setDestName(item.location);
        setModalVisible(false);
      }}>
      <IonIcons name="location-outline" color="#fff" size={20} />
      <View style={{flex: 1}}>
        <Text style={{color: '#fff', fontSize: 20, lineHeight: 30}}>
          {item.location}
        </Text>
      </View>
    </Pressable>
  );
};

export default SearchList;

const styles = StyleSheet.create({});
