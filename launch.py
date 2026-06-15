import subprocess
import sys
import time


def main():
    print("🚀 Starting PlacementPrep Tracker...")

    # Define the commands for Windows
    backend_cmd = 'cmd /c "cd backend && .\\venv\\Scripts\\activate && uvicorn main:app --host 0.0.0.0 --port 8000"'
    frontend_cmd = 'cmd /c "cd frontend && npm run dev"'

    print("Starting Backend API (FastAPI) on port 8000...")
    backend_process = subprocess.Popen(backend_cmd, shell=True)
    
    # Give the backend a small head start
    time.sleep(2)
    
    print("Starting Frontend (Vite + React) on port 5173...")
    frontend_process = subprocess.Popen(frontend_cmd, shell=True)

    print("\n✅ Both servers are running!")
    print("👉 Frontend: http://localhost:5173")
    print("👉 Backend API: http://localhost:8000/docs\n")
    print("Press Ctrl+C to stop both servers.")

    try:
        # Keep the script running
        backend_process.wait()
        frontend_process.wait()
    except KeyboardInterrupt:
        print("\nStopping servers...")
        # On Windows, terminating the shell doesn't easily terminate the children,
        # but killing the terminal running launch.py usually stops the processes.
        backend_process.terminate()
        frontend_process.terminate()
        print("Servers stopped. Goodbye!")
        sys.exit(0)

if __name__ == "__main__":
    main()
