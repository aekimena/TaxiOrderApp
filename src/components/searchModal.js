import {
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import React from 'react';
import Modal from 'react-native-modal';
import IonIcons from 'react-native-vector-icons/Ionicons';
import SearchList from './SearchList';

// demo data
const data = [{id: 1, location: 'Command secondary school'}];

const SearchModal = ({
  isModalVisible,
  setModalVisible,
  inputText,
  handleSearch,
  setDestName,
  setDesSelected,
}) => {
  return (
    <View>
      <Modal isVisible={isModalVisible} backdropOpacity={0.7}>
        <View style={{flex: 1}}>
          <View style={styles.headers}>
            <Pressable onPress={() => setModalVisible(false)}>
              <IonIcons name="close" size={30} color="#fff" />
            </Pressable>

            <View style={styles.textInputContainer}>
              <View style={styles.leftIconCont}>
                <IonIcons name="search" color="#222" size={22} />
              </View>
              <TextInput
                style={styles.textinput}
                placeholder="Enter destination..."
                placeholderTextColor={'#444'}
                defaultValue={inputText}
                onChangeText={newTxt => handleSearch(newTxt)}
              />
            </View>
          </View>
          <View
            style={{
              flex: 1,
            }}>
            <FlatList
              data={data}
              keyExtractor={item => item.id}
              contentContainerStyle={{gap: 30, paddingVertical: 20}}
              renderItem={item => (
                <SearchList
                  {...item}
                  setDesSelected={setDesSelected}
                  setDestName={setDestName}
                  setModalVisible={setModalVisible}
                />
              )}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default SearchModal;

const styles = StyleSheet.create({
  textInputContainer: {
    flex: 1,
    height: 65,
    width: '100%',
    backgroundColor: '#f5f5f5',
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 10,
    paddingHorizontal: 15,
    gap: 15,
  },
  textinput: {
    height: '100%',
    width: '100%',
    color: '#222',
    fontSize: 20,
    fontWeight: '500',
    flex: 1,
  },
  headers: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
    paddingBottom: 15,
  },
});
