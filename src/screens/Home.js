import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Platform,
} from "react-native";

import { Searchbar, Button, Dialog, Portal } from "react-native-paper";
import Icon from "react-native-vector-icons/FontAwesome";

import AsyncStorage from "@react-native-async-storage/async-storage";

import database from "@react-native-firebase/database";
import ImagePicker from "react-native-image-crop-picker";

import { USER_KEY } from "./auth";

export default function Home({ navigation, route }) {
  let [storeList, setStoreList] = useState([]);

  let [filteredStore, setFilteredStore] = useState({});

  let [searchText, setSearchText] = useState("");

  const [visible, setVisible] = useState(false);

  const [currentStore, setCurrentStore] = useState({});
  const [currentImg, setCurrentImg] = useState({});

  useEffect(() => {
    const fetchStore = async () => {
      let id = await AsyncStorage.getItem(USER_KEY);

      database()
        .ref(`/users/${id}`)
        .once("value")
        .then((snapshot) => {
          let stores = snapshot.val().stores;
          database()
            .ref(`stores`)
            .once("value")
            .then((snapshot) => {
              let overallStores = snapshot.val(),
                storeData = {};
              stores.forEach((item) => {
                storeData[item] = overallStores[item];
              });
              setFilteredStore(storeData);
              setStoreList(storeData);
            })
            .catch(() => {});
        })
        .catch(() => {});
    };

    fetchStore();
  }, []);

  const getFilteredList = (filter) => {
    let updatedStoreList = {};
    for (let key in storeList) {
      let value = Object.values(storeList[key]).join("").toLowerCase();
      if (value.includes(filter.toLowerCase())) {
        updatedStoreList[key] = storeList[key];
      }
    }
    setFilteredStore(updatedStoreList);
  };

  const onChangeSearch = (text) => {
    setSearchText(text);
    getFilteredList(text);
  };

  let captureImage = (item) => {
    return ImagePicker.openCamera({
      width: 300,
      height: 400,
      cropping: true,
    })
      .then((image) => {
        const imageUri = Platform.OS === "ios" ? image.sourceURL : image.path;
        setVisible(true);
        setCurrentStore(item);
        setCurrentImg(imageUri);
      })
      .catch((e) => {});
  };

  const onUpload = () => {
    let store = Object.keys(currentStore)[0];
    let uploadUri = currentImg;
    let fileName = uploadUri.substring(uploadUri.lastIndexOf("/") + 1);

    fileName = fileName.split("_").join("").split(".");

    database()
      .ref(`/stores/${store}/images`)
      .update({ [fileName[0]]: uploadUri })
      .then(() => alert("image updated"))
      .catch(() => alert("Some error occurred"));

    setVisible(false);
  };

  let storeData = () => {
    return Object.keys(filteredStore).map((item) => {
      return { [item]: filteredStore[item] };
    });
  };

  return (
    <Portal.Host>
      <View style={styles["container"]}>
        <Portal>
          <Dialog visible={visible}>
            <Dialog.Actions>
              <View style={style["dialogBox"]}>
                <Text>Upload it to the server</Text>
              </View>
              <Button onPress={() => setVisible(false)}>Cancel</Button>
              <Button onPress={onUpload}>Ok</Button>
            </Dialog.Actions>
          </Dialog>
        </Portal>
        <Searchbar
          placeholder="Search"
          onChangeText={onChangeSearch}
          value={searchText}
          icon={<Icon name="rocket" size={30} color="#900" />}
          clearIcon={<Icon name="rocket" size={30} color="#900" />}
          style={styles["search"]}
        />
        <FlatList
          data={storeData()}
          keyExtractor={(item) => Object.keys(item)[0]}
          renderItem={({ item, index }) => {
            let value = Object.values(item)[0];
            return (
              <TouchableOpacity
                style={styles["row"]}
                onPress={() => captureImage(item)}
              >
                <Text style={styles["title"]}>
                  {value.name.split("_").pop()}
                </Text>
                <Text>{value.address}</Text>
              </TouchableOpacity>
            );
          }}
        />
      </View>
    </Portal.Host>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#343434", paddingVertical: 5 },
  row: {
    borderWidth: 1,
    padding: 10,
    justifyContent: "center",
    paddingHorizontal: 30,
    backgroundColor: "#f7f7f7",
    marginVertical: 2,
  },
  search: { margin: 5, marginVertical: 10 },
  title: {
    fontSize: 20,
    color: "black",
    fontWeight: "bold",
    marginBottom: 5,
  },
  dialogBox: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
