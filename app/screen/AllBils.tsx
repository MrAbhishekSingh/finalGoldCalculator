import {
  View,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  RefreshControl,
  Linking,
  Alert,
} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import {
  Avatar,
  Box,
  Divider,
  Heading,
  HStack,
  Text,
  Icon,
  Input,
  Spacer,
  VStack,
  Button,
} from 'native-base';
import {G, Path} from 'react-native-svg';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Share from 'react-native-share';
import RNFetchBlob from 'rn-fetch-blob';

const AllBils = ({navigation}) => {
  const [alldata, setAlldata] = useState();
  const [filterdata, setFilterdata] = useState();
  const [search, setSearch] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const wait = timeout => {
    // Defined the timeout function for testing purpose
    return new Promise(resolve => setTimeout(resolve, timeout));
  };

  const getdata = async () => {
    try {
      const myData = await AsyncStorage.getItem('LIST');
      if (myData !== null) {
        // We have data!!
        let localdata = JSON.parse(myData);
        setAlldata(localdata);
        console.log();
      }
    } catch (error) {
      // Error retrieving data
    }
  };
  const onRefresh = useCallback(() => {
    getdata();
    setIsRefreshing(true);
    wait(2000).then(() => setIsRefreshing(false));
  }, []);
  useEffect(() => {
    if (alldata) {
      if (alldata.length > 0) {
        let filteredData = alldata.filter(
          data =>
            data.name.toLowerCase().includes(search.toLowerCase()) ||
            data.phone.includes(search) ||
            data.bill_number.toLowerCase().includes(search.toLowerCase()),
        );
        setFilterdata(filteredData);
      }
    }
  }, [search, alldata]);

  useEffect(() => {
    getdata();
  }, []);

  const ShareData = async (item: { pdfFile: any; phone: string; }) => {
    let filePath = `${item.pdfFile}`
    console.log(item)
    RNFetchBlob.fs
      .readFile(filePath, 'base64')
      .then(data => {
        let img = "data:application/pdf;base64," + data
        let shareOptions = {
          title: 'Share via WhatsApp',
          message: '*RAMAKANT JEWELLERS*',
          type: 'image/jpeg',
          urls: [img],
          social: Share.Social.WHATSAPP,
          whatsAppNumber: '91' + item.phone,
        };
        Share.shareSingle(shareOptions)
          .then(resp => {
            console.log(resp);
          })
          .catch(_err =>
            Alert.alert('WhatsApp is not installed on the device.'),
          );
      })
      .catch(err => console.log(err));
  };
  console.log('filterdata',filterdata);
  
  return (
    <>
      <SafeAreaView style={{flex: 1, padding: 5, marginBottom: 5}}>
        <VStack w="100%" space={5} alignSelf="center">
          <Input
            value={search}
            onChangeText={text => setSearch(text)}
            bg="#fff"
            borderWidth="2"
            borderColor="muted.400"
            placeholder="Search Name, mobile & bill no."
            variant="filled"
            width="100%"
            borderRadius="10"
            py="1"
            px="2"
            InputLeftElement={
              <Icon size="4xl" viewBox="-130 20 800 400">
                <G fillRule="nonzero" stroke="none" strokeWidth={1} fill="none">
                  <Path
                    d="M508.5 481.6l-129-129c-2.3-2.3-5.3-3.5-8.5-3.5h-10.3C395 312 416 262.5 416 208 416 93.1 322.9 0 208 0S0 93.1 0 208s93.1 208 208 208c54.5 0 104-21 141.1-55.2V371c0 3.2 1.3 6.2 3.5 8.5l129 129c4.7 4.7 12.3 4.7 17 0l9.9-9.9c4.7-4.7 4.7-12.3 0-17zM208 384c-97.3 0-176-78.7-176-176S110.7 32 208 32s176 78.7 176 176-78.7 176-176 176z"
                    fill="#a3a3a3"
                  />
                </G>
              </Icon>
            }
          />
        </VStack>
        {filterdata?.length > 0 ? (
          <FlatList
            data={isRefreshing ? null : filterdata.reverse()}
            refreshing={isRefreshing}
            onRefresh={onRefresh}
            renderItem={({item, index}) => (
              <TouchableOpacity
                style={{elevation: 2}}
                onPress={() =>
                  navigation.navigate('Bill Details', {state: item})
                }>
                <Box
                  // shadow={3}
                  bg="#fff"
                  my="2"
                  borderRadius="10"
                  borderWidth="2"
                  _dark={{
                    borderColor: 'muted.50',
                  }}
                  borderColor="muted.400"
                  pl={['0', '4']}
                  pr={['0', '5']}
                  py="2">
                  <HStack
                    alignItems="center"
                    px="2"
                    space={[2, 3]}
                    justifyContent="space-between">
                    <VStack w="35%">
                      <Text
                        _dark={{
                          color: 'warmGray.50',
                        }}
                        color="coolGray.800"
                        bold>
                        {item.name}
                      </Text>
                      <Text
                        color="coolGray.600"
                        _dark={{
                          color: 'warmGray.200',
                        }}>
                        {item.phone}
                      </Text>
                    </VStack>
                    <Spacer />
                    <VStack w="40%">
                      <Text
                        _dark={{
                          color: 'warmGray.50',
                        }}
                        color="coolGray.800"
                        bold>
                        {'Bill no.'}
                      </Text>
                      <Text
                        color="coolGray.600"
                        _dark={{
                          color: 'warmGray.200',
                        }}>
                        {item.bill_number}
                      </Text>
                    </VStack>
                    <TouchableOpacity
                      onPress={()=>ShareData(item)}
                      style={{backgroundColor: 'transparent'}}
                      padding="0">
                      <Icon size="6xl" viewBox="-160 40 800 400">
                        <G
                          fillRule="nonzero"
                          stroke="none"
                          strokeWidth={1}
                          fill="none">
                          <Path
                            d="M379.56,131.67A172.4,172.4,0,0,0,256.67,80.73C161,80.73,83.05,158.64,83.05,254.42a173.47,173.47,0,0,0,23.2,86.82l-24.65,90,92.08-24.17a173.55,173.55,0,0,0,83,21.17h.07c95.73,0,173.69-77.91,173.69-173.69A172.73,172.73,0,0,0,379.53,131.7l0,0ZM256.72,399a144.17,144.17,0,0,1-73.52-20.14l-5.29-3.15L123.27,390l14.59-53.27-3.42-5.47a143.29,143.29,0,0,1-22.11-76.81C112.33,174.81,177.1,110,256.8,110A144.34,144.34,0,0,1,401.12,254.48c-.07,79.67-64.83,144.46-144.41,144.46v0ZM335.87,290.8c-4.32-2.2-25.68-12.67-29.65-14.12s-6.85-2.19-9.8,2.2-11.22,14.11-13.76,17-5.06,3.29-9.37,1.09-18.35-6.77-34.92-21.56c-12.88-11.5-21.61-25.74-24.15-30s-.29-6.71,1.92-8.83c2-1.93,4.32-5.06,6.51-7.6s2.88-4.32,4.32-7.26.74-5.42-.35-7.6-9.8-23.55-13.34-32.25c-3.49-8.51-7.12-7.32-9.79-7.47s-5.42-.13-8.29-.13a16,16,0,0,0-11.57,5.41c-4,4.32-15.2,14.86-15.2,36.22s15.54,42,17.72,44.91,30.61,46.76,74.14,65.54c10.34,4.44,18.42,7.11,24.72,9.18a60,60,0,0,0,27.32,1.71c8.35-1.23,25.68-10.49,29.31-20.62s3.63-18.83,2.55-20.62-3.91-3-8.29-5.22l0,0Z"
                            fill="#0db523"
                          />
                        </G>
                      </Icon>
                    </TouchableOpacity>
                  </HStack>
                </Box>
              </TouchableOpacity>
            )}
          />
        ) : (
          <>
            <Box alignItems="center" justifyContent="center">
              <Heading>No bill found</Heading>
              <Button
                onPress={() => navigation.navigate('Create Bill')}
                bg="#10b981"
                mt="5"
                size="lg">
                <Text
                  shadow={3}
                  fontSize="md"
                  fontWeight="bold"
                  color="warmGray.50"
                  letterSpacing="lg">
                  Create Bill
                </Text>
              </Button>
              <Button
                onPress={() => getdata()}
                bg="primary.400"
                mt="5"
                size="lg">
                <Text
                  shadow={3}
                  fontSize="md"
                  fontWeight="bold"
                  color="warmGray.50"
                  letterSpacing="lg">
                  Refresh
                </Text>
              </Button>
            </Box>
          </>
        )}
        <TouchableOpacity
          onPress={() => navigation.navigate('Create Bill')}
          style={{
            elevation: 10,
            borderWidth: 2,
            borderColor: '#059669',
            alignItems: 'center',
            justifyContent: 'center',
            width: 70,
            position: 'absolute',
            bottom: 50,
            right: 20,
            height: 70,
            backgroundColor: '#10b981',
            borderRadius: 100,
          }}>
          <Icon size="4xl" viewBox="-220 20 800 400">
            <G fillRule="nonzero" stroke="none" strokeWidth={1} fill="none">
              <Path
                d="M376 232H216V72c0-4.42-3.58-8-8-8h-32c-4.42 0-8 3.58-8 8v160H8c-4.42 0-8 3.58-8 8v32c0 4.42 3.58 8 8 8h160v160c0 4.42 3.58 8 8 8h32c4.42 0 8-3.58 8-8V280h160c4.42 0 8-3.58 8-8v-32c0-4.42-3.58-8-8-8z"
                fill="#fff"
              />
            </G>
          </Icon>
        </TouchableOpacity>
        <Text
          shadow={3}
          fontSize="md"
          fontWeight="bold"
          color="primary.900"
          letterSpacing="lg"
          position="absolute"
          bottom="5"
          right="4">
          Create Bill
        </Text>
      </SafeAreaView>
    </>
  );
};

export default AllBils;
