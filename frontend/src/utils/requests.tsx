import { useNavigate } from "react-router-dom"

interface RequestConfigI {
    method: string,
    headers: { 
        "Content-Type": string
    }
    body: URLSearchParams
}

export default function useRequest(){

    const navigate = useNavigate()

    const BASE_URL = "http://localhost:3000"

    const handleLogin = ( username: string, password: string, type: string, authType: string ) => {

        console.log(username,password,type,authType)
        const URL : string = BASE_URL + "/auth/login"

        const bodyData = new URLSearchParams()
        bodyData.append("username", username)
        bodyData.append("password", password)
        bodyData.append("type", type)
        bodyData.append("authType", authType)

        const config : RequestConfigI = {
            method: "POST",
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: bodyData
        }

        fetch(URL, config)
        .then((res: Response) => {
            console.log(res)
            navigate("/customer/dashboard")
        })
    }

    return { handleLogin }
}