import { Box, Button, Flex, Input, Text, VStack } from "@chakra-ui/react"
import { useState } from "react"
import useRequest from "../utils/requests"

export default function Login(){

    const { handleLogin } = useRequest()

    const [email, setEmail] = useState<string>("")
    const [password, setPassword] = useState<string>("")


    return(
        <>
            <Flex bg="gray.100" align="center" justify="center" h="100vh">
            <Box bg="white" p={6} rounded="md">
                <VStack spacing={4} align="flex-start">
                    <Text>Email Address</Text>
                    <Input
                        id="email"
                        name="email"
                        type="email"
                        variant="filled"
                        onChange={(e)=>setEmail(e.target.value)}
                        value={email}
                    />
                    <Text>Password</Text>
                    <Input
                        id="password"
                        name="password"
                        type="password"
                        variant="filled"
                        onChange={(e)=>setPassword(e.target.value)}
                        value={password}
                    />
                    <Button 
                        type="submit" 
                        colorScheme="purple" 
                        width="full"
                        onClick={() => handleLogin(email, password, "customer", "local")}
                    >
                    Login
                    </Button>
                </VStack>
            </Box>
            </Flex>
        </>
    )
}