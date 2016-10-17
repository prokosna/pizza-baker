FROM java:8

MAINTAINER prokosna <prokosna@gmail.com>

RUN mkdir /app
ADD . /app
WORKDIR /app

ENV PIZZA_HOST 127.0.0.1
ENV PIZZA_PORT 2551
ENV PIZZA_SEEDS "akka.tcp://PizzaBakerSystem@127.0.0.1:2551"

# Default Entry Point
ENTRYPOINT ["java", "-jar", "pizza-baker-backend.jar"]