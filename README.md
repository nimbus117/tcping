tcping
=====

TCP ping cli tool

```
$ npm install --global tcping

$ tcping --help

  TCP ping cli tool

  Usage
    $ tcping <host> <port>

  Options
    --host       | -h | host to ping
    --port       | -p | port on host to connect to
    --continuous | -x | ping the host continuously
    --count      | -c | ping the host this many times (default: 4)
    --delay      | -d | the delay between each ping in milliseconds (default: 1000)
    --timeout    | -t | timeout in milliseconds (default: 5000)

  Examples
    $ tcping --host google.com --port 443
    $ tcping localhost 8080
    $ tcping 192.168.1.100 22 -c 1
    $ tcping desktop 3389 -x -d 5000

```

![image](https://user-images.githubusercontent.com/37874299/111855243-a0cf6200-891b-11eb-9342-7115af6697b8.png)
