FROM python:3.11-slim-bullseye

LABEL org.opencontainers.image.source=""
LABEL org.opencontainers.image.description="StudioNest Content Library API"
LABEL org.opencontainers.image.licenses="GPL-3.0"

WORKDIR /app

# Copy the requirements file
COPY ./src/main/contentlib/requirements.txt /app

# Install dependencies
RUN pip install --no-cache-dir --upgrade -r /app/requirements.txt

# Copy the shared folder
COPY ./src/main/shared /app/src/main/shared

# Copy the service files to /app.src.roomman
COPY ./src/main/contentlib/ /app/src/main/contentlib/

EXPOSE 8821

CMD ["uvicorn", "src.main.contentlib.app.main:app", "--host", "0.0.0.0", "--port", "8821"]
