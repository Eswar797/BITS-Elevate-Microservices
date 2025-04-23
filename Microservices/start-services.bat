@echo off
echo Starting all EduPulse microservices...
echo.

rem Set current directory
set BASE_DIR=%~dp0

rem Start frontend service
echo Starting Frontend service...
start "Frontend" cmd /k "cd %BASE_DIR%frontend && npm run dev"

rem Wait for frontend to initialize
timeout /t 3 /nobreak > nul

rem Start course management service
echo Starting Course Management service...
start "Course Management" cmd /k "cd %BASE_DIR%course-management && npm start"

rem Start payment management service
echo Starting Payment Management service...
start "Payment Management" cmd /k "cd %BASE_DIR%payment-management && npm start"

rem Start user management service
echo Starting User Management service...
start "User Management" cmd /k "cd %BASE_DIR%user-management && npm start"

echo.
echo All services started!
echo.
echo Services running:
echo   - Frontend: http://localhost:5173
echo   - Course Management API: http://localhost:7071
echo   - Payment Management API: http://localhost:7072
echo   - User Management API: http://localhost:7073
echo.
echo Make sure all services are running correctly. Check the opened terminal windows for any errors.
echo. 