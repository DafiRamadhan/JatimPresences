
import firebase from 'firebase';

class FirebaseSDK {
  constructor() {
    if (!firebase.apps.length) {
      //avoid re-initializing
      firebase.initializeApp({
        apiKey: 'AIzaSyC53o9kgZXk7rkmQ5DdK1vntaa8Laq6ekE',
        authDomain: 'jatimpresences.firebaseapp.com',
        databaseURL: 'https://jatimpresences.firebaseio.com',
        projectId: 'jatimpresences',
        storageBucket: 'jatimpresences.appspot.com',
        messagingSenderId: 'jatimpresences'
      });
    }
  }
  login = async (user, success_callback, failed_callback) => {
    await firebase
      .auth()
      .signInWithEmailAndPassword(user.email, user.password)
      .then(success_callback, failed_callback);
  };
}
const firebaseSDK = new FirebaseSDK();
export default firebaseSDK;