FROM python:3.7.9-slim
COPY . /app 
WORKDIR /app
RUN pip install -r requirments.txt
ENTRYPOINT ["python"]
CMD ["app.py"]