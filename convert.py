import os
import shutil
import re
# parse old/_posts and list folders

stringtypes = [
    "title",
    "description",
    "image",
    "categories",
    "slug",
    "position",
    "reveal",
    "video",
]
ignore = ["layout"]
array = ["tags"]

for root, dirs, files in os.walk("old/_posts"):
    if len(dirs) > 0:
        for dir in dirs:
            try:
                shutil.rmtree(f"monkeyuser/content/{dir}")
            except:
                pass
            os.mkdir(f"monkeyuser/content/{dir}")

    for file in files:
        assets = []
        if file.endswith(".md"):
            # read markdown file
            with open(os.path.join(root, file), "r") as f:
                data = f.readlines()

            new_path = root.replace("old/_posts", "monkeyuser/content")
            comic_name_without_extension = file.split(".")[0]
            comic_name_without_date = "-".join(
                comic_name_without_extension.split("-")[3:]
            )

            is_header = None
            for index, line in enumerate(data):
                if line == "---\n":
                    if is_header:
                        is_header = False
                    else:
                        is_header = True
                    data[index] = "+++\n"
                elif is_header:
                    group = line.split(": ")
                    if len(group) > 1:
                        group[1] = group[1].replace("\n", "")
                        group[1] = group[1].replace("'", "")
                        if group[0] in ignore:
                            data[index] = ""
                            continue
                        if group[0] in stringtypes:
                            data[index] = f"{group[0]} = '{group[1]}'\n"
                        elif group[0] in array:
                            split = group[1].split(" ")
                            data[index] = f"{group[0]} = ["
                            for item in split:
                                data[index] += f"'{item}', "
                            data[index] = data[index][:-2]
                            data[index] += "]\n"
                        else:
                            data[index] = f"{group[0]} = {group[1]}\n"
                    else:
                        data[index] = ""

                elif is_header is False:
                    data[index] = re.sub(
                        r"\(.*/assets/images/(\d{4})/(\d+-)(.*)\.([png|jpeg|jpg])",
                        rf"(/\1/{comic_name_without_date}/\2\3.\4",
                        line,
                    )

                    if "{{ site.url }}/assets/images" in line:
                        # get asset name
                        asset = line.split("{{ site.url }}/assets/images/")[1]
                        asset = asset.split("\n")[0]
                        asset = asset.split(" ")[0]
                        if asset.endswith('"'):
                            asset = asset[:-1]
                        assets.append(asset)

            if is_header:
                data.append("+++\n")

            mkdir_path = os.path.join(new_path, comic_name_without_date)
            os.mkdir(mkdir_path)

            # write markdown file
            with open(
                os.path.join(mkdir_path, "index.md"),
                "w",
            ) as f:
                f.write("".join(data))

            # walk through assets and copy in newly created folder
            for asset in assets:
                asset_path = os.path.join("./old/assets/images/", asset)

                shutil.copy(asset_path, mkdir_path)
