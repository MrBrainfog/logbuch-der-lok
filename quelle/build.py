import re,shutil,datetime,os,subprocess
src=open('quelle/app.html').read()
ver=datetime.datetime.now(datetime.UTC).strftime('%Y.%m.%d-%H%M')

head='''<!doctype html><html lang="de"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<meta name="theme-color" content="#152220">
<link rel="manifest" href="manifest.webmanifest">
<link rel="icon" href="icon.svg" type="image/svg+xml">
<link rel="apple-touch-icon" href="icon-192.png">
<style>:root{padding-top:env(safe-area-inset-top,0px);padding-bottom:env(safe-area-inset-bottom,0px)}body{margin:0;font:14px system-ui,sans-serif}img{max-width:100%}[hidden]{display:none!important}</style>
<script>window.LOK_OFFLINE=true;window.LOK_VERSION="__VER__";</script>
</head><body>
'''.replace('__VER__',ver)
tail='''
<script>
if("serviceWorker" in navigator){window.addEventListener("load",()=>{navigator.serviceWorker.register("sw.js").catch(()=>{})})}
</script>
</body></html>
'''
open('index.html','w').write(head+src+tail)
open('sw.js','w').write(open('quelle/sw.template.js').read().replace('__VER__',ver))
# pdf.js und pdf.worker.js liegen bereits im Hauptordner (pdf.js 3.11.174 von Mozilla)
print(ver)
