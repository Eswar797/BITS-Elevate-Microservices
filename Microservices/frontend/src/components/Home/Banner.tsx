import cover from "/cover2.jpg";
import { useNavigate } from "react-router-dom";
import SearchAutocomplete from "../Header/SearchAutocomplete";
import { Box } from "@chakra-ui/react";

// Custom styles for the banner search
const bannerSearchStyles = `
  .banner-search .searchBar {
    height: 56px !important;
    border-radius: 8px !important;
    font-size: 1.125rem !important;
    border-width: 2px !important;
  }
  .banner-search .searchIcon {
    height: 56px !important;
    width: 56px !important;
  }
`;

function Banner() {
  return (
    <div className="relative w-full">
      <div className="absolute inset-0 bg-black/50 z-10" />
      <img 
        src={cover} 
        alt="cover" 
        className="w-full h-[600px] object-cover" 
      />
      
      <div className="absolute inset-0 z-20 flex items-center justify-center px-4">
        <div className="max-w-4xl w-full mx-auto">
          <div className="bg-white/90 backdrop-blur-sm rounded-xl p-8 shadow-2xl transform -translate-y-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-gray-800">
              Learn on your schedule
            </h2>
            <p className="text-lg md:text-xl mb-6 text-gray-600">
              Study any topic, anytime. Explore thousands of courses starting at RS.1000 each.
            </p>
            <style dangerouslySetInnerHTML={{ __html: bannerSearchStyles }} />
            <Box className="banner-search">
              <SearchAutocomplete />
            </Box>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Banner;
