import Hello from "./component_01/Hello"
import UserCard, { Person } from "./component_02/UserCard"
import MyPage from "./component_05/MyPage"
import RouterExample from "./component_08/RouterExample"


function App() {
 

  return (<div>
    {/*
    <h1>Welcome to My React App</h1>
    <Hello/>
    <UserCard name="John Doe" age={30}/>
    <UserCard name="Jane Smith" age={25}/>
    <Person/>
    */}
    <RouterExample/>
    </div>
  )
}

export default App
