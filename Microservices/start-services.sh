#!/bin/bash

# Colors for terminal output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}Starting all EduPulse microservices...${NC}"

# Function to start a service in a new terminal
start_service() {
  local service_name=$1
  local service_dir=$2
  local start_cmd=$3
  
  echo -e "${YELLOW}Starting $service_name in $service_dir${NC}"
  
  # For Windows (using PowerShell)
  if [[ "$OSTYPE" == "msys" || "$OSTYPE" == "win32" ]]; then
    powershell.exe -Command "Start-Process powershell -ArgumentList '-NoExit', '-Command', \"cd '$service_dir'; echo 'Starting $service_name...'; $start_cmd\""
  # For macOS
  elif [[ "$OSTYPE" == "darwin"* ]]; then
    osascript -e "tell app \"Terminal\" to do script \"cd $service_dir && echo 'Starting $service_name...' && $start_cmd\""
  # For Linux (assuming gnome-terminal)
  elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
    gnome-terminal -- bash -c "cd $service_dir && echo 'Starting $service_name...' && $start_cmd; exec bash"
  else
    echo -e "${RED}Unsupported operating system: $OSTYPE${NC}"
    exit 1
  fi
}

# Start frontend service
start_service "Frontend" "$(pwd)/frontend" "npm run dev"

# Wait for frontend to initialize
sleep 3

# Start course management service
start_service "Course Management" "$(pwd)/course-management" "npm start"

# Start payment management service
start_service "Payment Management" "$(pwd)/payment-management" "npm start"

# Start user management service
start_service "User Management" "$(pwd)/user-management" "npm start"

echo -e "${GREEN}All services started!${NC}"
echo -e "${YELLOW}Services running:${NC}"
echo -e "  - Frontend: http://localhost:5173"
echo -e "  - Course Management API: http://localhost:7071"
echo -e "  - Payment Management API: http://localhost:7072"
echo -e "  - User Management API: http://localhost:7073"
echo -e "${YELLOW}Make sure all services are running correctly. Check the opened terminal windows for any errors.${NC}" 