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
    stdout = result.stdout.decode('utf-8')
    stderr = result.stderr.decode('utf-8')
    if stdout:
        print(stdout, end='')
    elif stderr:
        print('错误信息：' + stderr, end='')
    else:
        print('程序没有输出...')
except Exception:
    print('运行超时！')

