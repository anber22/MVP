import '@/styles/globals.css'
import Template from "@/components/Layout/index"
import Login from "@/pages/login.js"
import {useRouter} from 'next/router'
export default function App({ Component, pageProps }) {
  const router = useRouter()
   // console.log('router', router)
  const getRouter = () => {
    if(router.route === '/login'){
      return <Login/>
    }else{
      return (
        <Template>
          <Component {...pageProps} />
        </Template>
      )
    }
  }
  return (
    getRouter()
  )
}
