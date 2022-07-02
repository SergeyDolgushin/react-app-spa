class MarvelService {
    _apiBase = 'http://gateway.marvel.com/v1/public/';
    _apiKey = 'apikey=997bb8aac491739cb51516491f5f7d2f';
    _baseOffset = 210;

    getResource = async (url) => {
        let res = await fetch(url);

        if (!res.ok) {
            throw new Error(`Could not fetch ${url}, status: ${res.status}`);
        }

        return await res.json();
    }

    getAllCharacters = async (offset = this._baseOffset) => {
        const res = await this.getResource(`${this._apiBase}characters?limit=9&offset=${offset}&${this._apiKey}`);
        return res.data.results.map(this._adaptDatafromServer);
    }

    getCharacter = async (id) => {
        const res = await this.getResource(`${this._apiBase}characters/${id}?${this._apiKey}`);
        return this._adaptDatafromServer(res.data.results[0]);
    }

    _adaptDatafromServer = (item) => {
        return {
            name: item.name,
            description: item.description,
            thumbnail: item.thumbnail.path + '.' + item.thumbnail.extension,
            homepage: item.urls[0],
            wiki: item.urls[1],
            id: item.id,
            comics: item.comics.items
        }
    }
}

export default MarvelService;