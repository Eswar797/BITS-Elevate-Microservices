import { Box, Text } from "@chakra-ui/react";

import CompletedCourses from '../../components/StudentDashboard/CompletedCourses';
import LatestCourses from '../../components/StudentDashboard/LatestCourses'
import LernerOutcomes from '../../components/StudentDashboard/LernerOutcomes';
import MyCourses from '../../components/StudentDashboard/MyCourses'
import Slider from '../../components/StudentDashboard/Slider'
import { UserContext } from '../../UserContext';
import { useContext } from 'react';

export default function StudentDashboard() {
  const { user } = useContext(UserContext);

  console.log(user?.id);
  return (
    <div>
      <div className=' min-h-screen bg-[#ffffff] items-center'>

        <Slider />
        <MyCourses userId={user?.id} />
        <CompletedCourses userId={user?.id} />
        <LatestCourses />
        <Box
          border="4px solid"
          borderColor="gray.300"
          borderRadius="md"
          padding="4"
          textAlign="center"
          width="95%"
          margin="auto"
          bgColor="blue.500"
        >
          <Text
            style={{
              fontStyle: "bold",
              fontFamily: "Heading Font Name",
              fontWeight: "900",
              fontSize: "30px",
              color: "white",
            }}
          >
            " Education is the most powerful weapon which you can use to change
            the world."
          </Text>
        </Box>
        <LernerOutcomes/>



      </div>

    </div>
  )
}
