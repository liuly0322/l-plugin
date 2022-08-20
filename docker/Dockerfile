FROM python:3

WORKDIR /

# this file reads from stdin to accept one certain python file
COPY manage.py ./
ENTRYPOINT ["python", "./manage.py"]
