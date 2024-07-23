// Importing necessary components from Chakra UI and custom components
import {
  Box,
  Container,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
} from "@chakra-ui/react";
import { FaComments } from "react-icons/fa";
import { keyframes } from "@emotion/react";
import Login from "../components/Authentication/Login";
import Signup from "../components/Authentication/Signup";

// Animation keyframes for a subtle bounce effect
const bounceAnimation = keyframes`
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-5px);
  }
`;

// Home component that serves as the main entry point for the app
function Home() {
  return (
    <Container maxW="xl" centerContent>
      {/* Header Box displaying the app title */}
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        p={3}
        bgGradient="linear(to-r, teal.500, green.500)"
        w="100%"
        m="40px 0 15px 0"
        borderRadius="lg"
        boxShadow="xl"
        animation={`${bounceAnimation} 2s infinite`}
      >
        <FaComments size="40px" color="white" style={{ marginRight: "10px" }} />
        <Text
          fontSize="5xl"
          fontFamily="Work sans"
          color="white"
          fontWeight="bold"
          textShadow="2px 2px 8px rgba(0, 0, 0, 0.3)"
        >
          Chatify
        </Text>
      </Box>

      {/* Box containing the tabs for Login and Sign Up */}
      <Box bg="white" w="100%" p={4} borderRadius="lg" borderWidth="1px" boxShadow="xl">
        <Tabs isFitted variant="soft-rounded">
          {/* TabList containing the Login and Sign Up tabs */}
          <TabList mb="1em">
            <Tab>Login</Tab>
            <Tab>Sign Up</Tab>
          </TabList>
          
          {/* TabPanels containing the Login and Sign Up forms */}
          <TabPanels>
            <TabPanel>
              <Login />
            </TabPanel>
            <TabPanel>
              <Signup />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </Container>
  );
}

// Exporting the Home component as the default export
export default Home;
