import { useState } from "react"
import Login from "../components/Login"
import Signup from "../components/Signup"

function Authentication() {
  const [isLogin, setIsLogin] = useState<boolean>(false)

  return (
    <div>
      {isLogin ? <Login setIsLogin={setIsLogin}/> : <Signup setIsLogin={setIsLogin}/>}
    </div>
  )
}

export default Authentication