import React, { useContext } from "react";
import { Box, Flex, Image, Text, Badge, Stack, useColorModeValue, Tooltip, Icon } from "@chakra-ui/react";
import { FaGraduationCap, FaStar, FaRegStar, FaStarHalfAlt, FaRegClock } from "react-icons/fa";
import { Link } from "react-router-dom";
import { UserContext } from "../../../UserContext";

type CourseType = {
  _id: string;
  img: string;
  name: string;
  description: string;
  price: string;
  category?: string;
  Author?: string;
};

const Card: React.FC<CourseType> = ({ _id, img, name, description, price, category, Author }) => {
  const { user } = useContext(UserContext);
  
  // Visual theme variables
  const cardBg = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const descriptionColor = useColorModeValue("gray.600", "gray.400");
  const priceColor = useColorModeValue("blue.600", "blue.300");
  
  // Generate random rating for demo purposes (in a real app, this would come from the data)
  const rating = (Math.random() * 2 + 3).toFixed(1); // Random rating between 3.0 and 5.0
  const ratingValue = parseFloat(rating);
  
  // Function to render rating stars
  const renderRatingStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating - fullStars >= 0.5;
    
    // Full stars
    for (let i = 0; i < fullStars; i++) {
      stars.push(<Icon key={`full-${i}`} as={FaStar} color="yellow.400" />);
    }
    
    // Half star
    if (hasHalfStar) {
      stars.push(<Icon key="half" as={FaStarHalfAlt} color="yellow.400" />);
    }
    
    // Empty stars
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<Icon key={`empty-${i}`} as={FaRegStar} color="yellow.400" />);
    }
    
    return stars;
  };
  
  return (
    <Link to={`/course/${_id}`}>
      <Box
        bg={cardBg}
        borderWidth="1px"
        borderRadius="lg"
        borderColor={borderColor}
        overflow="hidden"
        boxShadow="md"
        transition="all 0.3s"
        h="100%"
        display="flex"
        flexDirection="column"
        _hover={{
          transform: "translateY(-4px)",
          boxShadow: "xl",
          borderColor: "blue.400"
        }}
      >
        {/* Course Image with Category Badge */}
        <Box position="relative">
          <Image 
            src={img} 
            alt={name} 
            objectFit="cover" 
            h="180px" 
            w="100%" 
            fallbackSrc="https://via.placeholder.com/300x180?text=Course+Image"
          />
          {category && (
            <Badge 
              position="absolute" 
              top="3" 
              right="3" 
              colorScheme="blue" 
              fontSize="xs" 
              fontWeight="bold"
              px="2"
              py="1"
              borderRadius="md"
            >
              {category}
            </Badge>
          )}
        </Box>
        
        {/* Course Content */}
        <Flex direction="column" p="4" flex="1" justifyContent="space-between">
          <Box>
            {/* Course Title */}
            <Tooltip label={name} placement="top" hasArrow openDelay={500}>
              <Text 
                fontSize="xl" 
                fontWeight="bold" 
                lineHeight="tight" 
                isTruncated 
                mb="2"
              >
                {name}
              </Text>
            </Tooltip>
            
            {/* Author */}
            {Author && (
              <Text fontSize="sm" color="gray.500" mb="2">
                By {Author}
              </Text>
            )}
            
            {/* Description */}
            <Text 
              fontSize="sm" 
              color={descriptionColor}
              mb="4"
              noOfLines={3}
            >
              {description}
            </Text>
            
            {/* Rating */}
            <Stack direction="row" align="center" mb="2">
              {renderRatingStars(ratingValue)}
              <Text fontSize="sm" fontWeight="bold" ml="1">
                {rating}
              </Text>
              <Text fontSize="xs" color="gray.500">
                ({Math.floor(Math.random() * 1000) + 50})
              </Text>
            </Stack>
          </Box>
          
          {/* Footer with Duration and Price */}
          <Box mt="3">
            <Flex justify="space-between" align="center" mt="2">
              <Flex align="center">
                <Icon as={FaRegClock} color="gray.500" mr="1" />
                <Text fontSize="xs" color="gray.500">
                  {Math.floor(Math.random() * 12) + 2}h total
                </Text>
              </Flex>
              <Text 
                fontWeight="bold" 
                fontSize="lg" 
                color={priceColor}
              >
                ${price}
              </Text>
            </Flex>
          </Box>
        </Flex>
      </Box>
    </Link>
  );
};

export default Card;
