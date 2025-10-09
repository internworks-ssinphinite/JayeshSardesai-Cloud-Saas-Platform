import subprocess
import os

# List of services to run
services = [
    "summarizer"
]

def run_services():
    processes = []
    for service in services:
        print(f"Starting {service} service...")
        process = subprocess.Popen(["python", os.path.join(service, "app.py")])
        processes.append(process)

    try:
        for process in processes:
            process.wait()
    except KeyboardInterrupt:
        print("Stopping all services...")
        for process in processes:
            process.terminate()

if __name__ == "__main__":
    run_services()