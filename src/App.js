import React, { useRef, useState } from 'react';
import './App.css';

import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';

import { useAuthState, useSignInWithGoogle } from 'react-firebase-hooks/auth';
import { useCollectionData, useCollectionDate } from 'react-firebase-hooks/firestore';

firebase.initializeApp({
  // config from created firebase project
  apiKey: "AIzaSyB7gRxsFVDTssWGIARZa7oJjDoatAgra5k",
  authDomain: "web-chat-app-c815d.firebaseapp.com",
  projectId: "web-chat-app-c815d",
  storageBucket: "web-chat-app-c815d.appspot.com",
  messagingSenderId: "1001650882524",
  appId: "1:1001650882524:web:7315f5073860187c8b3119",
  measurementId: "G-F7GFRR57S2"
})

const auth = firebase.auth();
const firestore = firebase.firestore();
 


function App() {
  const [user] = useAuthState(auth);
  return (
    <div className="App">
      <header className="App-header">
        
      </header>
      <section>
        {user ? <ChatRoom /> : <SignIn />}
      </section>
    </div>
  );
}

function SignIn() {
  const signInWithGoogle = () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithGoogle(provider);
  }

  return (
    <button onClick={signInWithGoogle}>Sign in with Google</button>
  )
}

function SignOut() {
  return auth.currentUser && (

    <button onClick={() => auth.signOut()}>Sign Out</button>
  )
}

function ChatRoom() {
  const dummy = useRef()

  const messageRef = firestore.collection('messages');
  const query = messageRef.orderBy('createdAt').limit(25);

  const [messages] = useCollectionData(query, {idField: 'id'});

  const [formValue, setFormValue] = useState('');

  const sendMessage = async(e) => {

    e.preventDefault();

    const { uid, photoURL } = auth.currentUser;

    await messageRef.add({
      text: formValue,
      createdAt: firebase.firestore.FieldValue.serverTimelstamp(),
      uid,
      photoURL
    });

    setFormValue('');

    dummy.current.scroolIntoView({ behaviour: 'smooth' });
  }

  return (
    <>
      <main>
        {messages && messages.map(msg => <ChatMessage key={msg.id} message={msg} />)}

        <div ref={dummy}></div>
      </main>

      <form onSubmit={sendMessage}>

        <input value={formValue} onChange={(e) => setFormValue(e.target.value)}/>
        
        <button type="submit"></button>

      </form>
    </>
  )
}

function ChatMessage(props) {
  const { text, uid, photoURL } = props.message;

  const messageClass = uid === auth.currentUser.uid ? 'sent' : 'received';

  return (
    <div className={`message ${messageClass}`}>
      <img src={photoURL} />
      <p>{text}</p>
    </div>
  )
}

export default App;
