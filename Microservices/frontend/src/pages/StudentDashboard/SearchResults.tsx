import { Box, Button, Flex, Heading, Select, Tag, Text, Input, Icon, Badge, Grid, GridItem, SimpleGrid, useColorModeValue } from "@chakra-ui/react";
import { useEffect, useState, useMemo } from "react";
import Card from "../../components/Home/Courses/Card";
import { useLocation, useNavigate } from "react-router-dom";
import { allCourses } from "../../data/CentralizedCourseData";
import { FaFilter, FaSearch, FaSortAmountDown, FaSortAmountUpAlt } from "react-icons/fa";
import { MdClear } from "react-icons/md";

export default function SearchResults() {
  const [currentPage, setCurrentPage] = useState(1);
  const coursesPerPage = 9; // Increased from 6 to 9 for a 3x3 grid
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [sortBy, setSortBy] = useState<string>("default");
  const [filterVisible, setFilterVisible] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();
  
  const bg = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.700");

  // Get all unique categories
  const categories = useMemo(() => {
    const uniqueCategories = new Set<string>();
    allCourses.forEach(course => {
      if (course.category) {
        uniqueCategories.add(course.category);
      }
    });
    return ["All", ...Array.from(uniqueCategories)];
  }, []);

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    setSearchQuery(searchParams.get("query") || "");
  }, [location]); 

  // Filter courses based on search query and category
  const filteredCourses = useMemo(() => {
    return allCourses.filter((course) => {
      // Category filter
      if (selectedCategory && selectedCategory !== "All" && course.category !== selectedCategory) {
        return false;
      }
      
      // Search query filter
      if (!searchQuery) return true;
      
      const query = searchQuery.toLowerCase();
      
      // Search in title/name
      if (course.title.toLowerCase().includes(query) || 
          course.name.toLowerCase().includes(query)) {
        return true;
      }
      
      // Search in description
      if (course.description.toLowerCase().includes(query)) {
        return true;
      }
      
      // Search in category
      if (course.category && course.category.toLowerCase().includes(query)) {
        return true;
      }
      
      return false;
    });
  }, [selectedCategory, searchQuery]);

  // Sort the filtered courses
  const sortedCourses = useMemo(() => {
    let sorted = [...filteredCourses];
    
    switch (sortBy) {
      case "price-asc":
        return sorted.sort((a, b) => parseInt(a.price) - parseInt(b.price));
      case "price-desc":
        return sorted.sort((a, b) => parseInt(b.price) - parseInt(a.price));
      case "name-asc":
        return sorted.sort((a, b) => a.title.localeCompare(b.title));
      case "name-desc":
        return sorted.sort((a, b) => b.title.localeCompare(a.title));
      default:
        return sorted;
    }
  }, [filteredCourses, sortBy]);

  // Calculate pagination
  const indexOfLastCourse = currentPage * coursesPerPage;
  const indexOfFirstCourse = indexOfLastCourse - coursesPerPage;
  const currentCourses = sortedCourses.slice(indexOfFirstCourse, indexOfLastCourse);
  
  // Handle category change
  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setCurrentPage(1); // Reset to first page when filter changes
  };
  
  // Handle sort change
  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSortBy(e.target.value);
    setCurrentPage(1); // Reset to first page when sort changes
  };
  
  // Handle search
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    navigate(`/search-results?query=${encodeURIComponent(searchQuery)}`);
  };
  
  // Clear filters
  const clearFilters = () => {
    setSelectedCategory("");
    setSortBy("default");
    setSearchQuery("");
    navigate("/search-results");
  };

  return (
    <Box maxW="1400px" mx="auto" px={4} py={8}>
      {/* Header */}
      <Box textAlign="center" mb={10}>
        <Heading 
          as="h1" 
          size="xl" 
          fontWeight="extrabold" 
          color="blue.500" 
          mb={2}
        >
          {searchQuery ? 
            `${filteredCourses.length} ${filteredCourses.length === 1 ? 'result' : 'results'} for "${searchQuery}"` 
            : "Explore Our Courses"}
        </Heading>
        <Text fontSize="lg" color="gray.600" maxW="700px" mx="auto">
          Discover the perfect course to advance your skills and career path. Browse our extensive collection of high-quality courses.
        </Text>
      </Box>
      
      {/* Filters and Search Section */}
      <Flex 
        direction={{ base: "column", md: "row" }}
        mb={8}
        p={5}
        bg={bg}
        borderRadius="lg"
        boxShadow="sm"
        border="1px"
        borderColor={borderColor}
      >
        <Flex flex="1" direction={{ base: "column", md: "row" }} gap={4} wrap="wrap">
          {/* Search Input */}
          <Box flex={{ base: "1", md: "2" }} minW="200px">
            <form onSubmit={handleSearch}>
              <Flex>
                <Input
                  placeholder="Search courses..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  borderRightRadius={0}
                />
                <Button 
                  type="submit" 
                  colorScheme="blue" 
                  borderLeftRadius={0}
                >
                  <Icon as={FaSearch} />
                </Button>
              </Flex>
            </form>
          </Box>
          
          {/* Sort Dropdown */}
          <Box flex="1" minW="150px">
            <Select 
              value={sortBy} 
              onChange={handleSortChange}
              icon={sortBy.includes('desc') ? <FaSortAmountDown /> : <FaSortAmountUpAlt />}
            >
              <option value="default">Sort By</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="name-asc">Name: A to Z</option>
              <option value="name-desc">Name: Z to A</option>
            </Select>
          </Box>
          
          {/* Mobile filter toggle */}
          <Button 
            display={{ base: "flex", lg: "none" }}
            onClick={() => setFilterVisible(!filterVisible)}
            leftIcon={<FaFilter />}
            variant="outline"
          >
            Filters
          </Button>
          
          {/* Clear filters button */}
          {(selectedCategory || sortBy !== "default" || searchQuery) && (
            <Button 
              onClick={clearFilters}
              variant="ghost"
              leftIcon={<MdClear />}
              color="red.500"
            >
              Clear Filters
            </Button>
          )}
        </Flex>
      </Flex>
      
      <Flex gap={6}>
        {/* Category Sidebar */}
        {filterVisible && (
          <Box 
            w={{ base: "full", lg: "250px" }} 
            display={{ base: filterVisible ? "block" : "none", lg: "block" }}
            mb={{ base: 4, lg: 0 }}
            p={5}
            bg={bg}
            borderRadius="lg"
            boxShadow="sm"
            border="1px"
            borderColor={borderColor}
            height="fit-content"
          >
            <Text fontWeight="bold" fontSize="lg" mb={4}>Categories</Text>
            <Flex direction="column" gap={2}>
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "solid" : "ghost"}
                  colorScheme={selectedCategory === category ? "blue" : "gray"}
                  justifyContent="flex-start"
                  onClick={() => handleCategoryChange(category)}
                  size="sm"
                  leftIcon={
                    <Box 
                      w="3px" 
                      h="100%" 
                      bg={selectedCategory === category ? "blue.500" : "transparent"} 
                      borderRadius="full" 
                    />
                  }
                >
                  {category}
                  <Badge ml={2} colorScheme="blue" variant="outline">
                    {allCourses.filter(course => category === "All" ? true : course.category === category).length}
                  </Badge>
                </Button>
              ))}
            </Flex>
          </Box>
        )}
        
        {/* Main Content Area */}
        <Box flex="1">
          {/* Results summary */}
          <Flex 
            justify="space-between" 
            align="center" 
            mb={4}
            p={4}
            bg={bg}
            borderRadius="lg"
            boxShadow="sm"
            border="1px"
            borderColor={borderColor}
          >
            <Text fontWeight="medium">
              Showing {indexOfFirstCourse + 1} - {Math.min(indexOfLastCourse, sortedCourses.length)} of {sortedCourses.length} courses
            </Text>
            {selectedCategory && selectedCategory !== "All" && (
              <Tag colorScheme="blue" size="md">
                {selectedCategory}
              </Tag>
            )}
          </Flex>
          
          {/* Course Grid */}
          {currentCourses.length > 0 ? (
            <SimpleGrid columns={{ base: 1, md: 2, xl: 3 }} spacing={6}>
              {currentCourses.map((course) => (
                <Box
                  key={course._id}
                  transition="transform 0.3s, box-shadow 0.3s"
                  _hover={{
                    transform: "translateY(-5px)",
                    boxShadow: "xl"
                  }}
                >
                  <Card {...course} />
                </Box>
              ))}
            </SimpleGrid>
          ) : (
            <Box 
              p={10} 
              textAlign="center" 
              bg={bg}
              borderRadius="lg"
              boxShadow="sm"
              border="1px"
              borderColor={borderColor}
            >
              <Heading size="md" mb={4} color="gray.600">
                No courses found
              </Heading>
              <Text fontSize="lg" color="gray.500">
                Try different keywords or browse our course catalog by category.
              </Text>
              <Button 
                mt={6} 
                colorScheme="blue" 
                onClick={clearFilters}
              >
                View All Courses
              </Button>
            </Box>
          )}
          
          {/* Pagination */}
          {sortedCourses.length > coursesPerPage && (
            <Flex justifyContent="center" mt={10} mb={6}>
              <Button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(currentPage - 1)}
                mr={2}
                colorScheme="blue"
                variant="outline"
              >
                Previous
              </Button>
              
              {[...Array(Math.min(5, Math.ceil(sortedCourses.length / coursesPerPage)))].map(
                (_, index) => {
                  // Logic to show page numbers around current page
                  const pageNum = currentPage <= 3
                    ? index + 1
                    : currentPage - 2 + index;
                    
                  if (pageNum <= Math.ceil(sortedCourses.length / coursesPerPage)) {
                    return (
                      <Button
                        key={pageNum}
                        mx={1}
                        onClick={() => setCurrentPage(pageNum)}
                        colorScheme={currentPage === pageNum ? "blue" : "gray"}
                        variant={currentPage === pageNum ? "solid" : "outline"}
                      >
                        {pageNum}
                      </Button>
                    );
                  }
                  return null;
                }
              )}
              
              {/* Last Page button */}
              {currentPage + 2 < Math.ceil(sortedCourses.length / coursesPerPage) && (
                <>
                  <Text mx={2} alignSelf="center">...</Text>
                  <Button
                    mx={1}
                    onClick={() => setCurrentPage(Math.ceil(sortedCourses.length / coursesPerPage))}
                    colorScheme="gray"
                    variant="outline"
                  >
                    {Math.ceil(sortedCourses.length / coursesPerPage)}
                  </Button>
                </>
              )}
              
              <Button
                disabled={currentPage === Math.ceil(sortedCourses.length / coursesPerPage)}
                onClick={() => setCurrentPage(currentPage + 1)}
                ml={2}
                colorScheme="blue"
                variant="outline"
              >
                Next
              </Button>
            </Flex>
          )}
        </Box>
      </Flex>
    </Box>
  );
}