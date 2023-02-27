import {
  View,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  RefreshControl,
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
    getdata()
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
  }, [search,alldata]);

  useEffect(() => {
    getdata();
  }, []);
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
              <Box
                shadow={3}
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
                </HStack>
              </Box>
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
