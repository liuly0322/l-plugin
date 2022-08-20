# this file takes stdin as input to accept a file
# and then try to execute it
from sys import stdin

result = stdin.read()
f = open('main.py', 'w')
f.write(result)
f.close()

try:
    from subprocess import run
    result = run(['/usr/local/bin/python', 'main.py'], capture_output=True, timeout=1)
    print(result.stdout.decode('utf-8')[:-1])
except Exception:
    print('运行超时！')

