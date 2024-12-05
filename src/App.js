import './App.css';
import Login from "./components/login/Login";
import Notification from "./norification/Notification";
import {useEffect} from "react";

function App() {
    const user = false;

    return (
        <div>
            {
                user
                    ? (<div>Chat page</div>)
                    : (<Login/>)
            }
            <Notification/>
        </div>
    );
}

export default App;
