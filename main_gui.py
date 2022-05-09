from cgitb import reset
import tkinter as tk
from matplotlib.backends.backend_tkagg import FigureCanvasTkAgg
from matplotlib.figure import Figure
import matplotlib.pyplot as plt
from matplotlib.pyplot import figure
import numpy as np
import time


# number_of_cols = int(input("Enter the number of cols"))

root = tk.Tk()
root.title('Basic Layout of Water Body')
root.configure(background='#232343')
root.geometry("700x600")

fig = figure()
ax = fig.add_subplot(111)

x = [525, 525, 175, 175]
y = [175, 525, 175, 525]

ax.set_title("Water area")
ax.set_xlabel("X coords")
ax.set_ylabel("Y coords")
ax.set_xlim(0, 700)
ax.set_ylim(0, 700)
ax.plot(x, y, 'ro')
lines = ax.plot([], [])[0]

canvas = FigureCanvasTkAgg(fig, master=root)
canvas.get_tk_widget().place(x=10, y=10, width=680, height=450)
canvas.draw()

# create start and stop buttons
root.update()
start = tk.Button(root, text='Start', font=(
    'calbiri', 13), command=lambda: plot_start())
start.place(x=260, y=500)

root.update()
stop = tk.Button(root, text='Stop', font=(
    'calbiri', 13), command=lambda: plot_stop())
stop.place(x=start.winfo_x()+start.winfo_reqwidth()+20, y=500)

root.update()
reset = tk.Button(root, text='Reset', font=(
    'calbiri', 13), command=lambda: plot_reset())
reset.place(x=stop.winfo_x()+start.winfo_reqwidth()+20, y=500)

# start


def plot_start():
    print("Plot started")


def plot_stop():
    print("Plot stopped")


def plot_reset():
    print("Plot has been reset")


root.mainloop()
