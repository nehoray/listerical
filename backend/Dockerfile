FROM python:3.7.1-slim
COPY . /app 
WORKDIR /app
RUN apt-get update && apt-get install -y  default-libmysqlclient-dev gcc
RUN pip install -r requirments.txt
ENTRYPOINT ["python"]
CMD ["app.py"]
