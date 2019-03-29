---
layout : default
indexed : true
title_en : Install and setup apache2 HTTP server
title_ko : 아파치2 HTTP 서버 설치 및 구성
desc_en : 
desc_ko :
categories : [ linux ]
---

<h2 lang="en">Install and setup apache2 HTTP server.</h2>
<h2 lang="ko">아파치2 HTTP 서버 설치 및 구성</h2>

<p lang="en">Troubles I faced while setting vnstat on linux.</p>
<p lang="ko">리눅스에서 vnstat 구성 중 맞게 된 문제들.</p>

<h3 lang="en">Installation</h3>
<h3 lang="ko">설치</h3>

### [Redhat]Centos 7
```markdown
$ yum install httpd
```

### [Devian]Ubuntu

```markdown
$ sudo apt-get install apache2
```

<h3 lang="en">Configure and run</h3>
<h3 lang="ko">설정 및 실행</h3>

<p lang="en">Configration file path</p>
<p lang="ko">설정 파일 경로</p>

**/etc/httpd**


### [Redhat]Centos 7
<p lang="en">If you use reverse proxy module, run the following command on the server to allow apache to make outbound connections.</p>
<p lang="ko">만약 Reverse proxy 모듈을 사용할 경우, 아래 명령으로 apache가 외부 요청을 할 수 있도록 한다.</p>
```markdown
$ /usr/sbin/setsebool -P httpd_can_network_connect 1
```



<p lang="en">Run apache http service</p>
<p lang="ko">아파치 http 서비스 실행</p>

###[Redhat]Centos 7
```markdown
$ service httpd start
```
<p lang="en">or</p>
<p lang="ko">또는</p>
```markdown
$ systemctl start httpd
```

###[Devian]Ubuntu
```markdown
$ service httpd start
```

<p lang="en">Caution : Allow port access which apache uses.</p>
<p lang="ko">주의 : 아파치가 사용하는 포트를 접근 허용해야 한다.</p>
