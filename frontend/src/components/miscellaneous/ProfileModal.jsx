import React from 'react';
import { ViewIcon } from "@chakra-ui/icons";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  Button,
  useDisclosure,
  IconButton,
  Text,
  Image,
} from "@chakra-ui/react";

const ProfileModal = ({ user, children }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      {children ? (
        <span onClick={onOpen}>{children}</span>
      ) : (
        <IconButton display={{ base: "flex" }} icon={<ViewIcon />} onClick={onOpen} aria-label="View Profile" />
      )}
      <Modal size="sm" onClose={onClose} isOpen={isOpen} isCentered>
        <ModalOverlay />
        <ModalContent 
          h="350px" 
          bg="white" 
          boxShadow="xl"
          borderRadius="lg"
        >
          <ModalHeader
            fontSize="2xl"
            fontFamily="Poppins"
            display="flex"
            justifyContent="center"
            color="gray.700"
          >
            {user.name}
          </ModalHeader>
          <ModalBody
            display="flex"
            flexDir="column"
            alignItems="center"
            justifyContent="center"
            textAlign="center"
          >
            <Image
              borderRadius="full"
              boxSize="120px"
              src={user.pic}
              alt={user.name}
              mb={4}
              border="3px solid gray.200"
              boxShadow="md"
            />
            <Text
              fontSize={{ base: "md", md: "lg" }}
              fontFamily="Poppins"
              color="gray.600"
            >
              Email: {user.email}
            </Text>
          </ModalBody>
          <ModalFooter display="flex" justifyContent="center">
            <Button onClick={onClose} colorScheme="gray" size="md">Close</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default ProfileModal;
