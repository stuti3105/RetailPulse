import AsyncStorage from '@react-native-async-storage/async-storage';

export const USER_KEY = 'auth-demo-key';

export const onSignIn = id => AsyncStorage.setItem(USER_KEY, id);

export const onSignOut = () => AsyncStorage.removeItem(USER_KEY);

export const isSignedIn = () => {
  return new Promise((resolve, reject) => {
    AsyncStorage.getItem(USER_KEY)
      .then(res => {
        if (res !== null) {
          resolve(true);
        } else {
          resolve(false);
        }
      })
      .catch(err => reject(err));
  });
};
