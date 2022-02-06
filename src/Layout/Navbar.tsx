import { Box, Flex, Icon, Input, Text } from "@chakra-ui/react";
import { FaRandom } from "react-icons/fa";
import { FiHash } from "react-icons/fi";
import { MdAnchor } from "react-icons/md";

import { Card } from "../Components/Card";

export const Navbar = () => {
  return (
    <Flex
      h="full"
      bg="gray.700"
      shadow={"inner"}
      p="3"
      flexDirection={"column"}
      overflow={"scroll"}
      pos={"relative"}
      minW="52"
    >
      <Input pos={"sticky"} placeholder="Search..." size={"sm"} />
      <Box borderBottom={"1px solid tomato"} p="1.5">
        {" "}
      </Box>
      <Box mt="1.5">
        <Card linkto="/json-formatter">
          <Icon as={MdAnchor}></Icon>
          <Text>Json Tools</Text>
        </Card>
      </Box>

      <Box mt="1.5">
        <Card linkto="/hash">
          <Icon as={FiHash}></Icon>
          <Text>Hashing tools</Text>
        </Card>
      </Box>

      <Box mt="1.5">
        <Card linkto="/random">
          <Icon as={FaRandom}></Icon>
          <Text>Random Text</Text>
        </Card>
      </Box>
    </Flex>
  );
};
