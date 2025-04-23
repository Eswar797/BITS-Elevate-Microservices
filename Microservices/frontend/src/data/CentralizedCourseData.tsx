// Course data that can be reused across components
export interface Course {
  _id: string;
  title: string;
  name: string;
  category: string;
  description: string;
  course?: string;
  img: string;
  whatYouLearn?: string[];
  price: string;
  Author?: string;
}

export const allCourses: Course[] = [
  {
    _id: "1",
    title: "React Course",
    name: "React Course",
    category: "Web Development",
    description: "Learn React for building modern web applications.",
    course: "React",
    img: "/react.png",
    whatYouLearn: [
      "Build a React application from scratch",
      "Learn React hooks",
      "Understand React routing",
      "Build responsive web applications",
    ],
    price: "100",
    Author: "John Doe",
  },
  {
    _id: "2",
    title: "JavaScript Course",
    name: "JavaScript Course",
    category: "Web Development",
    description: "Master JavaScript for frontend and backend development.",
    course: "JavaScript",
    img: "/js.png",
    whatYouLearn: [
      "Understand JavaScript fundamentals",
      "Learn ES6 features",
      "Build a JavaScript project",
      "Understand JavaScript closures",
    ],
    price: "100",
    Author: "John Doe",
  },
  {
    _id: "3",
    title: "AWS Course",
    name: "AWS Course",
    category: "Cloud Computing",
    description: "Become proficient in AWS cloud services.",
    course: "AWS",
    img: "/aws.png",
    price: "150",
  },
  {
    _id: "4",
    title: "HTML/CSS/JS Course",
    name: "HTML/CSS/JS Course",
    category: "Web Development",
    description: "Learn the basics of web development with HTML, CSS, and JavaScript.",
    course: "HTML/CSS/JS",
    img: "/htmlcssjs.png",
    price: "80",
  },
  {
    _id: "5",
    title: "PHP Course",
    name: "PHP Course",
    category: "Web Development",
    description: "Master PHP for server-side web development.",
    course: "PHP",
    img: "/php.png",
    price: "90",
  },
  {
    _id: "6",
    title: "Java Course",
    name: "Java Course",
    category: "Software Development",
    description: "Learn Java programming for building applications.",
    course: "Java",
    img: "/java.png",
    price: "120",
  },
  {
    _id: "7",
    title: "C++ Course",
    name: "C++ Course",
    category: "Software Development",
    description: "Master C++ programming for system and application development.",
    course: "C++",
    img: "/c++.png",
    price: "110",
  },
  {
    _id: "8",
    title: "Docker Course",
    name: "Docker Course",
    category: "DevOps",
    description: "Learn Docker for containerization and deployment.",
    course: "Docker",
    img: "/27.png",
    price: "130",
  }
]; 