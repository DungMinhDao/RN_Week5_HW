import React from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  ActivityIndicator, 
  FlatList,
} from 'react-native';

export default function HomeScreen() {
    return (
        <View style={styles.container}>
            {/* <View style={styles.row}>
            <Text style={styles.label}>Articles Count:</Text>
            <Text style={styles.info}>{articles.length}</Text>
            </View> */}
            <View style={{height: 120, justifyContent: 'center'}}>
            <FlatList
                data={Publishers}
                renderItem={renderPublisherItem}
                keyExtractor={item => item.imgUri}
                horizontal={true}
                showsHorizontalScrollIndicator={false}
            />
            </View>
            <FlatList
                style={{width: '100%'}}
                data={articles}
                renderItem={renderArticleItem}
                keyExtractor={item => item.title}
                onEndReached={getNews}
                onEndReachedThreshold={1}
                ListFooterComponent={lastPageReached?
                    <Text>No more aritcles</Text>:
                    <ActivityIndicator size="large" loading={loading}/>}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    containerFlex: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center'
    },
    container: {
      flex: 1,
      // marginTop: 40,
      alignItems: 'center',
      backgroundColor: '#fff',
      justifyContent: 'center'
    },
    header: {
      height: 30,
      width: '100%',
      backgroundColor: 'pink'
    },
    row: {
      flexDirection: 'row'
    },
    label: {
      fontSize: 14,
      color: 'black',
      marginRight: 10,
      fontWeight: 'bold'
    },
    info: {
      fontSize: 14,
      color: 'grey'
    },
    publisherImage: {
      width: '100%',
      height: '100%',
      resizeMode: 'cover',
      justifyContent: "center",
      borderRadius: 10,
    },
    absoluteView: {
      flex: 1,
      position: 'absolute',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'transparent'
    },
  });