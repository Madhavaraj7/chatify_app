import React, { useState, useEffect } from 'react';
import { Box, Button, Flex, Text, Menu, MenuButton, Avatar, MenuList, MenuItem, MenuDivider, Input, Drawer, useDisclosure, DrawerOverlay, DrawerContent, DrawerBody, useToast, Spinner } from '@chakra-ui/react'; // Keep Chakra UI imports for other components
import { BellIcon, ChevronDownIcon, SearchIcon } from "@chakra-ui/icons";
import NotificationsIcon  from '@mui/icons-material/Notifications';
import { Badge as MuiBadge } from '@mui/material'; // Import MUI Badge
import { io } from 'socket.io-client';
import { useChatState } from '../../context/ChatProvider';
import ProfileModal from './ProfileModal';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { getSender } from '../../config/chatLogic';
import ChatLoading from '../ChatLoading';
import UserListItem from '../userAvatar/UserListItem';

function SideDrawer() {
  const [search, setSearch] = useState('');
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingChat, setLoadingChat] = useState(false);
  const [socket, setSocket] = useState(null);
  const [unreadCount, setUnreadCount] = useState(0);

  const toast = useToast();
  const { user, setSelectedChat, chats, setChats, notification, setNotification } = useChatState();
  const navigate = useNavigate();
  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    const newSocket = io(import.meta.env.VITE_APP_BACKEND_ENV);
    setSocket(newSocket);
  
    newSocket.on('receiveNotification', (notification) => {
      toast({
        title: notification.message,
        status: 'info',
        duration: 5000,
        isClosable: true,
        position: 'top-right',
      });
      setNotification((prev) => [notification, ...prev]);
  
      console.log("Notification received:", notification);
      setUnreadCount((prev) => prev + 1); // Increase unread count
    });
    
    return () => newSocket.close();
  }, [toast, setNotification]);
  

  console.log("krkrkrk",unreadCount);

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
  };

  const handleSearch = async () => {
    if (!search) {
      toast({
        title: 'Please Enter something in search',
        status: 'warning',
        duration: 5000,
        isClosable: true,
        position: 'top-left',
      });
      return;
    }

    try {
      setLoading(true);

      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.get(import.meta.env.VITE_APP_BACKEND_ENV+ `/api/user?search=${search}`, config);

      setLoading(false);
      setSearchResult(data);
    } catch (error) {
      toast({
        title: 'Error Occurred!',
        description: 'Failed to Load the Search Results',
        status: 'error',
        duration: 5000,
        isClosable: true,
        position: 'bottom-left',
      });
      setLoading(false);
    }
  };

  const accessChat = async (userId) => {
    try {
      setLoadingChat(true);
      const config = {
        headers: {
          'Content-type': 'application/json',
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.post(import.meta.env.VITE_APP_BACKEND_ENV+ '/api/chat', { userId }, config);

      if (!chats.find((c) => c._id === data._id)) setChats([data, ...chats]);
      setSelectedChat(data);
      setLoadingChat(false);
      onClose();
    } catch (error) {
      toast({
        title: 'Error fetching the chat',
        description: error.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
        position: 'bottom-left',
      });
      setLoadingChat(false);
    }
  };

  const handleNotificationClick = () => {
    setUnreadCount(0); // Reset unread count when user views notifications
  };

  const logoutHandler = () => {
    localStorage.removeItem('userInfo');
    navigate('/');
  };

  return (
    <>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        bg="gray.50"
        w="100%"
        p="5px 10px"
        borderBottom="1px solid"
        borderColor="gray.200"
        boxShadow="md"
      >
        <Button
          size="sm"
          variant="solid"
          colorScheme="teal"
          onClick={onOpen}
          _hover={{ bg: 'teal.600' }}
          display="flex"
          alignItems="center"
          px={4}
          py={2}
          borderRadius="md"
        >
          <Flex align="center">
            <Text mr={2} fontWeight="bold" fontFamily="Work Sans">
              Search User
            </Text>
            <SearchIcon />
          </Flex>
        </Button>
        <Text fontSize="2xl" fontFamily="Work Sans" color="teal.500" fontWeight="bold">
          Chatify
        </Text>
        <Box display="flex" alignItems="center" position="relative">
          <Menu>
            <MenuButton p={1} onClick={handleNotificationClick} position="relative">
              {unreadCount > 0 && (
                <MuiBadge badgeContent={unreadCount} color="error" sx={{ position: 'absolute', top: -10, right: -10 }}>
                  <NotificationsIcon />
                </MuiBadge>
              )}
              {unreadCount === 0 && <NotificationsIcon />}
            </MenuButton>
            <MenuList pl={2}>
              {!notification.length && 'No New Messages'}
              {notification.map((notif) => (
                <MenuItem
                  key={notif._id}
                  onClick={() => {
                    setSelectedChat(notif.chat);
                    setNotification(notification.filter((n) => n !== notif));
                  }}
                >
                  {notif.chat.isGroupChat
                    ? `New Message in ${notif.chat.chatName}`
                    : `New Message from ${getSender(user, notif.chat.users)}`}
                </MenuItem>
              ))}
            </MenuList>
          </Menu>
          <Menu>
            <MenuButton
              as={Button}
              variant="solid"
              colorScheme="teal"
              rightIcon={<ChevronDownIcon />}
              _hover={{ bg: 'teal.600' }}
            >
              <Avatar
                size="sm"
                cursor="pointer"
                name={user.name}
                src={user.pic}
              />
            </MenuButton>
            <MenuList>
              <ProfileModal user={user}>
                <MenuItem>My Profile</MenuItem>
              </ProfileModal>
              <MenuDivider />
              <MenuItem onClick={logoutHandler}>Logout</MenuItem>
            </MenuList>
          </Menu>
        </Box>
      </Box>

      <Drawer placement="left" onClose={onClose} isOpen={isOpen}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerBody>
            <Box display="flex" pb={2}>
              <Input
                placeholder="Search by name or email"
                mr={2}
                value={search}
                onChange={handleSearchChange}
              />
              <Button onClick={handleSearch}>Go</Button>
            </Box>
            {loading ? (
              <ChatLoading />
            ) : (
              searchResult?.map((user) => (
                <UserListItem
                  key={user._id}
                  user={user}
                  handleFunction={() => accessChat(user._id)}
                />
              ))
            )}
            {loadingChat && <Spinner ml="auto" display="flex" />}
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
}

export default SideDrawer;
