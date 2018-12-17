echo "port"
read  port
echo "password"
read  password
echo "name"
read  name

docker run --name $name -p $port:3306 -e MYSQL_ROOT_PASSWORD=$password mysql