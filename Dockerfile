FROM python:3

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .
RUN rm -rf Jenkinsfile Dockerfile .git

EXPOSE 8000

CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]
