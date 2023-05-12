import { initializeApp } from "firebase/app";
const firebaseConfig = {
    // ...
    // The value of `databaseURL` depends on the location of the database
    databaseURL: "https://dungeonsdragons-f84ec-default-rtdb.europe-west1.firebasedatabase.app",
    storageBucket: "gs://dungeonsdragons-f84ec.appspot.com",
  };
export default initializeApp(firebaseConfig);