import subprocess

def my_function():
  subprocess.call('tesseract.exe sample.jpg output.txt -l eng', shell=True)

my_function()