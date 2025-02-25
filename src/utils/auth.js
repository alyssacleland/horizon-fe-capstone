import firebase from 'firebase/app';
import 'firebase/auth';

const signIn = () => {
  const provider = new firebase.auth.GoogleAuthProvider();
  firebase.auth().signInWithPopup(provider);
};

const signOut = () => {
  firebase
    .auth()
    .signOut()
    .then(() => {
      console.log('Signed out');
    })
    .catch((error) => {
      console.error('Sign out error', error);
    });
};

export { signIn, signOut };
