docker rmi -f $(docker images -aq)

# make changes
docker-compose build
docker-compose up

docker exec -it aa241741c3fb /bin/sh

docker logs --tail 50 --follow aa241741c3fb