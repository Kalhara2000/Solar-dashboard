import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyDxJBAAUufYlLSZELKnpBbF54kG2SyyVOQ",
  authDomain: "ceb-solar-management.firebaseapp.com",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
