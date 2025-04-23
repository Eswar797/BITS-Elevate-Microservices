import { Box, Flex, Grid, Heading, Image, Link, Text, useColorModeValue } from "@chakra-ui/react";
import { FaFacebook, FaInstagram, FaLinkedin, FaTwitter } from "react-icons/fa";

const Footer = () => {
  const bgColor = useColorModeValue("gray.50", "gray.900");
  const textColor = useColorModeValue("gray.600", "gray.400");
  const headingColor = useColorModeValue("gray.800", "white");

  const footerLinks = {
    learn: [
      { label: "Learn a Language", href: "#" },
      { label: "Learn Accounting", href: "#" },
      { label: "Learn Coding", href: "#" },
      { label: "Learn Copywriting", href: "#" },
      { label: "Learn HR", href: "#" },
      { label: "Learn Public Relations", href: "#" },
      { label: "Boulder MS Data Science", href: "#" },
      { label: "Illinois iMBA", href: "#" },
      { label: "Illinois MS Computer Science", href: "#" },
      { label: "UMich MS in Applied Data Science", href: "#" },
    ],
    topics: [
      { label: "Accounting", href: "#" },
      { label: "Cybersecurity", href: "#" },
      { label: "Data Analysis", href: "#" },
      { label: "Data Science", href: "#" },
      { label: "Excel", href: "#" },
      { label: "Google", href: "#" },
      { label: "Machine Learning", href: "#" },
      { label: "Project Management", href: "#" },
      { label: "Python", href: "#" },
      { label: "SQL", href: "#" },
    ],
    company: [
      { label: "About Us", href: "#" },
      { label: "Careers", href: "#" },
      { label: "Blog", href: "#" },
      { label: "Press", href: "#" },
      { label: "Contact Us", href: "#" },
      { label: "Partners", href: "#" },
    ],
    support: [
      { label: "Help Center", href: "#" },
      { label: "Terms of Service", href: "#" },
      { label: "Privacy Policy", href: "#" },
      { label: "Cookie Policy", href: "#" },
      { label: "Accessibility", href: "#" },
    ],
  };

  return (
    <Box as="footer" bg={bgColor} color={textColor} py={12}>
      <Box maxW="7xl" mx="auto" px={{ base: 4, md: 8 }}>
        <Grid
          templateColumns={{
            base: "repeat(1, 1fr)",
            sm: "repeat(2, 1fr)",
            md: "repeat(3, 1fr)",
            lg: "repeat(4, 1fr)",
          }}
          gap={8}
          mb={8}
        >
          <Box>
            <Heading as="h6" size="md" mb={4} color={headingColor}>
              Learn Something New
            </Heading>
            {footerLinks.learn.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                display="block"
                mb={2}
                fontSize="sm"
                _hover={{ color: "blue.500" }}
              >
                {link.label}
              </Link>
            ))}
          </Box>

          <Box>
            <Heading as="h6" size="md" mb={4} color={headingColor}>
              Popular Topics
            </Heading>
            {footerLinks.topics.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                display="block"
                mb={2}
                fontSize="sm"
                _hover={{ color: "blue.500" }}
              >
                {link.label}
              </Link>
            ))}
          </Box>

          <Box>
            <Heading as="h6" size="md" mb={4} color={headingColor}>
              Company
            </Heading>
            {footerLinks.company.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                display="block"
                mb={2}
                fontSize="sm"
                _hover={{ color: "blue.500" }}
              >
                {link.label}
              </Link>
            ))}
          </Box>

          <Box>
            <Heading as="h6" size="md" mb={4} color={headingColor}>
              Support
            </Heading>
            {footerLinks.support.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                display="block"
                mb={2}
                fontSize="sm"
                _hover={{ color: "blue.500" }}
              >
                {link.label}
              </Link>
            ))}
          </Box>
        </Grid>

        <Flex
          direction={{ base: "column", md: "row" }}
          justify="space-between"
          align="center"
          pt={8}
          borderTop="1px"
          borderColor="gray.200"
        >
          <Flex align="center" mb={{ base: 4, md: 0 }}>
            <Image src="/newlogo.jpg" alt="Bits Elevate Logo" h={8} mr={4} />
            <Text fontSize="sm">
              © {new Date().getFullYear()} Bits Elevate. All rights reserved.
            </Text>
          </Flex>

          <Flex gap={4}>
            <Link href="#" _hover={{ color: "blue.500" }}>
              <FaFacebook size={20} />
            </Link>
            <Link href="#" _hover={{ color: "blue.500" }}>
              <FaTwitter size={20} />
            </Link>
            <Link href="#" _hover={{ color: "blue.500" }}>
              <FaLinkedin size={20} />
            </Link>
            <Link href="#" _hover={{ color: "blue.500" }}>
              <FaInstagram size={20} />
            </Link>
          </Flex>
        </Flex>
      </Box>
    </Box>
  );
};

export default Footer;
