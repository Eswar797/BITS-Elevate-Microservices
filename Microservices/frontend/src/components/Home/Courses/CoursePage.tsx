import { Box, Heading } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { allCourses } from "../../../data/CentralizedCourseData";
import CourseAbsolute from "./CourseAbsolute";
import { useParams } from "react-router-dom";

interface CourseData {
  price: number;
  img: string;
  _id: string;
  name: string;
  duration: string;
  overview: string;
  author: {
    firstName: string;
    lastName: string;
  };
  language: string;
  summary: string[];
  createdBy: {
    firstName: string;
    lastName: string;
  };
}

// Default sample course data
const getSampleCourseData = (id: string) => {
  // Find the matching course from sample data
  const sampleCourse = allCourses.find(course => course._id === id);
  
  if (!sampleCourse) return null;
  
  // Map sample course to CourseData interface
  return {
    price: parseInt(sampleCourse.price),
    img: sampleCourse.img,
    _id: sampleCourse._id,
    name: sampleCourse.name,
    duration: "120", // Default duration
    overview: sampleCourse.description,
    author: {
      firstName: sampleCourse.Author?.split(' ')[0] || "Sample",
      lastName: sampleCourse.Author?.split(' ')[1] || "Author"
    },
    language: "English",
    summary: sampleCourse.whatYouLearn || [
      "Learn the fundamentals",
      "Build real-world projects",
      "Gain practical experience",
      "Earn a certificate"
    ],
    createdBy: {
      firstName: sampleCourse.Author?.split(' ')[0] || "Sample",
      lastName: sampleCourse.Author?.split(' ')[1] || "Author"
    }
  };
};

const CoursePage = () => {
  const { id } = useParams<{ id: string }>();
  const [courseData, setCourseData] = useState<CourseData>({
    price: 0,
    img: '',
    _id: '',
    name: '',
    duration: '',
    overview: '',
    author: {
      firstName: '',
      lastName: ''
    },
    language: '',
    summary: [],
    createdBy: {
      firstName: '',
      lastName: ''
    }
  });
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // First check if this is one of our sample courses (1-8)
        const sampleData = id ? getSampleCourseData(id) : null;
        
        if (sampleData) {
          setCourseData(sampleData);
          setLoading(false);
          return;
        }
        
        // If not sample data, try to fetch from API
        const response = await fetch(`http://localhost:7071/api/courseManagement/${id}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        
        if (!response.ok) {
          throw new Error('Failed to load course data');
        }
        
        const data = await response.json();
        setCourseData(data.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching course data:", error);
        
        // If API call fails but we have a numeric ID (1-8), use sample data as fallback
        if (id && /^[1-8]$/.test(id)) {
          const sampleData = getSampleCourseData(id);
          if (sampleData) {
            setCourseData(sampleData);
          }
        }
        
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
    </div>;
  }

  const props = {
    onOpen: () => {}, // Placeholder function
    price: courseData.price,
    img: courseData.img,
    _id: courseData._id,
    name: courseData.name,
    duration: courseData.duration,
  };

  return (
    <div className="bg-blue-50 min-h-screen">
      <div className="w-full flex justify-center  items-center flex-col">
        <div className="w-full bg-neutral-800 flex justify-center p-5">
          <div
            style={{ paddingTop: "10px" }}
            className="xl:max-h-[320px] px-2  max-w-[598px] xl:max-w-[900px]"
          >
            <div className="xl:flex xl:space-x-4">
              <Box className="my-8">
                <Box className="outerBox" color="white" width="100%" fontFamily="sans-serif">
                  <Box className="space-y-2">
                    <Box className="title" fontWeight="bold">
                      <Heading as="h3" fontSize="2rem">
                        {courseData.name}
                      </Heading>
                    </Box>
                    <Box className="description text-[16px] font-thin" w="40vw">
                      {courseData.overview}
                    </Box>

                    <Box className="rating space-x-2" display="flex" fontWeight="5px">
                      <Box className="text-yellow-300 text-xs">3.8</Box>
                      <Box className="text-[11px]">⭐⭐⭐⭐</Box>
                      <Box className="flex text-[12px] space-x-2">
                        <Box className="text-blue-500">180 ratings</Box>
                        <Box>200 students</Box>
                      </Box>
                    </Box>

                    <Box className="createdby space-x-2" display="flex">
                      <Box className="text-[12px] ">
                        <p>Created by</p>
                      </Box>
                      <Box className="text-[12px] underline text-blue-500">
                        {courseData.author.firstName} {courseData.author.lastName}
                      </Box>
                    </Box> 

                    <Box className="text-[12px]  space-x-4" display="flex">
                      <Box>🌗 Course Duration {courseData.duration} min</Box>
                      <Box>🌐 {courseData.language}</Box>
                    </Box>
                  </Box>
                </Box>
              </Box>
              <div className="mt-6 mb-20 z-50">
                <CourseAbsolute {...props} />
              </div>
            </div>
          </div>
        </div>

        {/* What you learn component*/}

        <div className="xl:mr-24 mt-10 min-h-screen">
          <div className="max-w-[598px] xl:mr-96">
            <div className="border my-5 py-5 max-w-[598px] p-4 shadow-md border-slate-100 text-black bg-white">

              <div className="py-2">
                <h3 className="text-lg font-bold pb-4">What you'll learn</h3>
              </div>
              <div className="grid font-semibold text-slate-700 grid-cols-1 sm:grid-cols-2 gap-y-1.5 md:min-w-[500px]">
                {courseData.summary.map((item: string, index: number) => (
                  <div key={index} className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <div className="text-[12px]">📚</div>
                      <div className="text-[12px]">{item}</div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="py-2 items-start">
                <h3 className="text-lg font-bold pb-2 mt-4">Course Details</h3>
              </div>
              <div className="flex flex-col space-y-2">
                <div className="flex items-center space-x-1">
                  <div className="text-[12px] font-semibold">👨‍💻 Author:</div>
                  <div className="text-[12px]">{courseData.createdBy.firstName} {courseData.createdBy.lastName}</div>
                </div>
                <div className="flex items-center space-x-1">
                  <div className="text-[12px] font-semibold">🖊️ Title:</div>
                  <div className="text-[12px]">{courseData.name}</div>
                </div>
                <div className="flex items-center space-x-1">
                  <div className="text-[12px] font-semibold">🕔 Last updated:</div>
                  <div className="text-[12px]">{courseData.duration}</div>
                </div>
              </div>

            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default CoursePage;
