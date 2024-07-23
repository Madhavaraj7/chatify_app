import { Box } from "@chakra-ui/react"; // Adjusted import based on Chakra UI
import { useState } from "react";
import ChatBox from "../components/ChatBox";
import Mychats from "../components/Mychats";
import SideDrawer from "../components/miscellaneous/SideDrawer";
import { useChatState } from "../context/ChatProvider"; // Changed to useChatState

const Chatpage = () => {
  const [fetchAgain, setFetchAgain] = useState(false);
  const { user } = useChatState(); // Changed to useChatState

  return (
    <div style={{ width: "100%" }}>
      {user && <SideDrawer />}
      <Box display="flex" justifyContent="space-between" w="100%" h="91.5vh" p="10px">
        {user && <Mychats fetchAgain={fetchAgain} />}
        {user && (
          <ChatBox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
        )}
      </Box>
    </div>
  );
};

export default Chatpage;
