import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  Box,
  Button,
  Center,
  Checkbox,
  Divider,
  FormControl,
  Heading,
  HStack,
  Icon,
  Input,
  Pressable,
  ScrollView,
  Stack,
  Text,
  TextArea,
  VStack,
} from 'native-base';
import React, {useEffect, useState} from 'react';
import {
  SafeAreaView,
  TouchableOpacity,
  View,
  StyleSheet,
  Image,
  PermissionsAndroid,
  Platform,
  Alert,
  Dimensions,
  Modal,
  FlatList,
  TouchableHighlight,
} from 'react-native';
import RNFS from 'react-native-fs';
import RNHTMLtoPDF from 'react-native-html-to-pdf';
import Pdf from 'react-native-pdf';

const list = [
  'Sr. No.',
  'Item Name',
  'Weight(Gm.)',
  'Rate(10gm.)',
  'Making(%)',
  'Lobor',
  'Amount',
];
let milliseconds = new Date().valueOf();
let bill_genBill = `RKJ${milliseconds}`;

const CreateBill = () => {
  const [filePath, setFilePath] = useState('');
  const [modalVisible, setModalVisible] = React.useState(false);
  const [modalItem, setModalItem] = React.useState(false);
  const [amount, setAmount] = React.useState();
  const [totalAmount, setTotalAmount] = React.useState();
  const [allList, setAllList] = React.useState([]);
  const [isSelected, setSelection] = useState(false);
  const [billNumber, setbillNumber] = useState('');
  const [values, setValues] = React.useState({
    ItemName: '',
    Weight: '',
    Rate: '',
    Making: '',
    Lobor: '',
    Amount: '',
    Lobor_per_gm: '',
  });
  const [customer, setcustomer] = React.useState({
    name: '',
    phone: '',
    address: '',
    billdetails: [],
    pdfFile: '',
    bill_number: bill_genBill,
  });

  const handleChange = (name: string, value: string) => {
    setValues({
      ...values,
      [name]: value,
    });
  };

  const handleChangeName = (name: string, value: string) => {
    setcustomer({
      ...customer,
      [name]: value,
    });
  };

  useEffect(() => {
    if (allList.length > 0) {
      var total = 0;
      for (var i = 0; allList.length > i; i++) {
        total += +allList[i].Amount;
      }
      setTotalAmount(total);
    }
  }, [allList]);

  useEffect(() => {
    if (amount) {
      setValues(values => ({
        ...values,
        Amount: amount,
      }));
    }
  }, [amount]);

  useEffect(() => {
    if (isSelected) {
      setValues(values => ({
        ...values,
        Lobor_per_gm: 'lobor per gram',
      }));
    }
  }, [isSelected]);

  useEffect(() => {
    let value = Number(values.Rate) / 10;
    let rateValue = value * Number(values.Weight);
    let totalValue =
      value * Number(values.Weight) +
      (Number(rateValue) * Number(values.Making)) / 100 +
      Number(values.Lobor);
    setAmount(totalValue);
  }, [values]);

  const saveFavorites = async () => {
    const myData = await AsyncStorage.getItem('LIST');
    let arr = JSON.parse(myData);
    let objNew = arr;
    let dataArr = [];
    if (arr == null || arr == undefined) {
      console.log('data null');
    } else {
      dataArr.push(...objNew, customer);
    }
    if (arr == null || arr == undefined) {
      let custData = [customer];
      await AsyncStorage.setItem('LIST', JSON.stringify(custData));
    } else {
      await AsyncStorage.setItem('LIST', JSON.stringify(dataArr));
    }
  };

  const createPDF = async () => {
    setcustomer(customer => ({
      ...customer,
      billdetails: allList,
    }));
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();

    const tableData = allList.map((item, index) => {
      return `<tr style="padding:10px ;background-color: rgb(194, 193, 196);width: 100%;height: 50px;color:black;font-size:1.7vw;font-family: 'Lucida Sans', 'Lucida Sans Regular', 'Lucida Grande', 'Lucida Sans Unicode', Geneva, Verdana, sans-serif;font-weight: 900;">
        <td style="width: 10%;">${index + 1}</td>
        <td style="width: 30%;">${item.ItemName}</td>
        <td style="width: 15%;">${item.Weight}</td>
        <td style="width: 15%;">${item.Rate}</td>
        <td style="width: 10%;">${item.Lobor}</td>
        <td style="width: 20%;">${item.Amount}</td>
     </tr>`;
    });
    let options = {
      //Content to print
      html: `
        <div style="background-image: url('/photo/transLogo.png'); background-repeat: no-repeat;">
            <div style="display: flex;">
                <div style="width:100%;display: flex;flex-direction: column;gap: 10px;padding: 10px;align-items: center;">
                    <span style="text-shadow: 2px 2px 5px gray;font-size:7vw;font-weight: 600;font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;">RAMAKANT JEWELLERS</span>
                    <span style="text-align: center;text-decoration: underline; text-shadow:2px 2px 5px gary;font-size:1.8vw;font-weight: 900;font-family: 'Times New Roman', Times, serif;">
                        Near Bank of Baroda Jagdishpur Chauraha, 
                        Pipraich, Kaptanganj Road, Kushinagar</br>
                        Phone no: +918303376242 ,
                        Email: sv3716358@gmail.com
                    </span>
                </div>
            </div>
            <div style="padding: 10px;display: flex;justify-content: center;">
                <span style="color: rgb(125, 175, 252);font-weight: 900;font-size: 26px;font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;">ESITIMATE</span>
            </div>
            <div style="display: flex;margin-bottom: 20px;">
                <div style="width:50%;display: flex;flex-direction: column;gap: 10px;padding: 10px;">
                    <span style="font-size:1.7vw;font-weight: 900;font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;">
                    Bill To :<br>
                    ${customer.name}</br>${customer.address}
                    </span>
                    <span style=" font-size:1.3vw; text-shadow:2px 2px 5px gary;font-weight: 600;font-family: 'Times New Roman', Times, serif;">
                     Contact No : ${customer.phone}
                    </span>
                </div>
                <div style="width:50%;display: flex;justify-content:flex-end;align-items: flex-end;">
                    <span style="font-size:1.7vw;font-weight: 900;font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;">
                        Invoice No : ${bill_genBill}<br>
                        Date : ${dd + '/' + mm + '/' + yyyy}
                        </span>
                </div>
            </div>
            <div style="width: 100%;">
                <table style="width: 100%;">
                    <tr style="background-color: rgb(125, 175, 252);width: 100%;height: 50px;color: #fff;font-size:2vw;">
                      <th style="width: 10%;">Sr. No.</th>
                      <th style="width: 30%;">Description</th>
                      <th style="width: 15%;">Gross Weight(gms)</th>
                      <th style="width: 15%;">Rates per 10gm. (Rs.)</th>
                      <th style="width: 10%;">Lobor</th>
                      <th style="width: 20%;">Amount (Rs.)</th>
                    </tr>
                    <div>
                      ${tableData}
                    </div>
                  </table>
                  <table style="width: 100%;">
                    <tr style="background-color: rgb(125, 175, 252);width: 100%;height: 50px;color: #fff;font-size:2vw;">
                        <th style="width: 80%;">Total</th>
                        <th style="width: 20%;">${
                          totalAmount ? totalAmount : 0
                        }</th>
                      </tr>
        
                  </table>
            </div>
            <div style="display: flex;justify-content: flex-end;">
                <div style="height:120px ;width:25%;display: flex;flex-direction: column;justify-content: space-between;padding:20px;">
                  <span style="color:black;font-weight: 900;font-size: 1.4vw;font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;">For. RAMAKANT JEWELLERS</span>
                  <span style="color:black;font-weight: 900;font-size: 1.4vw;font-family: Cambria, Cochin, Georgia, Times, 'Times New Roman', serif">Authorized Signatory</span>
                </div>
            </div>
        </div>
       `,
      fileName: 'test',
      directory: 'docs',
    };

    let file = await RNHTMLtoPDF.convert(options);
    const destinationPath = RNFS.DownloadDirectoryPath;
    const destinationFile =
      '/storage/emulated/0/Download/RKJBILL' + `/${bill_genBill}.pdf`;
    RNFS.copyFile(file.filePath, destinationFile).then(res => {
      console.log(destinationFile);
      setFilePath(destinationFile);
      setModalVisible(!modalVisible);
    });
    setcustomer(customer => ({
      ...customer,
      pdfFile: destinationFile,
    }));
    setcustomer(customer => ({
      ...customer,
      bill_number: bill_genBill,
    }));
    saveFavorites();
  };
  const submit = () => {
    if (
      values.ItemName !== null &&
      values.ItemName !== undefined &&
      values.ItemName !== ''
    ) {
      if (
        values.Weight !== null &&
        values.Weight !== undefined &&
        values.Weight !== ''
      ) {
        if (
          values.Rate !== null &&
          values.Rate !== undefined &&
          values.Rate !== ''
        ) {
          if (
            values.Lobor !== null &&
            values.Lobor !== undefined &&
            values.Lobor !== ''
          ) {
            setAllList([...allList, values]);
            setValues('');
            setModalItem(!modalItem);
          } else {
            Alert.alert('please fill all box');
          }
        } else {
          Alert.alert('please fill all box');
        }
      } else {
        Alert.alert('please fill all box');
      }
    } else {
      Alert.alert('please fill all box');
    }
  };

  const source = {uri: filePath, cache: true};
  const {width, height} = Dimensions.get('window');
  return (
    <>
      <SafeAreaView style={{flex: 1, padding: 5, marginBottom: 5}}>
        <ScrollView h="80">
          <Box my="1" justifyContent="center" alignItems="center">
            <Text
              fontSize="md"
              fontWeight="bold"
              color="primary.900"
              letterSpacing="lg">
              Customer Detail
            </Text>
          </Box>
          <Box alignItems="center">
            <Input
              value={customer.name}
              onChangeText={text => handleChangeName('name', text)}
              bg="muted.100"
              mb="2"
              placeholder="Name"
              w="100%"
            />
            <Input
              keyboardType="numeric"
              value={customer.phone}
              onChangeText={text => handleChangeName('phone', text)}
              bg="muted.100"
              mb="2"
              placeholder="Phone No."
              w="100%"
            />
            <TextArea
              value={customer.address}
              onChangeText={text => handleChangeName('address', text)}
              bg="muted.100"
              h={20}
              placeholder="Address"
              w="100%"
            />
          </Box>
          <Box
            borderRadius="3"
            my="2"
            p="2"
            flexDirection="row"
            bg="muted.100"
            shadow={3}
            justifyContent="space-between">
            <Text
              fontSize="md"
              fontWeight="medium"
              color="primary.900"
              letterSpacing="lg">
              ITEM LIST
            </Text>
            <TouchableOpacity onPress={() => setModalItem(!modalItem)}>
              <Box
                bg="success.500"
                borderRadius="3"
                paddingX="2"
                flexDirection="row">
                <Text
                  fontSize="lg"
                  fontWeight="bold"
                  color="primary.100"
                  marginRight="1"
                  letterSpacing="lg">
                  +
                </Text>
                <Text
                  fontSize="lg"
                  fontWeight="medium"
                  color="primary.100"
                  letterSpacing="lg">
                  ADD ITEM
                </Text>
              </Box>
            </TouchableOpacity>
          </Box>
          <Stack
            flexDirection="row"
            borderRadius="3"
            width="100%"
            // height="45%"
            height={height * 0.4}
            borderColor="muted.300"
            borderWidth="2px">
            <HStack flexDirection="column" width="30%" height="100%">
              {list.map((item, index) => (
                <Box
                  paddingLeft="2"
                  key={index}
                  flex="1"
                  justifyContent="center"
                  borderColor="muted.300"
                  borderWidth="1px">
                  <Text
                    fontSize="md"
                    fontWeight="extrabold"
                    color="primary.900">
                    {item}
                  </Text>
                </Box>
              ))}
            </HStack>
            <HStack width="70%" height="100%">
              <FlatList
                data={allList}
                horizontal
                // keyExtractor={index => index.toString()}
                renderItem={({item, index}) => {
                  return (
                    <>
                      <Box key={index} width={150} flexDirection="column">
                        <Box
                          paddingLeft="2"
                          flex="1"
                          justifyContent="center"
                          borderColor="muted.300"
                          borderWidth="1px">
                          <Text
                            fontSize="md"
                            fontWeight="extrabold"
                            color="primary.900"
                            letterSpacing="lg">
                            {index + 1}
                          </Text>
                        </Box>
                        <Box
                          paddingLeft="2"
                          flex="1"
                          justifyContent="center"
                          borderColor="muted.300"
                          borderWidth="1px">
                          <Text
                            fontSize="md"
                            fontWeight="bold"
                            color="warmGray.400"
                            letterSpacing="lg">
                            {item.ItemName}
                          </Text>
                        </Box>
                        <Box
                          paddingLeft="2"
                          flex="1"
                          justifyContent="center"
                          borderColor="muted.300"
                          borderWidth="1px">
                          <Text
                            fontSize="md"
                            fontWeight="bold"
                            color="warmGray.400"
                            letterSpacing="lg">
                            {item.Weight}
                          </Text>
                        </Box>
                        <Box
                          paddingLeft="2"
                          flex="1"
                          justifyContent="center"
                          borderColor="muted.300"
                          borderWidth="1px">
                          <Text
                            fontSize="md"
                            fontWeight="bold"
                            color="warmGray.400"
                            letterSpacing="lg">
                            {item.Rate}
                          </Text>
                        </Box>
                        <Box
                          paddingLeft="2"
                          flex="1"
                          justifyContent="center"
                          borderColor="muted.300"
                          borderWidth="1px">
                          <Text
                            fontSize="md"
                            fontWeight="bold"
                            color="warmGray.400"
                            letterSpacing="lg">
                            {item.Making}
                          </Text>
                        </Box>
                        <Box
                          paddingLeft="2"
                          flex="1"
                          justifyContent="center"
                          borderColor="muted.300"
                          borderWidth="1px">
                          <Text
                            fontSize="md"
                            fontWeight="bold"
                            color="warmGray.400"
                            letterSpacing="lg">
                            {item.Lobor}
                          </Text>
                        </Box>
                        <Box
                          paddingLeft="2"
                          flex="1"
                          justifyContent="center"
                          borderColor="muted.300"
                          borderWidth="1px">
                          <Text
                            fontSize="md"
                            fontWeight="extrabold"
                            color="warmGray.800"
                            letterSpacing="lg">
                            {item.Amount.toFixed(2)}
                          </Text>
                        </Box>
                      </Box>
                    </>
                  );
                }}
              />
            </HStack>
          </Stack>
          <Box p="2" flexDirection="row" justifyContent="space-between">
            <Text
              fontSize="md"
              fontWeight="extrabold"
              color="primary.900"
              letterSpacing="lg">
              Total Amount
            </Text>
            <Text
              fontSize="md"
              fontWeight="extrabold"
              color="primary.900"
              letterSpacing="lg">
              INR {totalAmount ? totalAmount.toFixed(2) : 0}
            </Text>
          </Box>
          <Box>
            <TouchableOpacity
              onPress={() =>
                allList.length > 0
                  ? createPDF()
                  : Alert.alert('Please add item')
              }>
              <View
                style={{
                  backgroundColor: '#22c55e',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: 15,
                  padding: 15,
                }}>
                <Text
                  fontSize="lg"
                  fontWeight="medium"
                  color="primary.100"
                  letterSpacing="lg">
                  Generate Bill
                </Text>
              </View>
            </TouchableOpacity>
          </Box>
        </ScrollView>
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            setValues('');
            setModalVisible(!modalVisible);
          }}>
          <Pdf
            source={source}
            onLoadComplete={(numberOfPages, filePath) => {
              console.log(`Number of pages: ${numberOfPages}`);
            }}
            onPageChanged={(page, numberOfPages) => {
              console.log(`Current page: ${page}`);
            }}
            onError={error => {
              console.log(error);
            }}
            onPressLink={uri => {
              console.log(`Link pressed: ${uri}`);
            }}
            style={styles.pdf}
          />
        </Modal>
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalItem}
          onRequestClose={() => {
            setModalVisible(!modalItem);
          }}>
          <>
            <SafeAreaView
              style={{
                flex: 1,
                padding: 5,
                marginBottom: 5,
                backgroundColor: '#fff',
              }}>
              <ScrollView h="100">
                <Center bg="lightText" w="100%">
                  <ScrollView p="2" w="100%" py="5">
                    <Heading
                      size="lg"
                      color="coolGray.800"
                      _dark={{
                        color: 'warmGray.50',
                      }}
                      fontWeight="semibold">
                      ITEM Details
                    </Heading>
                    <VStack space={1} mt="2">
                      <FormControl isRequired>
                        <FormControl.Label>Item Name</FormControl.Label>
                        <Input
                          value={values.ItemName}
                          onChangeText={text => handleChange('ItemName', text)}
                        />
                      </FormControl>
                      <FormControl isRequired>
                        <FormControl.Label>{'Weight(Gm.)'}</FormControl.Label>
                        <Input
                          keyboardType="numeric"
                          value={values.Weight}
                          onChangeText={value => handleChange('Weight', value)}
                        />
                      </FormControl>
                      <FormControl isRequired>
                        <FormControl.Label>{'Rate (10gm.)'}</FormControl.Label>
                        <Input
                          keyboardType="numeric"
                          value={values.Rate}
                          onChangeText={value => handleChange('Rate', value)}
                        />
                      </FormControl>
                      <FormControl isRequired>
                        <FormControl.Label>{'Making(%)'}</FormControl.Label>
                        <Input
                          keyboardType="numeric"
                          value={values.Making}
                          onChangeText={value => handleChange('Making', value)}
                        />
                      </FormControl>
                      <FormControl isRequired>
                        <FormControl.Label>{'Lobor (Rs.)'}</FormControl.Label>
                        <Input
                          keyboardType="numeric"
                          value={values.Lobor}
                          onChangeText={value => handleChange('Lobor', value)}
                        />
                      </FormControl>
                      <Box>
                        <Checkbox value={isSelected} onChange={setSelection}>
                          <Text>Labor per gm.</Text>
                        </Checkbox>
                      </Box>
                      <Box
                        p="2"
                        flexDirection="row"
                        justifyContent="space-between">
                        <Text
                          fontSize="md"
                          fontWeight="extrabold"
                          color="primary.900"
                          letterSpacing="lg">
                          Amount
                        </Text>
                        <Text
                          fontSize="md"
                          fontWeight="extrabold"
                          color="primary.900"
                          letterSpacing="lg">
                          INR {amount ? amount : 0}
                        </Text>
                      </Box>
                      <Button onPress={() => submit()} my="2" bg="success.400">
                        <Text
                          fontSize="lg"
                          fontWeight="extrabold"
                          color="lightText"
                          letterSpacing="lg">
                          SAVE
                        </Text>
                      </Button>
                      <Button
                        bg="#ef4444"
                        onPress={() => setModalItem(!modalItem)}>
                        <Text
                          fontSize="lg"
                          fontWeight="extrabold"
                          color="lightText"
                          letterSpacing="lg">
                          CLOSE
                        </Text>
                      </Button>
                    </VStack>
                  </ScrollView>
                </Center>
              </ScrollView>
            </SafeAreaView>
          </>
        </Modal>
      </SafeAreaView>
    </>
  );
};

export default CreateBill;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  titleText: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    paddingVertical: 20,
  },
  textStyle: {
    fontSize: 18,
    padding: 10,
    color: 'black',
    textAlign: 'center',
  },
  imageStyle: {
    width: 150,
    height: 150,
    margin: 5,
    resizeMode: 'stretch',
  },
  pdf: {
    flex: 1,
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
});
