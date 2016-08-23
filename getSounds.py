import csv
from urllib.request import urlopen
import os, sys

def lr_justify(left, right, width):
    return '{}{}{}'.format(left, ' '*(width-len(left+right)), right)
def stdout(left,right):

    sys.stdout.write(lr_justify(left,right,56))
    sys.stdout.write('\b' * len(lr_justify(left,right,56)))   # \b: non-deleting backspace


def download_file(url,cat):
	
	file_name = os.path.join(cat,url.split('/')[-1])
	if os.path.isfile(file_name):
		print ("Already Downloaded")
		return
	usock = urlopen(url)
	
	file_size = usock.headers['Content-Length']
	print ("")
	standard_message = "Downloading: %s Bytes: %s" % (file_name, file_size)

	if os.path.isfile(file_name):
		print ("Already Downloaded")
		return
	f = open(file_name, 'wb')
	downloaded = 0
	block_size = 8192
	file_size = int(file_size)
	while True:
		buff = usock.read(block_size)
		if not buff:
			break

		downloaded = downloaded + len(buff)
		f.write(buff)
		done = int(25 * downloaded / file_size)
		download_mesg = ("\r[%s%s]" % ('=' * done, ' ' * (25-done))) 
		
		
		stdout(download_mesg,standard_message)
		sys.stdout.flush()

	f.close()



with open('tabletopsounds.csv','r') as file:
	reader = csv.reader(file,delimiter=',',quotechar='|')

	for row in reader:
		if row:
			downloaded = []
			if not os.path.exists(row[0]):
				os.makedirs(row[0])
			with open(os.path.join(row[0],'files.js'),'w') as js:
				js.write("var soundfiles = [")
			with open(os.path.join(row[0],'files.js'),'a') as js:
				for i in range(1,len(row)):
					if not row[i]:
						continue
					if i is not 1:
						js.write(",")
					
					if row[i] not in downloaded:
						downloaded.append(row[i])
					
					
						download_file(row[i],row[0])
					else:
						print ("Found duplicate")

					js.write('"'+row[i].split('/')[-1]+'"')
				js.write('];')






