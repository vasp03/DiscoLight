import socket
import tkinter as tk
import threading
import testServer

path = "C:/Users/vikto/Documents/codes/disco/discoScreenLight/server/"

global server_thread, web_thread, s, connection_var
s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
root = tk.Tk()
event = threading.Event()
# s.setblocking(0)

def on_connect():
    print("on_connect")
    global s
    if(ip_entry.get()=='0' or ip_entry.get()==''):
        s.connect(('localhost', 12345))
    else:
        s.connect((ip_entry.get(), 12345))
        
    s.sendall('Connection Established from Reciver'.encode())
    connection_var.set("No message has been sent")
    server_thread.start()
    web_thread.start()

def on_message_recived():
    global server_thread, web_thread, s, connection_var
    print("on_message_recived")
    while True:
        if event.is_set():
            print("event Stop")
            break

        try:
            data = s.recv(1024)
        except socket.error as e:
            if e.errno == socket.errno.EAGAIN or e.errno == socket.errno.EWOULDBLOCK:
                print("No data available.")
            else:
                raise

        print('Received:', data.decode())

        connection_var.set(data.decode())

        with open('discoScreenLight/server/pageData.txt', 'w') as f:
            f.write(data.decode())
            
        if (data.decode() == "stop"):
            break
        

    on_disconnect()

def start_webpage():
    web_thread.start()

def webpage():
    print("start_webpage")
    s.sendall('Start testServer.py'.encode())
    testServer.main()

web_thread = threading.Thread(target=webpage, daemon=True)
server_thread = threading.Thread(target=on_message_recived, daemon=True)

def on_disconnect(gui=True):
    global server_thread, web_thread, s, connection_var

    try:
        s.sendall('Connection Terminated'.encode())
        s.close()
    except:
        print("s Already Closed")

    try:
        event.set()
        server_thread.join()
    except:
        print("server_thread Already Closed")

    try:
        web_thread.join()
    except:
        print("web_thread Already Closed")

    if(gui):
        try:
            root.destroy()
        except:
            print("s Already Closed")

    connection_var.set("Disconnected")

def on_disconnect2():
    print("false")
    # on_disconnect(False)
    on_disconnect()

root.geometry("250x210")

root.title("Reciver")

connection_var = tk.StringVar()
send_message_var = tk.StringVar()

connection_var.set("Disconnected")

# Create a label that updates its text based on the value of the var variable
status_label_1 = tk.Label(root, textvariable=connection_var)
status_label_1.pack()

# Create a text input labeled "Ip address"
ip_label = tk.Label(root, text="Ip to connect to: (0=local)")
ip_label.pack()

ip_entry = tk.Entry(root)
ip_entry.pack()

# Create a "on_connect" button
connect_button = tk.Button(root, text="Connect", command=on_connect)
connect_button.pack()

# Create a "on_disconnect" button
connect_button = tk.Button(root, text="Disconnect", command=on_disconnect2)
connect_button.pack()

# Create a "start_webpage" button
connect_button = tk.Button(root, text="Start WebPage", command=start_webpage)
connect_button.pack()

root.mainloop()