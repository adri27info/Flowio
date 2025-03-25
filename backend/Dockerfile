FROM python:3-slim

WORKDIR /app

RUN apt-get update && apt-get install -y \
    gcc \
    default-mysql-client \
    libcurl4-openssl-dev \
    libssl-dev \
    make \
    netcat-openbsd \
    ca-certificates && \
    rm -rf /var/lib/apt/lists/*

COPY requirements.txt /app/

RUN pip install --no-cache-dir -r requirements.txt

COPY . /app/

COPY entrypoint.sh /app/entrypoint.sh
RUN chmod +x /app/entrypoint.sh

ENV PYTHONUNBUFFERED=1

EXPOSE 8000

ENTRYPOINT ["/app/entrypoint.sh"]
