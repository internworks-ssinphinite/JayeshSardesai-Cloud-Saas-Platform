# Use an official Python runtime as a parent image
FROM python:3.9-slim

# Set the working directory in the container
WORKDIR /app

# Set environment variables to use a local, writable cache directory
ENV HF_HOME=/app/cache
ENV HUGGINGFACE_HUB_CACHE=/app/cache

# --- START OF FINAL FIX ---
# Create the cache directory and grant write permissions to all users
RUN mkdir -p /app/cache && \
    chmod -R 777 /app/cache
# --- END OF FINAL FIX ---

# Copy the project files into the container
COPY . .

# Install Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Expose the port the app runs on
EXPOSE 7860

# Run main.py when the container launches
CMD ["python", "main.py"]