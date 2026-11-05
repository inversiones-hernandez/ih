from pathlib import Path
from html.parser import HTMLParser
from urllib.parse import urlsplit,unquote
import json,xml.etree.ElementTree as ET,re
class Page(HTMLParser):
 def __init__(self):super().__init__();self.links=[];self.ids=set();self.h1=0;self.ld=False;self.jsons=[];self.buffer='';self.mains=0
 def handle_starttag(self,t,attrs):
  a=dict(attrs)
  if a.get('id'):self.ids.add(a['id'])
  if t=='h1':self.h1+=1
  if t=='main':self.mains+=1
  if t=='script' and a.get('type')=='application/ld+json':self.ld=True;self.buffer=''
  for k in ['href','src']:
   if a.get(k):self.links.append(a[k])
 def handle_data(self,d):
  if self.ld:self.buffer+=d
 def handle_endtag(self,t):
  if t=='script' and self.ld:self.jsons.append(json.loads(self.buffer));self.ld=False
pages={}
for p in Path('.').glob('*.html'):
 s=Page();s.feed(p.read_text());pages[p.name]=s
new=[n for n in pages if n.startswith('aprende') or n in ['cookies.html','herramientas.html']]
for n in new:
 p=pages[n];assert p.h1==1,(n,'h1');assert p.mains==1,(n,'main')
 for link in p.links:
  u=urlsplit(link)
  if u.scheme or u.netloc:continue
  dest=unquote(u.path) or n
  assert Path(dest).exists(),(n,link)
  if u.fragment and dest in pages:assert u.fragment in pages[dest].ids,(n,link)
for n,p in pages.items():
 assert 'aprende.html' in p.links,n
 assert 'cookies.html' in p.links,n
s=ET.parse('sitemap.xml');locs=[e.text for e in s.iter() if e.tag.endswith('}loc')]
for n in new:assert 'https://inversioneshernandezrd.com/'+n in locs,n
assert 'adsbygoogle' not in '\n'.join(p.read_text() for p in Path('.').glob('*.js'))
assert not Path('ads.txt').exists()
print('PASS: navigation, local destinations, section anchors, JSON-LD, unique main/h1, sitemap and advertising remains off')
