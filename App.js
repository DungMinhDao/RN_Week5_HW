import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  ActivityIndicator, 
  FlatList,
  Linking,
  TouchableOpacity,
} from 'react-native';
import moment from 'moment';
import { Card, Button, Icon, Image } from "react-native-elements";
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
// import { LogBox } from 'react-native';
// LogBox.ignoreLogs(['Warning: ...']); // Ignore log notification by message
// LogBox.ignoreAllLogs();//Ignore all log notifications
import { Publishers } from "./utils/data";
import { HomeScreen } from "./screens/HomeScreen";

const API_KEY = "cb59e09d4def44c299164db355677230";
const Stack = createStackNavigator();

const filterForUniqueArticles = arr => {
  const cleaned = [];
  arr.forEach(itm => {
    let unique = true;
    cleaned.forEach(itm2 => {
      const isEqual = JSON.stringify(itm) == JSON.stringify(itm2);
      if (isEqual) unique = false;
    });
    if (unique) cleaned.push(itm)
  });
  return cleaned;
}

export default function App() {
  const [loading, setLoading] = useState(true);
  const [articles, setArticles] = useState([]);
  const [pageNumber, setPageNumber] = useState(1);
  const [hasErrored, setHasApiError] = useState(false);
  const [lastPageReached, setLastPageReached] = useState(false);

  const getNews = async () => {
    console.log('getNews function start');
    try {
      const response = await fetch(
        `https://newsapi.org/v2/top-headlines?country=us&apiKey=${API_KEY}&page=${pageNumber}`
      );
      const jsonData = await response.json();
      if (jsonData.articles.length > 0) {
        const newArticleList = filterForUniqueArticles(
          articles.concat(jsonData.articles)
        );
        setArticles(newArticleList);
        setPageNumber(pageNumber + 1);
      }  
      else {
        setLastPageReached(true);
      }
    } catch (error) {
      setHasApiError(true);
    }
  
    setLoading(false);
  }
  
  useEffect(() => {
    getNews();
  }, []);

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator 
          size="large"
          color='#0000ff'
          loading={loading}
        />
      </View>
    );
  };

  const renderArticleItem = ({ item }) => {
    return (
      <Card>
        <Card.Title>{item.title}</Card.Title>
        <Card.Image source={{ uri: item.urlToImage }}/>
        <View style={styles.row}>
          <Text style={styles.label}>Source</Text>
          <Text style={styles.info}>{item.source.name}</Text>
        </View>
        <Text style={{ marginBottom: 10 }}>{item.content}</Text>
        {/* <View style={styles.row}> */}
          <Text style={styles.label}>Published</Text>
          <Text style={styles.info}>
            {moment(item.pulishedAt).format('lll')}
          </Text>
        {/* </View> */}
        <Button 
          icon={<Icon/>} 
          title="Read more" 
          backgroundColor="#03A9F4"
          onPress={() => onPressHomeArticle(item.url)}
        />
      </Card>
    );
  };

  
  const renderPublisherItem = ({ item }) => {
    return (
      <View style={{width: 180, padding: 5}}>
        <TouchableOpacity 
          style={styles.publisherButton}
          // onPress={() => props.navigation.navigate('PublisherHome')}
        >
            <Image source={{ uri: item.imgUri }}  style={styles.publisherImage}/>
        </TouchableOpacity>    
      </View>
    )
  };

  const onPressHomeArticle = url => {
    Linking.canOpenURL(url).then(supported => {
      if (supported) {
        Linking.openURL(url);
      } else {
        console.log(`Don't know how to open URL: ${url}`);
      }
    })
  }

  if (hasErrored) {
    return (
      <View style={styles.container}>
        <Text>Error =(</Text>
      </View>
    );
  }

  const Home = () => {
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
          style={{width: '105%'}}
          data={articles}
          renderItem={renderArticleItem}
          keyExtractor={item => item.title}
          showsVerticalScrollIndicator={false}
          onEndReached={getNews}
          onEndReachedThreshold={1}
          ListFooterComponent={lastPageReached?
            <Text>No more aritcles</Text>:
            <ActivityIndicator size="large" loading={loading}/>}
        />
      </View>
    );
  }

  const PublisherHome = () => {
    return (
      <View style={styles.container}>
        <Text>Hello</Text>
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {/* <Stack.Screen name="Home" component={HomeScreen}/> */}
        <Stack.Screen name="Home" component={Home}/>
        <Stack.Screen name="Publisher Home" component={PublisherHome}/>
      </Stack.Navigator>
    </NavigationContainer>
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
