import React, { Component } from "react";

import { Button } from "react-native-paper";

import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

import Home from "./src/screens/Home";
import Login from "./src/screens/Login";
import { isSignedIn } from "./src/screens/auth";

const Stack = createStackNavigator();

export default class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      signedIn: false,
      checkedSignIn: false,
      userData: "",
    };
  }

  componentDidMount() {
    isSignedIn()
      .then((res) => this.setState({ signedIn: res, checkedSignIn: true }))
      .catch((err) => alert("An error occurred"));
  }

  onSuccessLogin = () => {
    this.setState({ signedIn: true });
  };

  onLogOut = () => {
    this.setState({ signedIn: false });
  };

  render() {
    return this.state.checkedSignIn ? (
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{
            headerTintColor: "white",
            headerStyle: {
              backgroundColor: "#4c4c4c",
            },
          }}
        >
          {this.state.signedIn ? (
            <Stack.Screen
              name="Home"
              component={Home}
              initialParams={{
                userData: this.state.userData,
              }}
              options={({ navigation }) => ({
                headerRight: () => (
                  <Button color={"white"} onPress={this.onLogOut}>
                    LOGOUT
                  </Button>
                ),
              })}
            />
          ) : (
            <>
              <Stack.Screen
                name="Login"
                component={Login}
                initialParams={{ onSuccessLogin: this.onSuccessLogin }}
              />
            </>
          )}
        </Stack.Navigator>
      </NavigationContainer>
    ) : null;
  }
}
