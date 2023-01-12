import tkinter as tk
from datetime import datetime
import threading
import socket

global server_thread, s, connection_var, conn


def start_server():
    global s, conn, addr
    print("Server has started to start")
    s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    ip_address = ip_entry.get()
    s.bind((ip_address, 12345))
    s.listen(1)
    connection_var.set("Connecting...")

    conn, addr = s.accept()
    print('Connection from:', addr)

    data = conn.recv(1024)
    print(data.decode())
    conn.sendall('Connection Established with Commander'.encode())
    connection_var.set("Connection Established")
    while True:
        try:
            data = conn.recv(1024)
        except E:
            on_disconnect()
        if(data.decode()=="Connection Terminated"):
            print("Disconnected")
            on_disconnect()
            break


def on_close_server():
    global server_thread, connection_var, conn
    try:
        conn.sendall('stop'.encode())
        conn.close()
    except:
        print("Reciver has been closed")

    try:
        server_thread.termnite()
    except:
        print("server_thread Already Closed")
    
    connection_var.set("Disconnected")

def on_connect():
    global server_thread

    if not server_thread.is_alive():
        print("Connect button pressed")
        server_thread = threading.Thread(target=start_server)
        server_thread.start()
    else:
        print("Server is already on")

def on_disconnect():
    print("Disconnect button pressed")
    on_close_server()

def on_send_message():
    global connection_var, conn
    print("Send button pressed")

    if conn:
        entered_text = message_entry.get()
        conn.sendall(entered_text.encode())
        # server_thread.conn.sendall("stop".encode())
        current_time = datetime.now().strftime("%H:%M:%S")
        send_message_var.set("Message Sent: "+current_time)

        if (entered_text == "stop"):
            on_close_server()
    else:
        connection_var.set("Error")
        send_message_var.set("Error")
        print("Error with connection.")


server_thread = threading.Thread(target=start_server, daemon=True)
s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)

root = tk.Tk()
root.geometry("300x210")

root.title("Commander")

connection_var = tk.StringVar()
send_message_var = tk.StringVar()

connection_var.set("Disconnect")
send_message_var.set("No message has been sent")


# Create a label that updates its text based on the value of the var variable
status_label_1 = tk.Label(root, textvariable=connection_var)
status_label_1.pack()

# Create a label that updates its text based on the value of the var variable
status_label_2 = tk.Label(root, textvariable=send_message_var)
status_label_2.pack()

# Create a text input labeled "Ip address"
ip_label = tk.Label(root, text="This Computers Ip: ")
ip_label.pack()

ip_entry = tk.Entry(root)
ip_entry.pack()

# Create a "Connect" button
connect_button = tk.Button(root, text="Connect", command=on_connect)
connect_button.pack()

# Create a "Disconnect" button
connect_button = tk.Button(root, text="Disconnect", command=on_disconnect)
connect_button.pack()

# Create a text input labeled "Message to send"
message_label = tk.Label(root, text="Message to send: ")
message_label.pack()

message_entry = tk.Entry(root)
message_entry.pack()

# Create a "Send" button
send_message_button = tk.Button(root, text="Send", command=on_send_message)
send_message_button.pack()

root.mainloop()
