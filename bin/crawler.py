import os
import requests
import bs4
import urllib

host = 'http://www.gosugamers.net'
root_url = 'http://www.gosugamers.net/hearthstone/cards'
root_path = '/Users/hello13/Documents/Proj/hearthstone/img'

# GET card names
def get_dir_names(url):
    response = requests.get(url)
    soup = bs4.BeautifulSoup(response.text, 'html.parser')
    return [a.attrs.get('href') for a in soup.select('div.card-list-cards-item a')]

# GET card download urls
def get_image_urls(url):
    response = requests.get(url)
    soup = bs4.BeautifulSoup(response.text, 'html.parser')
    return [img.attrs.get('src') for img in soup.select('div.card-item img[src^=/uploads]')]

for x in xrange(1,36):
    print('Page ' + str(x) + ' started...')
    index_url = root_url + '?page=' + str(x)

    for dir in get_dir_names(index_url):
        dir_name = dir.split('/')[1]
        dir_path = root_path + '/' + dir_name
        page_url = root_url + '/' + dir_name

        # if no exists, then make dirs
        if not os.path.exists(dir_path):
            os.mkdir(dir_path, 0755)

        for url in get_image_urls(page_url):
            card_url = host + url
            card_name = url.split('/')[4]
            card_path = dir_path + '/' + card_name
            # download images
            data = urllib.urlretrieve(card_url, card_path)

        print('Card: ' + dir_name + ' downloads completely.')

print('Cards all download completely.')