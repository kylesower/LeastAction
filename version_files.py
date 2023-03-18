import os
import shutil
import git
import re


def add_ver_to_html(new_html_path, ver, files):
	with open(new_html_path, 'r+') as f:
		lines = f.read()
	with open(new_html_path, 'w+') as f:
		for file in files:
			if file.endswith(".js") or file.endswith(".css"):
				lines = lines.replace(file, ver + file)
		f.write(lines)


repo = git.Repo(search_parent_directories=True)
sha = repo.head.object.hexsha[:7]
curr_dir = os.getcwd()
files = os.listdir(curr_dir)

web_ignore = os.path.join(curr_dir, ".webignore")
with open(web_ignore, 'r') as f:
	lines = f.read().split('\n')
	for line in lines:
		files.remove(line)
print(files)

build_path = os.path.join(curr_dir, "build")
try: 
	os.mkdir(build_path)
except FileExistsError as e:
	shutil.rmtree(build_path)
	os.mkdir(build_path)

ver = f"v={sha}"
for file in files:
	if file.endswith(".html"):
		new_html_path = os.path.join(build_path, file)
		shutil.copy(os.path.join(curr_dir, file), new_html_path)
		add_ver_to_html(new_html_path, ver, files)
	if file.endswith(".js") or file.endswith(".css"):
		shutil.copy(os.path.join(curr_dir, file), os.path.join(build_path, ver + file))
