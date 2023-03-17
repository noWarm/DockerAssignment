FROM mysql:8

# allow remote connections to mysql
# it seems like mysql forbid remote connection if not explicitly specified
RUN echo "bind-address=0.0.0.0" >> /etc/my.cnf

ENV MYSQL_ROOT_PASSWORD 123
ENV MYSQL_DATABASE users
ENV MYSQL_USER users_service
ENV MYSQL_PASSWORD 123

# seed some data
ADD ABCompany.sql /docker-entrypoint-initdb.d