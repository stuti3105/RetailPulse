import React, {useState} from 'react';
import {View, StyleSheet} from 'react-native';
import {onSignIn} from './auth';
import {TextInput, Button} from 'react-native-paper';
import database from '@react-native-firebase/database';

export default function Login(props) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const onLogin = () => {
    database()
      .ref('/users')
      .once('value')
      .then(snapshot => {
        let users = snapshot.val();
        let userId;

        for (let key in users) {
          if (username.toLowerCase() === users[key].name.toLowerCase()) {
            userId = key;
            break;
          }
        }
        if (userId && password === 'retailpulse') {
          onSignIn(userId).then(() => props.route.params.onSuccessLogin());
        } else {
          alert('Invalid Credentials');
        }
      })
      .catch(err => alert('Username is not registered'));
  };

  return (
    <View style={styles.container}>
      <TextInput
        value={username}
        onChangeText={setUsername}
        theme={{colors: {primary: '#128ef2'}}}
        mode={'outlined'}
        label={'username'}
        autoCapitalize="none"
        style={styles.input}
      />
      <TextInput
        value={password}
        onChangeText={setPassword}
        theme={{colors: {primary: '#128ef2'}}}
        mode={'outlined'}
        label={'Password'}
        secureTextEntry={true}
        style={styles.input}
      />

      <Button
        color={'#128ef2'}
        mode="outlined"
        style={{
          borderRadius: 50,
          borderColor: '#128ef2',
          borderWidth: 1,
          backgroundColor: '#fff',
          marginBottom: 5,
        }}
        onPress={() => onLogin()}>
        {'Login'}
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  input: {
    width: '70%',
    height: 44,
    padding: 10,
    marginBottom: 10,
  },
});
