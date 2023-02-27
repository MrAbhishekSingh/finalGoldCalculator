import * as React from 'react';
import {View, StatusBar, ImageBackground} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import AllBils from '../screen/AllBils';
import CreateBill from '../screen/Home';
import {Avatar, Box, Text} from 'native-base';
import {Image} from 'react-native-svg';

function SplashScreenImage({navigation}) {
  const img = require('../assetes/transLogo.png');
  setTimeout(() => {
    navigation.replace('All Bills');
  }, 2000);

  return (
    <>
      <StatusBar
        barStyle="dark-content"
        hidden={false}
        backgroundColor="transparent"
        translucent={true}
      />
      <Box
        flex="1"
        width="100%"
        justifyContent="center"
        alignItems="center"
        alignSelf="center" // bg="primary.500"
        bg="primary.50">
        <Avatar
          style={{
            shadowOffset: {width: -1, height: 1},
            shadowOpacity: 0.3,
            shadowRadius: 3,
            elevation: 10,
            borderWidth: 5,
            borderColor:'#fff'
          }}
          height={300}
          width={300}
          bg="muted.600"
          source={img}
        />
        <Text
          style={{
            textShadowColor: 'rgba(0, 0, 0, 0.75)',
            textShadowOffset: {width: -1, height: 1},
            textShadowRadius: 10,
          }}
          fontSize="40"
          fontWeight="900"
          color="muted.800"
          letterSpacing="lg">
          RAMAKANT
        </Text>
        <Text
          fontSize="20"
          fontWeight="bold"
          color="muted.800"
          letterSpacing="lg">
          -- JEWELLERS --
        </Text>
      </Box>
    </>
  );
}

const Stack = createNativeStackNavigator();

function Navigations() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="SplashScreen"
        screenOptions={
          {
            // headerShown: false,
          }
        }>
        <Stack.Screen
          options={{headerShown: false}}
          name="SplashScreen"
          component={SplashScreenImage}
        />
        <Stack.Screen name="All Bills" component={AllBils} />
        <Stack.Screen name="Create Bill" component={CreateBill} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
export default Navigations;
