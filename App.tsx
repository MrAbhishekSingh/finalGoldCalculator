import {View, Text, Platform, PermissionsAndroid, Alert} from 'react-native';
import React, { useEffect } from 'react';
import Navigations from './app/navigation/NavigationContainer';
import {extendTheme, NativeBaseProvider} from 'native-base';
import { LogBox } from 'react-native';
import RNFS from 'react-native-fs';
// 2. Extend the theme to include custom colors, fonts, etc
const newColorTheme = {
  brand: {
    900: '#8287af',
    800: '#7c83db',
    700: '#b3bef6',
  },
};
const theme = extendTheme({colors: newColorTheme});
const App = () => {
  const isPermitted = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        );
        if (granted) {
          RNFS.readDir(RNFS.ExternalStorageDirectoryPath)
            .then(result => {
              let path = '/storage/emulated/0/Download/RKJBILL';
              RNFS.mkdir(path).catch(error => {
                console.log(error);
              });
            })
            .catch(err => {
              console.log(err.message, err.code);
            });
        }
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (err) {
        Alert.alert('Write permission err', err);
        return false;
      }
    } else {
      return true;
    }
  };

  useEffect(() => {
    isPermitted();
  }, []);
  return (
    <NativeBaseProvider theme={theme}>
      <Navigations />
    </NativeBaseProvider>
  );
};

export default App;
