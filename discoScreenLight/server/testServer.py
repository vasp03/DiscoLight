from watchdog.observers import Observer
from watchdog.events import FileSystemEventHandler
from aiohttp import web, WSCloseCode
import asyncio

path = "C:/Users/vikto/Documents/codes/disco/discoScreenLight/server/"

class FileChangedHandler(FileSystemEventHandler):
    print("FileChangedHandler")
    def __init__(self):
        self.data = ""

    async def on_modified(self, event):
        print("on_modified")
        if event.src_path == path+'pageData.txt':
            with open(path+'pageData.txt', 'r') as f:
                self.data = f.read()
                for ws in ws_list:
                    await ws.send_json({'data': self.data})

async def handle(request):
    ws = web.WebSocketResponse()
    await ws.prepare(request)

    async def monitor_file():
        while True:
            with open(path+'pageData.txt', 'r') as f:
                data = f.read()
                await ws.send_json({'data': data})
            await asyncio.sleep(1)

    await asyncio.create_task(monitor_file())
    async for msg in ws:
        pass

    return ws


fileChangedHandler = FileChangedHandler()
ws_list = []

app = web.Application()
app.add_routes([web.get('/', handle)])

def main():
    print("main")
    observer = Observer()
    observer.schedule(fileChangedHandler, path='.', recursive=False)
    observer.start()
    web.run_app(app, host='127.0.0.1', port=5000)

