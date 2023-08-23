# 由于掘金的图片链接今日开启了防盗链，导致部分图片无法显示，故写此脚本
# 本脚本用于将文章中涉及到掘金上的图片下载到本地，并替换 mdx 文件中的图片链接。
# 下载 ![效果](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e9253e4bfe6e45b8a35c902913c7416d~tplv-k3u1fbpfcp-watermark.image?) 并替换
# 替换后的文件类似于 
# mdx 开头：
# import myImageUrl from '@site/static/img/tutorial-banner.png';
# 实际使用位置：
# <img src = {myImageUrl} width = "100%" align ="center"/> 

# author: @FunnySaltyFish, 2023/08/23

import requests
import re
import os
from typing import List

FOLDER_PATH = "docs"
STATIC_IMG_PATH = "static/img"
JUEJIN_IMG_URL_PATTERN = re.compile(r'!\[(.*?)\]\((https://p\d-juejin.byteimg.com/.*?)\)')
REPLACED_IMG_HTML_PATTERN = r'<img src={{{img_url}}} width="80%" align="center" alt="{alt}"/>'


# 下载图片
def download_img(url: str, save_path: str):
    r = requests.get(url)
    dirpath = os.path.dirname(save_path)
    if not os.path.exists(dirpath):
        os.makedirs(dirpath)
    with open(save_path, 'wb') as f:
        f.write(r.content)


def get_mdx_file_paths(folder: str):
    # 获取文件夹下所有.mdx文件的路径
    # yield 生成器
    for root, dirs, files in os.walk(folder):
        for file in files:
            if file.endswith('.mdx'):
                yield os.path.join(root, file)


def process_one_mdx(file_path: str):
    # 处理一个mdx文件
    with open(file_path, 'r', encoding='utf-8') as f:
        mdx = f.read()
    img_urls = re.findall(JUEJIN_IMG_URL_PATTERN, mdx)
    # print(img_urls)
    # print(file_path)

    def insert_import_statements(import_statements: List[str]):
        # 如果 mdx 文件以
        # ---
        # id: installation
        # title: 安装或更新 Android Studio
        # ---
        # 开头，则在它之后插入。反之，插入到开头
        import_statement = "\n".join(import_statements)
        import_statement += "\n"
        if mdx.startswith("---"):
            # 在第二个 --- 之后插入
            second_idx = mdx.find("---", 3)
            return mdx[:second_idx+4] + import_statement + mdx[second_idx+4:]
        else:
            return import_statement + mdx

    import_statements = []
    for i, img_url in enumerate(img_urls):
        img_name = img_url[0]
        juejin_img_url = img_url[1]
        # 保存位置：STATIC_IMG_PATH/ + file_path 在 docs 之后的路径 + image_{i} + .webp
        save_path = os.path.join(STATIC_IMG_PATH, file_path.split("docs")[1][1:].removesuffix(".mdx") + f'/image_{i+1}.webp')
        # 将 save_path 中的任何小驼峰命名改为下划线命名
        save_path = re.sub(r'([a-z]+)([A-Z])', r'\1_\2', save_path).lower()
        # print(save_path)
        print(f"正在下载 {juejin_img_url} 到 {save_path}")
        download_img(juejin_img_url, save_path)

        # 替换
        save_path = save_path.replace('\\', '/')
        new_img_var_name = f"image{i+1}"
        new_import_statement = f"import {new_img_var_name} from \'@site/{save_path}\';"
        import_statements.append(new_import_statement)
        mdx = JUEJIN_IMG_URL_PATTERN.sub(lambda m: REPLACED_IMG_HTML_PATTERN.format(alt=m.group(1), img_url=new_img_var_name), mdx, count=1)

    # 插入 import 语句
    if import_statements:
        mdx = insert_import_statements(import_statements)
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(mdx)
    # print(mdx)
    print(f"{file_path} 处理完毕 ")
    


if __name__ == "__main__":
    for mdx_file_path in get_mdx_file_paths(FOLDER_PATH):
        # print(mdx_file_path)
        process_one_mdx(mdx_file_path)
    # process_one_mdx(r"docs\open-source-project\compose-moon-animation.mdx")
    