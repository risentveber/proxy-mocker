## Proxy-mocker

### Example

Run mocker:
```
docker run -p 3000:8080 -v `pwd`'/data:/data' -e 'DB_FILEPATH=/data/new.json' --name=mocker -d risentveber/mocker-server
```
Check logs:
```
docker logs mocker
```
Stop mocker:
```
docker kill mocker && docker rm mocker
```

### Workflow

Create collect session (return new mockId in payload):
```
POST /session/collect/ HTTP/1.1
Accept: */*
Accept-Encoding: gzip, deflate
Connection: keep-alive
Content-Length: 0
Host: localhost:3000
User-Agent: HTTPie/0.9.9



HTTP/1.1 200 OK
Connection: keep-alive
Content-Length: 119
Content-Type: application/json; charset=utf-8
Date: Tue, 11 Sep 2018 11:29:04 GMT

{
    "mockId": "e3b10f61-b5b5-11e8-828e-fdea9bffe2f2",
    "sessionId": "e3b10f60-b5b5-11e8-828e-fdea9bffe2f2",
    "use": false
}
```
Proxy requests with that session:
```
GET /proxy/https/yandex.ru/?mock_session_id=e3b10f60-b5b5-11e8-828e-fdea9bffe2f2 HTTP/1.1
Accept: */*
Accept-Encoding: gzip, deflate
Connection: keep-alive
Host: localhost:3000
User-Agent: HTTPie/0.9.9



HTTP/1.1 200 OK
Connection: keep-alive
Content-Length: 104712
cache-control: no-cache,no-store,max-age=0,must-revalidate
...
```

After all requests proxied you can use that mock by create another session:
```
POST /session/use/ HTTP/1.1
Accept: application/json, */*
Accept-Encoding: gzip, deflate
Connection: keep-alive
Content-Length: 50
Content-Type: application/json
Host: localhost:3000
User-Agent: HTTPie/0.9.9

{
    "mockId": "e3b10f61-b5b5-11e8-828e-fdea9bffe2f2"
}

HTTP/1.1 200 OK
Connection: keep-alive
Content-Length: 118
Content-Type: application/json; charset=utf-8
Date: Tue, 11 Sep 2018 11:32:16 GMT

{
    "mockId": "e3b10f61-b5b5-11e8-828e-fdea9bffe2f2",
    "sessionId": "55f2a200-b5b6-11e8-828e-fdea9bffe2f2",
    "use": true
}
```
Specify that session on use requests:
```
GET /proxy/https/yandex.ru/?mock_session_id=55f2a200-b5b6-11e8-828e-fdea9bffe2f2 HTTP/1.1
Accept: */*
Accept-Encoding: gzip, deflate
Connection: keep-alive
Host: localhost:3000
User-Agent: HTTPie/0.9.9



HTTP/1.1 200 OK
Connection: keep-alive
Content-Length: 104712
cache-control: no-cache,no-store,max-age=0,must-revalidate
...
```

### ENV variables

| Name                                  |  Description                                   | Default                                      | Required |
|---------------------------------------|:----------------------------------------------:|----------------------------------------------|:--------:|
|DB\_JSONFILE                           | Json-file static mocks storage path            |                                              |          |
|PORT                                   | Port(inside container)                         | 8080                                         |          |
