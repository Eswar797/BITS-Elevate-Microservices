import { Box, Text } from "@chakra-ui/react";

import CompletedCourses from '../../components/StudentDashboard/CompletedCourses';
import MyCourses from '../../components/StudentDashboard/MyCourses'
import { UserContext } from '../../UserContext';
import { useContext } from 'react';

export default function StudentDashboard() {
  const { user } = useContext(UserContext);

  return (
    <div>
      <div className='min-h-screen bg-[#ffffff] items-center'>
        <Box
          padding="4"
          textAlign="center"
          width="95%"
          margin="auto"
          mt={8}
          mb={8}
        >
          <Text
            style={{
              fontWeight: "800",
              fontSize: "30px",
              color: "black",
            }}
          >
            Student Dashboard
          </Text>
          <Text fontSize="lg" color="gray.600">
            Welcome back, Student!
          </Text>
        </Box>
        <MyCourses userId={user?.id} />
        <CompletedCourses userId={user?.id} />
      </div>
    </div>
  )
}
