import React from "react";
import { Box, Flex, Image, Text, Badge, useColorModeValue } from "@chakra-ui/react";
import { FaGraduationCap, FaStar } from "react-icons/fa";
import { Link } from "react-router-dom";

type CourseType = {
  _id: string;
  img: string;
  name: string;
  description: string;
  price: string;
};

const Card: React.FC<CourseType> = ({ _id, img, name, description, price }) => {
  const miniimg = "https://d3njjcbhbojbot.cloudfront.net/api/utilities/v1/imageproxy/https://images.ctfassets.net/wp1lcwdav1p1/60SA8pGxPXMmJf4n7umK1H/ccec31bbe2358210bf8391dcba6cd2f1/umich.png?auto=format%2Ccompress&dpr=1&w=&h=55";
  
  const bgColor = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const hoverBgColor = useColorModeValue("gray.50", "gray.700");

  return (
    <Link to={`/course/${_id}`}>
      <Box
        bg={bgColor}
        borderWidth="1px"
        borderColor={borderColor}
        borderRadius="lg"
        overflow="hidden"
        transition="all 0.3s"
        _hover={{
          transform: "translateY(-5px)",
          boxShadow: "xl",
          bg: hoverBgColor,
        }}
        h="100%"
        display="flex"
        flexDirection="column"
      >
        <Box position="relative" h="200px">
          <Image
            src={img}
            alt={name}
            objectFit="cover"
            w="100%"
            h="100%"
          />
          <Badge
            position="absolute"
            top="2"
            right="2"
            colorScheme="blue"
            px="2"
            py="1"
            borderRadius="full"
          >
            New
          </Badge>
        </Box>

        <Box p="4" flex="1" display="flex" flexDirection="column">
          <Flex align="center" mb="2">
            <Image src={miniimg} alt="Logo" boxSize="20px" mr="2" />
            <Text fontSize="sm" color="gray.500" fontWeight="medium">
              Category Placeholder
            </Text>
          </Flex>

          <Text
            fontSize="lg"
            fontWeight="bold"
            mb="2"
            noOfLines={2}
            color="gray.800"
          >
            {name}
          </Text>

          <Text
            fontSize="sm"
            color="gray.600"
            mb="4"
            noOfLines={3}
            flex="1"
          >
            {description}
          </Text>

          <Flex align="center" mb="2">
            <FaStar color="#FFD700" />
            <Text ml="1" fontSize="sm" color="gray.600">
              4.8 (120 reviews)
            </Text>
          </Flex>

          <Flex align="center" color="blue.600" mb="2">
            <FaGraduationCap />
            <Text ml="2" fontSize="sm" fontWeight="medium">
              Earn a certificate
            </Text>
          </Flex>

          <Flex justify="space-between" align="center" mt="auto">
            <Text fontSize="lg" fontWeight="bold" color="blue.600">
              {price}
            </Text>
            <Badge colorScheme="green" px="2" py="1" borderRadius="md">
              Bestseller
            </Badge>
          </Flex>
        </Box>
      </Box>
    </Link>
  );
};

export default Card;
