import {View, Text, StyleSheet, Dimensions} from 'react-native';
import React, {useEffect, useState} from 'react';
import Pdf from 'react-native-pdf';

const BillDetails = ({route}) => {
  const [filePath, setFilePath] = useState('');
  const source = {uri: filePath, cache: true};
  const {state} = route.params;
  useEffect(() => {
  setFilePath(state.pdfFile)
  }, [state])
  
    
  return (
      <View style={{ flex: 1 ,justifyContent:'center',alignItems:'center'}}>
          {filePath ?
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
              /> : <Text style={{fontSize:25,fontWeight:'900',textTransform:'uppercase'}}>no details found</Text>}
    </View>
  );
};

export default BillDetails;

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
