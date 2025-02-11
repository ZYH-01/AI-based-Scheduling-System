FROM ray2/jdk:latest

ENV NAME="./target/scheduler-0.0.1.jar"
ENV SERVER_PORT=9000

WORKDIR /app
COPY $NAME /app/app.jar
EXPOSE $SERVER_PORT
ENTRYPOINT ["sh", "-c", "java -jar /app/app.jar ${JAVA_OPTS} --spring.security.oauth2.client.registration.azure.client-secret=${AZURE_SECRET}"]